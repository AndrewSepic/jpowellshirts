import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { generateOrderId } from '../../../lib/utils'
import type { ShippingAddress } from '@/app/checkout/page'

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

interface PaymentIntentRequest {
  items: CartItem[];
  shippingCost: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  taxAmount: number;
  taxCalculationId: string;
}

export async function POST(request: Request) {
  try {
    const { 
      items, 
      shippingCost, 
      shippingAddress,
      shippingMethod,
      taxAmount,
      taxCalculationId 
    }: PaymentIntentRequest = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const total = subtotal + shippingCost + taxAmount

    // Generate unique order ID
    const orderId = generateOrderId()

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
        taxCalculationId,
        shippingMethod,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map(item => ({
          printifyProductId: item.productId,
          printifyVariantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
		  productTitle: item.productTitle,
		  color: item.colorName,
		  size: item.sizeName,
        }))),
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2),
      },
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId 
    })
  } catch (err: any) {
    console.error('Payment Intent error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
