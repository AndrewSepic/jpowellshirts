import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import type { ShippingAddress } from '@/app/cart/page'

interface CartItem {
  productId: string;
  variantId: number;
  productTitle: string;
  variantTitle: string;
  price: number;
  quantity: number;
}

interface TaxRequest {
  items: CartItem[];
  shippingCost: number;
  shippingAddress: ShippingAddress;
}

export async function POST(request: Request) {
  try {
    const { items, shippingCost, shippingAddress }: TaxRequest = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address required for tax calculation' },
        { status: 400 }
      )
    }

    // Build line items for tax calculation
    const lineItems = items.map((item, index) => ({
      amount: Math.round(item.price * 100), // Convert to cents
      reference: `item_${index}`,
      quantity: item.quantity,
    }))

    // Add shipping as a line item
    if (shippingCost > 0) {
      lineItems.push({
        amount: Math.round(shippingCost * 100),
        reference: 'shipping_cost',
        quantity: 1,
      })
    }

    // Calculate tax using Stripe Tax Calculations API
    const calculation = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: lineItems,
      customer_details: {
        address: {
          line1: shippingAddress.address1,
          line2: shippingAddress.address2 || undefined,
          city: shippingAddress.city,
          state: shippingAddress.region,
          postal_code: shippingAddress.zip,
          country: shippingAddress.country,
        },
        address_source: 'shipping',
      },
    })

    // Return tax amount and breakdown
    return NextResponse.json({
      taxAmount: calculation.tax_amount_exclusive / 100, // Convert back to dollars
      taxCalculationId: calculation.id, // Store this for the payment intent
      breakdown: calculation.tax_breakdown,
    })
  } catch (err: any) {
    console.error('Tax calculation error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to calculate tax' },
      { status: err.statusCode || 500 }
    )
  }
}
