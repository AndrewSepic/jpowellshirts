'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartContext';

function CartContent() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');
  const router = useRouter();
  const { getTotal, items, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    router.push('/checkout')
  };

  const subtotal = getTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Canceled Message */}
        {canceled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Order canceled - Continue shopping and checkout when you're ready.
            </p>
          </div>
        )}

        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Preview</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Items</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.productTitle}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{item.productTitle}</h3>
                      <p className="text-sm text-gray-600">{item.colorName} / {item.sizeName}</p>
                      <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} each</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

    

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer mt-4"
              >
                {'Proceed to Checkout'}
              </button>

              {/* Back to Shopping Button */}
              <button
                onClick={() => router.push('/')}
                className="w-full bg-white border border-sky-500 text-sky-600 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors mt-2 cursor-pointer"
              >
                {'Back to Shopping'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-gray-600">Loading cart...</div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
