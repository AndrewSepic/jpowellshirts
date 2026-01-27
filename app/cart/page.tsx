'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartContext';
import ShippingAddressForm from '@/components/ShippingAddressForm';
import ShippingMethodSelector from '@/components/ShippingMethodSelector';

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export default function OrderPreviewPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethods, setShippingMethods] = useState<Record<string, { cost: number; costCents: number }>>({});
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const { getTotal, items, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const shippingMethodsRef = useRef<HTMLDivElement>(null);

  const handleAddressComplete = async (address: ShippingAddress) => {
    setShippingAddress(address);
    setIsCalculatingShipping(true);

    try {
      // Transform cart items to Printify line items format
      const lineItems = items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/calculate-shipping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems, address }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping');
      }

      const methods = await response.json();
      setShippingMethods(methods);
      
      // Auto-select economy shipping if available
      if (methods.economy) {
        setSelectedShippingMethod('economy');
        setShippingCost(methods.economy.cost);
      } else if (Object.keys(methods).length > 0) {
        const firstMethod = Object.keys(methods)[0];
        setSelectedShippingMethod(firstMethod);
        setShippingCost(methods[firstMethod].cost);
      }
      
      // Scroll to shipping methods after they load
      setTimeout(() => {
        shippingMethodsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (error) {
      console.error('Shipping calculation error:', error);
      alert('Failed to calculate shipping. Please try again.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleShippingMethodSelect = (method: string, costCents: number) => {
    setSelectedShippingMethod(method);
    setShippingCost(costCents / 100);
  };

  const handleCheckout = async () => {
    if (!shippingAddress || !selectedShippingMethod) {
      alert('Please enter shipping address and select a shipping method');
      return;
    }

    // Store checkout data in session storage for the checkout page
    const checkoutData = {
      items,
      shippingAddress,
      shippingMethod: selectedShippingMethod,
      shippingCost,
    }
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))
    
    // Navigate to checkout page
    router.push('/checkout')
  };

  const subtotal = getTotal();
  const total = subtotal + shippingCost;

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

            {/* Shipping Address Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <ShippingAddressForm 
                onAddressConfirmed={handleAddressComplete}
                isCalculating={isCalculatingShipping}
              />
            </div>

            {/* Shipping Methods */}
            {Object.keys(shippingMethods).length > 0 && (
              <div ref={shippingMethodsRef} className="bg-white rounded-lg shadow-md p-6">
                <ShippingMethodSelector
                  methods={shippingMethods}
                  selectedMethod={selectedShippingMethod}
                  onMethodSelect={handleShippingMethodSelect}
                />
              </div>
            )}
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Enter address'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}{shippingCost === 0 ? '+' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || !shippingAddress || !selectedShippingMethod}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
