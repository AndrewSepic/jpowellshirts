import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/printify';
import ProductDetailsClient from '@/components/ProductDetailsClient';

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}
