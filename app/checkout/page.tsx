'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '@/providers/CartContext'
import dynamic from 'next/dynamic'
import ShippingMethodSelector from '@/components/ShippingMethodSelector'
import CheckoutForm from '@/components/CheckoutForm'

// Dynamically import ShippingAddressForm (Mapbox requires browser APIs)
const ShippingAddressForm = dynamic(() => import('@/components/ShippingAddressForm'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      <span className="ml-3 text-gray-600">Loading address form...</span>
    </div>
  )
})

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface ShippingAddress {
  first_name: string
  last_name: string
  email: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal } = useCart()
  
  // Contact
  const [email, setEmail] = useState('')
  
  // Delivery
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  
  // Shipping Method
  const [shippingMethods, setShippingMethods] = useState<Record<string, { cost: number; costCents: number }>>({})
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null)
  const [shippingCost, setShippingCost] = useState(0)
  
  // Payment
  const [clientSecret, setClientSecret] = useState('')
  const [taxAmount, setTaxAmount] = useState(0)
  const [isPreparingPayment, setIsPreparingPayment] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = getTotal()
  const total = subtotal + shippingCost + taxAmount

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleAddressComplete = async (address: Omit<ShippingAddress, 'email'>) => {
    // Add email from contact form
    const fullAddress: ShippingAddress = { ...address, email }
    setShippingAddress(fullAddress)
    setIsCalculatingShipping(true)

    try {
      const lineItems = items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }))

      const response = await fetch('/api/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems, address: fullAddress }),
      })

      if (!response.ok) throw new Error('Failed to calculate shipping')

      const methods = await response.json()
      setShippingMethods(methods)
      
      // Auto-select economy if available
      if (methods.economy) {
        setSelectedShippingMethod('economy')
        setShippingCost(methods.economy.cost)
      } else if (Object.keys(methods).length > 0) {
        const firstMethod = Object.keys(methods)[0]
        setSelectedShippingMethod(firstMethod)
        setShippingCost(methods[firstMethod].cost)
      }
    } catch (error) {
      console.error('Shipping calculation error:', error)
      alert('Failed to calculate shipping. Please try again.')
    } finally {
      setIsCalculatingShipping(false)
    }
  }

  const handleShippingMethodSelect = (method: string, costCents: number) => {
    setSelectedShippingMethod(method)
    setShippingCost(costCents / 100)
  }

  // Prepare payment when shipping is selected
  useEffect(() => {
    if (!selectedShippingMethod || !shippingAddress || clientSecret) return

    const preparePayment = async () => {
      setIsPreparingPayment(true)
      
      try {
        // Calculate tax
        const taxResponse = await fetch('/api/calculate-tax', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            shippingCost,
            shippingAddress,
          }),
        })

        if (!taxResponse.ok) throw new Error('Failed to calculate tax')
        const taxData = await taxResponse.json()
        setTaxAmount(taxData.taxAmount)

        // Create payment intent
        const paymentResponse = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            shippingCost,
            shippingAddress,
            shippingMethod: selectedShippingMethod,
            taxAmount: taxData.taxAmount,
            taxCalculationId: taxData.taxCalculationId,
          }),
        })

        if (!paymentResponse.ok) throw new Error('Failed to create payment intent')
        const paymentData = await paymentResponse.json()
        
        setClientSecret(paymentData.clientSecret)
        setOrderId(paymentData.orderId)
      } catch (error) {
        console.error('Payment preparation error:', error)
        alert('Failed to prepare payment. Please try again.')
      } finally {
        setIsPreparingPayment(false)
      }
    }

    preparePayment()
  }, [selectedShippingMethod, shippingAddress, items, shippingCost, clientSecret])

  if (items.length === 0) {
    return null // Redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* 1. Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* 2. Delivery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery</h2>
              <ShippingAddressForm 
                onAddressConfirmed={handleAddressComplete}
                isCalculating={isCalculatingShipping}
              />
            </div>

            {/* 3. Shipping Method */}
            {Object.keys(shippingMethods).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Method</h2>
                <ShippingMethodSelector
                  methods={shippingMethods}
                  selectedMethod={selectedShippingMethod}
                  onMethodSelect={handleShippingMethodSelect}
                />
              </div>
            )}

            {/* 4. Payment */}
            {clientSecret && selectedShippingMethod && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm orderId={orderId} />
                </Elements>
              </div>
            )}

            {/* Loading state */}
            {isPreparingPayment && selectedShippingMethod && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                  <span className="ml-3 text-gray-600">Preparing payment...</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.productTitle}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="grow">
                      <p className="text-sm font-medium text-gray-900">{item.productTitle}</p>
                      <p className="text-xs text-gray-600">{item.colorName} / {item.sizeName}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 
                     selectedShippingMethod ? 'Calculating...' : 'Enter address'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>
                    {isPreparingPayment ? 'Calculating...' : `$${taxAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
