'use client';

import { useCallback } from 'react';
import { AddressAutofill, useConfirmAddress } from '@mapbox/search-js-react';

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN environment variable is required');
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface ShippingAddress {
  first_name: string;
  last_name: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

interface ShippingAddressFormProps {
  onAddressConfirmed: (address: ShippingAddress) => void;
  isCalculating?: boolean;
}

export default function ShippingAddressForm({ onAddressConfirmed, isCalculating }: ShippingAddressFormProps) {
  const { formRef, showConfirm } = useConfirmAddress({
    accessToken: MAPBOX_ACCESS_TOKEN
  });


  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await showConfirm();

    // if no change is suggested, the address is confirmed
    if (result.type === 'nochange' && formRef.current) {
      const formData = new FormData(formRef.current);
      
      const address: ShippingAddress = {
        first_name: formData.get('first-name') as string,
        last_name: formData.get('last-name') as string,
        country: formData.get('country') as string || 'US',
        region: formData.get('address-level1') as string,
        address1: formData.get('address-line1') as string,
        address2: formData.get('address-line2') as string || undefined,
        city: formData.get('address-level2') as string,
        zip: formData.get('postal-code') as string,
      };

      onAddressConfirmed(address);
    }
  }, [showConfirm, onAddressConfirmed]);

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            autoComplete="given-name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            autoComplete="family-name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} >
        <div>
          <label htmlFor="address-line1" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address-line1"
            name="address-line1"
            autoComplete="address-line1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </AddressAutofill>

      <div>
        <label htmlFor="address-line2" className="block text-sm font-medium text-gray-700 mb-1">
          Apartment, Suite, etc.
        </label>
        <input
          type="text"
          id="address-line2"
          name="address-line2"
          autoComplete="address-line2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-level2" className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            id="address-level2"
            name="address-level2"
            autoComplete="address-level2"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="address-level1" className="block text-sm font-medium text-gray-700 mb-1">
            State/Region *
          </label>
          <input
            type="text"
            id="address-level1"
            name="address-level1"
            autoComplete="address-level1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP/Postal Code *
          </label>
          <input
            type="text"
            id="postal-code"
            name="postal-code"
            autoComplete="postal-code"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            autoComplete="country"
            defaultValue="US"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isCalculating}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isCalculating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer'
        }`}
      >
        {isCalculating ? 'Calculating Shipping...' : 'Calculate Shipping'}
      </button>
    </form>
  );
}

// TypeScript declaration for Mapbox
declare global {
  interface Window {
    mapboxsearch?: any;
  }
}
