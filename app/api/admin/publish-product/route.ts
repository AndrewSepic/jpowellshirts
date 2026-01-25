import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { productId, handle } = await request.json();

    if (!productId || !handle) {
      return NextResponse.json(
        { error: 'Product ID and handle are required' },
        { status: 400 }
      );
    }

    const shopId = process.env.PRINTIFY_SHOP_ID;
    const apiToken = process.env.PRINTIFY_API_TOKEN;

    if (!shopId || !apiToken) {
      return NextResponse.json(
        { error: 'Printify credentials not configured' },
        { status: 500 }
      );
    }

    // Make request to Printify API
    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS',
        },
        body: JSON.stringify({ external: { id: handle, handle } }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Failed to update publishing status', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Publishing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
