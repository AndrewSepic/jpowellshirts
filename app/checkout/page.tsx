'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../../components/CheckoutForm'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [orderSummary, setOrderSummary] = useState<{
    items: any[]
    subtotal: number
    shippingCost: number
    taxAmount: number
    total: number
  } | null>(null)

  useEffect(() => {
    // Get checkout data from session storage
    const checkoutDataStr = sessionStorage.getItem('checkoutData')
    if (!checkoutDataStr) {
      router.push('/cart')
      return
    }

    const checkoutData = JSON.parse(checkoutDataStr)
    const { items, shippingCost, shippingAddress, shippingMethod } = checkoutData

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )

    // First, calculate tax
    fetch('/api/calculate-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shippingCost,
        shippingAddress,
      }),
    })
      .then(res => res.json())
      .then(taxData => {
        if (taxData.error) {
          setError(taxData.error)
          setIsLoading(false)
          return
        }

        const total = subtotal + shippingCost + taxData.taxAmount

        // Store order summary
        setOrderSummary({
          items,
          subtotal,
          shippingCost,
          taxAmount: taxData.taxAmount,
          total,
        })

        // Then create payment intent
        return fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            shippingCost,
            shippingAddress,
            shippingMethod,
            taxAmount: taxData.taxAmount,
            taxCalculationId: taxData.taxCalculationId,
          }),
        })
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.error) {
          setError(data.error)
          setIsLoading(false)
          return
        }

        setClientSecret(data.clientSecret)
        setOrderId(data.orderId)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Checkout error:', err)
        setError('Failed to initialize checkout')
        setIsLoading(false)
      })
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Return to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {orderSummary?.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.productTitle}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productTitle}</p>
                    <p className="text-sm text-gray-600">{item.variantTitle}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${orderSummary?.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>${orderSummary?.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${orderSummary?.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${orderSummary?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
            {clientSecret && (
              <Elements 
                stripe={stripePromise} 
                options={{ clientSecret }}
              >
                <CheckoutForm orderId={orderId} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
