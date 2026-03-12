'use client';

import ProductImageCarousel from './ProductImageCarousel';
import VariantSelector from './VariantSelector';
import { ProductLayoutProps } from './types';

export default function ProductDetailsDesktopLayout({
  title,
  currentPrice,
  displayImages,
  displayDescription,
  needsTruncation,
  isDescriptionExpanded,
  onToggleDescription,
  colorOptions,
  sizeOptions,
  sizesForSelectedColor,
  selectedColorId,
  selectedSize,
  onColorChange,
  onSizeChange,
  isSingleVariant,
  canAddToCart,
  onAddToCart,
  onBuyNow,
}: ProductLayoutProps) {
  return (
    <div className="grid grid-cols-2 gap-12">

      {/* Left — Image carousel with thumbnails */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <ProductImageCarousel
          images={displayImages}
          productTitle={title}
        />
      </div>

      {/* Right — Product details */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-brand">{title}</h1>

        <div className="text-3xl font-bold text-sky-700 mb-6">${currentPrice}</div>

        {/* Description */}
        <div className="mb-6">
          <div
            className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
          {needsTruncation && (
            <button
              onClick={onToggleDescription}
              className="text-sky-700 hover:text-sky-800 font-medium text-sm mt-2 cursor-pointer"
            >
              {isDescriptionExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Variant Selector */}
        {!isSingleVariant && (
          <VariantSelector
            colorOptions={colorOptions}
            sizeOptions={sizeOptions}
            selectedColorId={selectedColorId}
            selectedSize={selectedSize}
            onColorChange={onColorChange}
            onSizeChange={onSizeChange}
            availableSizes={sizesForSelectedColor}
          />
        )}

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={onAddToCart}
            disabled={!canAddToCart}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              canAddToCart
                ? 'bg-sky-700 text-white hover:bg-sky-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAddToCart ? 'Add to Cart' : 'Select Size and Color'}
          </button>

          <button
            onClick={onBuyNow}
            disabled={!canAddToCart}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
              canAddToCart
                ? 'bg-gray-800 text-white hover:bg-slate-800 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
}
