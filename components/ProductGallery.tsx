import ProductCard from './ProductCard';
import { DisplayProduct } from '@/lib/printify';

export default function ProductGallery({ products } :{products: DisplayProduct[]}) {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Celebrating Jerome Powell
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Show your appreciation for steady leadership, integrity and the importance of an independent Federal Reserve — especially when economic decisions require discipline, patience, and freedom from short-term influence.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl}
              description={product.description}
            />
          ))}
        </div>

        {/* Empty State (for when no products) */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
