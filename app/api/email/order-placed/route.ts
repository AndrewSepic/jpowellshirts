import { NextRequest, NextResponse } from 'next/server';
import { sendOrderPlacedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { to, orderId, customerName } = await request.json();
    if (!to || !orderId || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await sendOrderPlacedEmail({ to, orderId, customerName });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
