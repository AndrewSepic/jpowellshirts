'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PrintifyProduct, getDefaultImage } from '@/lib/printify';

interface AdminProductManagerProps {
  products: PrintifyProduct[];
}

export default function AdminProductManager({ products }: AdminProductManagerProps) {
  const [publishingStates, setPublishingStates] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const getProductStatus = (product: PrintifyProduct) => {
    const localState = publishingStates[product.id];
    if (localState === 'loading') return 'loading';
    if (localState === 'success') return 'success';
    if (localState === 'error') return 'error';
    
    // Check actual Printify status
    if (product.external?.id || product.external?.handle) {
      return 'published';
    }
    return 'ready';
  };

  const handlePublish = async (productId: string, productTitle: string) => {
    setPublishingStates(prev => ({ ...prev, [productId]: 'loading' }));
    setErrorMessages(prev => ({ ...prev, [productId]: '' }));

    try {
      // Generate a handle from product title (lowercase, replace spaces with hyphens)
      const handle = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const response = await fetch('/api/admin/publish-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, handle }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish product');
      }

      setPublishingStates(prev => ({ ...prev, [productId]: 'success' }));
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setPublishingStates(prev => ({ ...prev, [productId]: 'idle' }));
      }, 3000);
    } catch (error) {
      console.error('Publishing error:', error);
      setPublishingStates(prev => ({ ...prev, [productId]: 'error' }));
      setErrorMessages(prev => ({ 
        ...prev, 
        [productId]: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const status = getProductStatus(product);
              const imageUrl = getDefaultImage(product);

              return (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {product.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      status === 'success' || status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : status === 'loading'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {status === 'success' && '✓ Just Published'}
                      {status === 'published' && '✓ Published'}
                      {status === 'error' && '✗ Error'}
                      {status === 'loading' && 'Publishing...'}
                      {status === 'ready' && 'Not Published'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handlePublish(product.id, product.title)}
                      disabled={status === 'loading' || status === 'published'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        status === 'loading' || status === 'published'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer'
                      }`}
                    >
                      {status === 'loading' ? 'Publishing...' : 'Set Published'}
                    </button>
                    {errorMessages[product.id] && (
                      <p className="text-red-600 text-xs mt-1">
                        {errorMessages[product.id]}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
