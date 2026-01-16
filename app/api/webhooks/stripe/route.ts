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
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('💳 Payment successful:', session.id);

    // Extract order data from session metadata
    const orderId = session.metadata?.orderId;
    const itemsJson = session.metadata?.items;

    if (!orderId || !itemsJson) {
      console.error('Missing order data in session metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const items = JSON.parse(itemsJson);
    const shippingDetails = session.shipping_details;

    if (!shippingDetails) {
      console.error('Missing shipping details');
      logFailedOrder(orderId, session.id, 'Missing shipping details', { items });
      return NextResponse.json({ error: 'Missing shipping' }, { status: 400 });
    }

    // Prepare Printify order data
    const printifyItems = items.map((item: any) => ({
      product_id: item.printifyProductId,
      variant_id: parseInt(item.printifyVariantId),
      quantity: item.quantity,
    }));

    const shippingAddress = {
      first_name: shippingDetails.name?.split(' ')[0] || 'Customer',
      last_name: shippingDetails.name?.split(' ').slice(1).join(' ') || '',
      email: session.customer_details?.email || '',
      phone: session.customer_details?.phone || '',
      country: shippingDetails.address?.country || '',
      region: shippingDetails.address?.state || '',
      address1: shippingDetails.address?.line1 || '',
      address2: shippingDetails.address?.line2 || '',
      city: shippingDetails.address?.city || '',
      zip: shippingDetails.address?.postal_code || '',
    };

    try {
      // Create order in Printify
      console.log('📦 Creating Printify order for:', orderId);
      const printifyOrder = await createOrder(orderId, printifyItems, shippingAddress);
      
      // Submit to production
      console.log('🏭 Submitting to production:', printifyOrder.id);
      await submitOrderForProduction(printifyOrder.id);
      
      console.log('✅ Order successfully sent to Printify:', orderId);
    } catch (error: any) {
      console.error('Failed to process Printify order:', error);
      logFailedOrder(orderId, session.id, error.message, {
        items: printifyItems,
        shippingAddress,
      });
    }
  }

  return NextResponse.json({ received: true });
}
