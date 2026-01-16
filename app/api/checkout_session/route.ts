import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { generateOrderId } from '../../../lib/utils'

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  printifyProductId?: string;
  printifyVariantId?: string;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Get cart items from request body
    const { items }: { items: CartItem[] } = await request.json()
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Generate unique order ID
    const orderId = generateOrderId()

    // Create line items for Stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.imageUrl.startsWith('http') ? item.imageUrl : `${origin}${item.imageUrl}`],
          metadata: {
            printifyProductId: item.printifyProductId || 'mock',
            printifyVariantId: item.printifyVariantId || 'mock',
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Adjust as needed
      },
      metadata: {
        orderId,
        items: JSON.stringify(items.map(item => ({
          id: item.id,
          printifyProductId: item.printifyProductId || 'mock',
          printifyVariantId: item.printifyVariantId || 'mock',
          quantity: item.quantity,
        }))),
      },
    });
    
    // Return the checkout URL as JSON instead of redirecting
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout session error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}