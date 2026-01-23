'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import VariantSelector from '@/components/VariantSelector';
import { 
  PrintifyProduct, 
  getAvailableColorOptions,
  getAvailableSizes,
  getImagesForVariant,
  findVariantByOptions,
  getMinPrice,
  getEnabledVariants
} from '@/lib/printify';

interface ProductDetailsClientProps {
  product: PrintifyProduct;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const colorOptions = getAvailableColorOptions(product);
  const sizeOptions = getAvailableSizes(product);
  const enabledVariants = getEnabledVariants(product);
  
  // State for selected options
  const [selectedColorId, setSelectedColorId] = useState<number | null>(
    colorOptions.length > 0 ? colorOptions[0].id : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Find the current variant based on selections
  const colorOption = product.options?.find(opt => opt.type === 'color');
  const sizeOption = product.options?.find(opt => opt.type === 'size');
  
  const selectedSizeId = selectedSize 
    ? sizeOption?.values.find(v => v.title === selectedSize)?.id || null
    : null;
  
  const currentVariant = findVariantByOptions(product, selectedColorId, selectedSizeId);
  
  // Truncate description to 100 words
  const truncateDescription = (html: string, wordLimit: number) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const words = text.trim().split(/\s+/);
    
    if (words.length <= wordLimit) {
      return { truncated: html, needsTruncation: false };
    }
    
    const truncatedText = words.slice(0, wordLimit).join(' ');
    return { 
      truncated: `<p>${truncatedText}...</p>`, 
      needsTruncation: true 
    };
  };
  
  const { truncated, needsTruncation } = truncateDescription(product.description, 100);
  const displayDescription = isDescriptionExpanded ? product.description : truncated;
  
  // Get images for the current variant (filtered by color if selected)
  const displayImages = currentVariant 
    ? getImagesForVariant(product, currentVariant.id)
    : product.images.filter(img => 
        selectedColorId 
          ? img.variant_ids.some(vid => {
              const variant = enabledVariants.find(v => v.id === vid);
              return variant?.options[0] === selectedColorId;
            })
          : true
      );
  
  // Current price based on selected variant or minimum
  const currentPrice = currentVariant 
    ? (currentVariant.price / 100).toFixed(2)
    : getMinPrice(product).toFixed(2);
  
  const canAddToCart = selectedColorId !== null && selectedSize !== null && currentVariant !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <ProductImageCarousel 
          images={displayImages.length > 0 ? displayImages : product.images.slice(0, 1)}
          productTitle={product.title}
        />
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.title}
        </h1>
        
        <div className="text-3xl font-bold text-sky-500 mb-6">
          ${currentPrice}
        </div>

        <div className="mb-6">
          <div 
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
          {needsTruncation && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sky-500 hover:text-sky-600 font-medium text-sm mt-2"
            >
              {isDescriptionExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Variant Selector */}
        <VariantSelector
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          selectedColorId={selectedColorId}
          selectedSize={selectedSize}
          onColorChange={setSelectedColorId}
          onSizeChange={setSelectedSize}
        />

        {/* Add to Cart Button */}
        <div className="mt-8 space-y-4">
          <button 
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              canAddToCart
                ? 'bg-sky-500 text-white hover:bg-sky-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAddToCart}
          >
            {canAddToCart ? 'Add to Cart' : 'Select Size and Color'}
          </button>

          {/* Quick Checkout */}
          <Link 
            href="/cart"
            className={`block w-full py-4 rounded-lg font-semibold text-lg text-center transition-colors ${
              canAddToCart
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            Buy Now
          </Link>
        </div>

        {/* Product Features */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Premium quality print
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Soft, comfortable fabric
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Made to order
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Sustainable production
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
