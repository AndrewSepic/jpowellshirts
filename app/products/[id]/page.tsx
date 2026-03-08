import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/printify';
import ProductDetailsClient from '@/components/product/ProductDetailsClient';

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">{product.title}</span>
        </div>

        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}
