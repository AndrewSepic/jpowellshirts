'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import VariantSelector from './VariantSelector';
import { ProductLayoutProps } from './types';

export default function ProductDetailsMobileLayout({
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
  canAddToCart,
  onAddToCart,
  onBuyNow,
}: ProductLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">

      {/* Title + Price */}
      <div className="px-4 pt-4 pb-2 bg-white">
        <h1 className="text-xl font-bold text-slate-900 leading-tight font-brand">{title}</h1>
        <div className="text-2xl font-bold text-sky-700 mt-1">${currentPrice}</div>
      </div>

      {/* Swipe Image Gallery — CSS scroll-snap, no library needed */}
      <div className="relative bg-white">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="relative shrink-0 w-full snap-center aspect-square"
            >
              <Image
                src={image.src}
                alt={`${title} – image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1.5 pointer-events-none">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? 'w-2.5 h-2.5 bg-sky-600 opacity-100'
                    : 'w-2 h-2 bg-gray-300 opacity-40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Variants + Buttons — the core above-the-fold content */}
      <div className="px-4 py-4 bg-white mt-2">
        <VariantSelector
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          selectedColorId={selectedColorId}
          selectedSize={selectedSize}
          onColorChange={onColorChange}
          onSizeChange={onSizeChange}
          availableSizes={sizesForSelectedColor}
        />

        <div className="mt-5 space-y-3">
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

      {/* Description — intentionally below the fold */}
      <div className="px-4 py-4 bg-white mt-2 mb-8">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">About this product</h2>
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

    </div>
  );
}
