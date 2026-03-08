import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stripe } from '../../lib/stripe';
import SuccessPageClient from '@/components/success/SuccessPageClient';

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ payment_intent?: string; order_id?: string }> 
}) {
  const { payment_intent, order_id } = await searchParams;

  if (!payment_intent) {
    redirect('/');
  }

  // Retrieve the payment intent from Stripe to verify payment
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

  const { status, metadata } = paymentIntent;

  // If payment is still processing, show pending message
  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Payment Processing</h1>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. Please check back later.
          </p>
          <Link href="/" className="text-sky-700 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // If payment is not successful, show error
  if (status !== 'succeeded') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            Your payment was not completed. Please try again.
          </p>
          <Link href="/cart" className="text-sky-700 hover:underline">
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  const orderId = metadata?.orderId || order_id;
  const shippingAddress = metadata?.shippingAddress ? JSON.parse(metadata.shippingAddress) : null;

  // We return a client component here on success so that we can 
  // use Hooks clearCart() and clear sessionStorage
  return <SuccessPageClient orderId={orderId} shippingAddress={shippingAddress}/>;
}
