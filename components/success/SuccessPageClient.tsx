'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/CartContext'
import { geocodeAddress } from '@/lib/utils'

interface SuccessPageClientProps {
  orderId: string | undefined
  shippingAddress: any
}

export default function SuccessPageClient({ orderId, shippingAddress }: SuccessPageClientProps) {
  const { clearCart } = useCart();
  const [ geocodedAddress, setGeocodedAddress ] = useState(null)

  useEffect(() => {
    // Clear cart on successful payment
    clearCart()
    // Also clear session storage
    localStorage.removeItem('cart')
	
	const getGeoCode = async () => {
		const geo = await geocodeAddress(shippingAddress)
		console.log("geo", geo)
		setGeocodedAddress(geo)
	}

	getGeoCode()

  }, []) 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order. Your payment has been processed successfully.
          </p>
          
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          {shippingAddress && (
            <p className="text-gray-700 mb-6">
              Your order will be shipped to{' '}
              <span className="font-semibold">{shippingAddress.city}, {shippingAddress.region}</span>
            </p>
          )}

		  {geocodedAddress && (
			'We got a geocode!'
		  )}

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What happens next?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-600 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your order is being processed and sent to production</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
