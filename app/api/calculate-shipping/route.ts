import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/printify';

export async function POST(request: NextRequest) {
  try {
    const { lineItems, address } = await request.json();

    if (!lineItems || !address) {
      return NextResponse.json(
        { error: 'Line items and shipping address are required' },
        { status: 400 }
      );
    }

    // Validate address has required fields
    const requiredFields = ['first_name', 'last_name', 'country', 'region', 'address1', 'city', 'zip'];
    for (const field of requiredFields) {
      if (!address[field]) {
        return NextResponse.json(
          { error: `Missing required address field: ${field}` },
          { status: 400 }
        );
      }
    }

    console.log('[PRINTIFY] Calculating shipping for', lineItems.length, 'item(s) to', address.zip);
    const shippingCosts = await calculateShipping(lineItems, {
      ...address,
      email: 'customer@example.com', // Placeholder - not used for shipping calculation
      phone: '555-0000', // Placeholder - not used for shipping calculation
    });
    
    // Convert from cents to dollars for frontend
    const formattedCosts = Object.entries(shippingCosts).reduce((acc, [method, cost]) => {
      if (cost !== undefined) {
        acc[method] = {
          cost: cost / 100,
          costCents: cost,
        };
      }
      return acc;
    }, {} as Record<string, { cost: number; costCents: number }>);

    console.log('[PRINTIFY] ✅ Shipping calculated');
    return NextResponse.json(formattedCosts);
  } catch (error) {
    console.error('[PRINTIFY] Shipping calculation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}
