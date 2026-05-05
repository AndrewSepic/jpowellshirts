import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/printify';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';
import ProductDetailsSkeleton from '@/components/product/ProductDetailsSkeleton';

 {/* The Printify request for the full product details can take a while on a cold vercel cache. While I haven't figured out better caching in the current infra. I've Added Suspense with Skeleton fallback with existing title, price and imageUrl for quick responsiveness even on a cache miss */}
export default async function ProductPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{title: string; price: number; imageUrl: string; description: string}>
}) {
  const { id } = await params;
  const { title, price, imageUrl } = await searchParams;
  
  const ProductDetails = async ({ id } : {id : string}) => {
    const product = await getProduct(id);
     if (!product) {
       notFound();
    }
    return <ProductDetailsClient product={product}/>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">{title}</span>
        </div>
        <Suspense fallback={
          <ProductDetailsSkeleton title={title} price={price} imageUrl={imageUrl} />
          }>
          <ProductDetails id={id}/>
        </Suspense>
      </div>
    </div>
  );
}
