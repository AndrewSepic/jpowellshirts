import ProductCard from './ProductCard';

// Temporary mock data - you'll replace this with Printify API data
const mockProducts = [
  {
    id: '1',
    title: 'Classic Powell Portrait',
    price: 29.99,
    imageUrl: '/images/default.png',
    description: 'Iconic Jerome Powell portrait on premium cotton tee'
  },
  {
    id: '2',
    title: 'Transitory Inflation',
    price: 32.99,
    imageUrl: '/images/default2.png',
    description: 'Remember when inflation was transitory? Commemorate the moment'
  },
  {
    id: '3',
    title: 'JPOW Money Printer',
    price: 34.99,
    imageUrl: '/images/default3.png',
    description: 'The legendary money printer goes BRRR design'
  },
  {
    id: '4',
    title: 'Rate Hike Survivor',
    price: 29.99,
    imageUrl: '/images/default2.png',
    description: 'Survived the 2022-2023 rate hiking cycle'
  },
  {
    id: '5',
    title: 'Federal Reserve',
    price: 31.99,
    imageUrl: '/images/default3.png',
    description: 'Classic Federal Reserve logo with Powell signature'
  },
  {
    id: '6',
    title: 'Pivot Season',
    price: 32.99,
    imageUrl: '/images/default.png',
    description: 'Waiting for the pivot? This shirt understands'
  }
];

export default function ProductGallery() {
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
          {mockProducts.map((product) => (
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
        {mockProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
