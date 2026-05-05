'use client';

import Image from 'next/image';

interface ProductDetailsSkeletonProps {
  title?: string;
  price?: number;
  imageUrl?: string;
}

function ShimmerBlock({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function MobileSkeleton({ title, price, imageUrl }: ProductDetailsSkeletonProps) {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">

      {/* Title + Price */}
      <div className="px-4 pt-4 pb-2 bg-white">
        {title
          ? <h1 className="text-xl font-bold text-slate-900 leading-tight font-brand">{title}</h1>
          : <ShimmerBlock className="h-6 w-3/4 mb-2" />
        }
        {price
          ? <div className="text-2xl font-bold text-sky-700 mt-1">${price}</div>
          : <ShimmerBlock className="h-7 w-1/4 mt-1" />
        }
      </div>

      {/* Image */}
      <div className="relative bg-white w-full aspect-square">
        {imageUrl
          ? <Image src={imageUrl} alt={title ?? 'Product image'} fill className="object-cover" sizes="100vw" priority />
          : <ShimmerBlock className="w-full h-full rounded-none" />
        }
      </div>

      {/* Variants + Buttons */}
      <div className="px-4 py-4 bg-white mt-2">

        {/* Color swatches */}
        <div className="mb-4">
          <ShimmerBlock className="h-4 w-16 mb-2" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <ShimmerBlock key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>

        {/* Size buttons */}
        <div className="mb-4">
          <ShimmerBlock className="h-4 w-12 mb-2" />
          <div className="flex gap-2 flex-wrap">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <ShimmerBlock key={s} className="h-10 w-14" />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mt-5">
          <ShimmerBlock className="w-full h-14 rounded-lg" />
          <ShimmerBlock className="w-full h-14 rounded-lg" />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-4 bg-white mt-2 mb-8">
        <ShimmerBlock className="h-4 w-32 mb-3" />
        <div className="space-y-2">
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
          <ShimmerBlock className="h-3 w-4/6" />
        </div>
      </div>

    </div>
  );
}

function DesktopSkeleton({ title, price, imageUrl }: ProductDetailsSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-12">

      {/* Left — Image */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="relative aspect-square w-full mb-4">
          {imageUrl
            ? <Image src={imageUrl} alt={title ?? 'Product image'} fill className="object-cover rounded" sizes="50vw" priority />
            : <ShimmerBlock className="w-full h-full rounded" />
          }
        </div>
        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <ShimmerBlock key={i} className="w-16 h-16 rounded" />
          ))}
        </div>
      </div>

      {/* Right — Details */}
      <div className="bg-white rounded-lg shadow-md p-8">

        {/* Title */}
        {title
          ? <h1 className="text-3xl font-bold text-slate-900 mb-4 font-brand">{title}</h1>
          : <ShimmerBlock className="h-8 w-3/4 mb-4" />
        }

        {/* Price */}
        {price
          ? <div className="text-3xl font-bold text-sky-700 mb-6">${price}</div>
          : <ShimmerBlock className="h-8 w-1/4 mb-6" />
        }

        {/* Description lines */}
        <div className="space-y-2 mb-6">
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
          <ShimmerBlock className="h-3 w-4/6" />
        </div>

        {/* Color swatches */}
        <div className="mb-4">
          <ShimmerBlock className="h-4 w-16 mb-2" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <ShimmerBlock key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>

        {/* Size buttons */}
        <div className="mb-6">
          <ShimmerBlock className="h-4 w-12 mb-2" />
          <div className="flex gap-2 flex-wrap">
            {['S', 'M', 'L', 'XL'].map((s) => (
              <ShimmerBlock key={s} className="h-10 w-14" />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4 mt-8">
          <ShimmerBlock className="w-full h-14 rounded-lg" />
          <ShimmerBlock className="w-full h-14 rounded-lg" />
        </div>

      </div>
    </div>
  );
}

export default function ProductDetailsSkeleton({ title, price, imageUrl }: ProductDetailsSkeletonProps) {
  return (
    <>
      {/* Mobile — hidden on large screens */}
      <div className="lg:hidden">
        <MobileSkeleton title={title} price={price} imageUrl={imageUrl} />
      </div>

      {/* Desktop — hidden on small screens */}
      <div className="hidden lg:block">
        <DesktopSkeleton title={title} price={price} imageUrl={imageUrl} />
      </div>
    </>
  );
}
