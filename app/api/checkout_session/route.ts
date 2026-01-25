import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { generateOrderId } from '../../../lib/utils'
import type { ShippingAddress } from '@/app/cart/page'

interface CartItem {
  productId: string;
  variantId: number;
  productTitle: string;
  variantTitle: string;
  price: number;
  imageUrl: string;
  colorName?: string;
  sizeName?: string;
  quantity: number;
}



export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Get cart items from request body
    const { items, shippingCost, shippingAddress, shippingMethod }: 
	{ 
		items: CartItem[], 
		shippingCost: Number, 
		shippingAddress: ShippingAddress,
		shippingMethod: String } = await request.json()
    
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
          name: `${item.productTitle} - ${item.variantTitle}`,
          images: [item.imageUrl.startsWith('http') ? item.imageUrl : `${origin}${item.imageUrl}`],
          metadata: {
            printifyProductId: item.productId,
            printifyVariantId: item.variantId.toString(),
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item
    if (shippingCost) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Shipping - ${shippingMethod}`,
            description: `Delivery to ${shippingAddress.city}, ${shippingAddress.region}`,
          },
          unit_amount: Math.round(Number(shippingCost) * 100), // Convert to cents
        },
        quantity: 1,
      })
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
      metadata: {
        orderId,
        items: JSON.stringify(items.map(item => ({
          id: item.productId,
          printifyProductId: item.productId || 'mock',
          printifyVariantId: item.variantId || 'mock',
          quantity: item.quantity,
        }))),
        shippingMethod: String(shippingMethod),
        shippingAddress: JSON.stringify(shippingAddress),
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