import AdminProductManager from '@/components/AdminProductManager';
import { getProducts } from '@/lib/printify';

export default async function AdminPrintifyPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Printify Product Manager
          </h1>
          <p className="text-gray-600">
            Set products to "publishing succeeded" status to unlock them in Printify
          </p>
        </div>

        <AdminProductManager products={products} />
      </div>
    </div>
  );
}
