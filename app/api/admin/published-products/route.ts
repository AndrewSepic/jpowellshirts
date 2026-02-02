import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PUBLISHED_PRODUCTS_PATH = path.join(process.cwd(), 'published-products.json');

export async function GET() {
  try {
    let publishedProducts: Record<string, string> = {};
    try {
      const file = await fs.readFile(PUBLISHED_PRODUCTS_PATH, 'utf-8');
      publishedProducts = JSON.parse(file);
    } catch (e) {
      // File may not exist yet
    }
    return NextResponse.json({ publishedProducts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read published products' }, { status: 500 });
  }
}
