import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createOrder, submitOrderForProduction } from '@/lib/printify';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

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
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    console.log('💳 Payment successful:', paymentIntent.id);

    // Extract order data from payment intent metadata
    const orderId = paymentIntent.metadata?.orderId;
    const itemsJson = paymentIntent.metadata?.items;
    const shippingAddressJson = paymentIntent.metadata?.shippingAddress;
    const shippingMethod = paymentIntent.metadata?.shippingMethod;

    if (!orderId || !itemsJson || !shippingAddressJson) {
      console.error('Missing order data in payment intent metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const items = JSON.parse(itemsJson);
    const shippingAddress = JSON.parse(shippingAddressJson);

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
      console.log('📦 Creating Printify order for:', orderId);
      const printifyOrder = await createOrder(orderId, printifyItems, printifyAddress);
      
      // Submit to production
      console.log('🏭 Submitting to production:', printifyOrder.id);
      await submitOrderForProduction(printifyOrder.id);
      
      console.log('✅ Order successfully sent to Printify:', orderId);
    } catch (error: any) {
      console.error('Failed to process Printify order:', error);
      logFailedOrder(orderId, paymentIntent.id, error.message, {
        items: printifyItems,
        shippingAddress: printifyAddress,
      });
    }
  }

  return NextResponse.json({ received: true });
}
