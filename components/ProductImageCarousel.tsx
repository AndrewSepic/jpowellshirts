'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PrintifyImage } from '@/lib/printify';

interface ProductImageCarouselProps {
  images: PrintifyImage[];
  productTitle: string;
}

export default function ProductImageCarousel({ images, productTitle }: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedIndex].src}
          alt={productTitle}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail Row */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-20 h-20 pointer ${
              selectedIndex === index 
                ? 'border-sky-500 ring-2 ring-sky-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Image
              src={image.src}
              alt={`${productTitle} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
