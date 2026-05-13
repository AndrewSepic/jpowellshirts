
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PUBLISHED_PRODUCTS_PATH = path.join(process.cwd(), 'published-products.json');

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { productId, handle, updatedAt } = await request.json();

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

    // Update published-products.json
    let publishedProducts: Record<string, string> = {};
    try {
      const file = await fs.readFile(PUBLISHED_PRODUCTS_PATH, 'utf-8');
      publishedProducts = JSON.parse(file);
    } catch (e) {
      // File may not exist yet
    }
    if (updatedAt) {
      publishedProducts[productId] = updatedAt;
      await fs.writeFile(PUBLISHED_PRODUCTS_PATH, JSON.stringify(publishedProducts, null, 2));
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[PRINTIFY] Publishing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
