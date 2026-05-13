import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { redis } from '@/lib/redis';
import { createOrder, getProduct, getImagesForVariant } from '@/lib/printify';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { sendOrderPlacedEmail } from '@/lib/email';

const FAILED_ORDERS_FILE = join(process.cwd(), 'failed-orders.json');

// Log failed orders to JSON file for manual retry
function logFailedOrder(orderId: string, sessionId: string, error: string, orderData: any) {
  try {
    let failedOrders = [];
    if (existsSync(FAILED_ORDERS_FILE)) {
      const content = readFileSync(FAILED_ORDERS_FILE, 'utf-8');
      failedOrders = JSON.parse(content);
    }

    failedOrders.push({
      orderId,
      sessionId,
      timestamp: new Date().toISOString(),
      error,
      orderData,
    });

    writeFileSync(FAILED_ORDERS_FILE, JSON.stringify(failedOrders, null, 2));
    console.log('❌ Failed order logged to file:', orderId);
  } catch (err) {
    console.error('Failed to log failed order:', err);
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[STRIPE] Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('[STRIPE] 💳 Payment successful:', paymentIntent.id);

    // Get OrderId from Stripe payment intent metadata
     const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error('[STRIPE] Missing orderId in payment intent metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

	// Retrieve full order data from Redis
    console.log('[UPSTASH] Fetching order:', orderId);
    const orderDataRaw = await redis.get(`order:${orderId}`);

    if (!orderDataRaw) {
      console.error('[UPSTASH] Order data not found in Redis for orderId:', orderId);
      return NextResponse.json({ error: 'Order data not found' }, { status: 400 });
    }

    console.log('[UPSTASH] ✅ Order retrieved');
    const orderData = typeof orderDataRaw === 'string' ? JSON.parse(orderDataRaw) : orderDataRaw;
    const { items, shippingAddress, shippingMethod } = orderData;


    // Prepare Printify order data
    const printifyItems = items.map((item: any) => ({
      product_id: item.printifyProductId,
      variant_id: parseInt(item.printifyVariantId),
      quantity: item.quantity,
    }));

    // Format address for Printify (address already in correct format from cart)
    const printifyAddress = {
      first_name: shippingAddress.first_name,
      last_name: shippingAddress.last_name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      country: shippingAddress.country,
      region: shippingAddress.region,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city,
      zip: shippingAddress.zip,
    };

    try {
      // Create order in Printify
      console.log('[PRINTIFY] 📦 Creating order for:', orderId);
      await createOrder(orderId, printifyItems, printifyAddress, shippingMethod);

	  try {
		// Enrich items with image URLs from Printify (kept out of Stripe metadata to avoid 500 char limit)
		const enrichedItems = await Promise.all(items.map(async (item: any) => {
			const product = await getProduct(item.printifyProductId);
			const imageUrl = product
				? (getImagesForVariant(product, item.printifyVariantId)[0]?.src ?? product.images[0]?.src ?? '')
				: '';
			return { ...item, imageUrl };
		}));

		await sendOrderPlacedEmail({
			to: shippingAddress.email,
			orderId: orderId,
			customerName: shippingAddress.first_name,
			items: enrichedItems
		});
	  } catch(err) {
		console.error("[MAILGUN] Problem sending customer order confirmation email: ", err)
	  }

      console.log('[PRINTIFY] ✅ Order successfully sent:', orderId);

	  // Clean up Redis entry
	  await redis.del(`order:${orderId}`)
	  console.log('[UPSTASH] ✅ Order data cleaned up:', orderId)

    } catch (error: any) {
      console.error('[PRINTIFY] Failed to process order:', error);
      logFailedOrder(orderId, paymentIntent.id, error.message, {
        items: printifyItems,
        shippingAddress: printifyAddress,
      });
    }
  }

  return NextResponse.json({ received: true });
}
