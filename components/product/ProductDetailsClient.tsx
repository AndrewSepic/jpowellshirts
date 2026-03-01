'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImageCarousel from '@/components/product/ProductImageCarousel';
import VariantSelector from '@/components/product/VariantSelector';
import { useCart } from '@/providers/CartContext';
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
  const router = useRouter();
  const { addItem } = useCart();
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
  const sizeOption = product.options?.find(opt => opt.type === 'size');
  
  const selectedSizeId = selectedSize 
    ? sizeOption?.values.find(v => v.title === selectedSize)?.id || null
    : null;
  
  const currentVariant = findVariantByOptions(product, selectedColorId, selectedSizeId);
  
  // Truncate description to 100 words
  const truncateDescription = (html: string, wordLimit: number) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(/\s+/);
    
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
  

	// Calculates available sizes for specific color 
	const sizesForSelectedColor = enabledVariants
		.filter(v => v.options[0] === selectedColorId) // get variants of selected color
		.map(v => v.options[1]) // Get their sizeId's
		.map(sizeId => sizeOption?.values.find(s => s.id === sizeId)?.title) // map the sizeId to title ie: 'XL'
		.filter((s): s is string => Boolean(s))

  
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
  
  const handleAddToCart = () => {
    if (!currentVariant || !selectedColorId || !selectedSize) return;

    const colorOption = colorOptions.find(c => c.id === selectedColorId);
    const imageUrl = displayImages[0]?.src || product.images[0]?.src || '';

    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      productTitle: product.title,
      variantTitle: currentVariant.title,
      price: currentVariant.price / 100,
      imageUrl,
      colorName: colorOption?.title,
      sizeName: selectedSize,
    });

    // Optional: Show a success message or redirect to cart
    router.push('/cart');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Will redirect to cart, which can then go to checkout
  };

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
              className="text-sky-500 hover:text-sky-600 font-medium text-sm mt-2 cursor-pointer"
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
		//   availableColorIds={availableColorIds}
		  availableSizes={sizesForSelectedColor}
        />

        {/* Add to Cart Button */}
        <div className="mt-8 space-y-4">
          <button 
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              canAddToCart
                ? 'bg-sky-500 text-white hover:bg-sky-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canAddToCart}
          >
            {canAddToCart ? 'Add to Cart' : 'Select Size and Color'}
          </button>

          {/* Quick Checkout */}
          <button
            onClick={handleBuyNow}
            className={`block w-full py-4 rounded-lg font-semibold text-lg text-center transition-colors ${
              canAddToCart
                ? 'bg-gray-800 text-white hover:bg-gray-900 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!canAddToCart}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
