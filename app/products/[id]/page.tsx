import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Mock product data - should match ProductGallery
const mockProducts = [
  {
    id: '1',
    title: 'Classic Powell Portrait',
    price: 29.99,
    imageUrl: '/images/default.png',
    description: 'Iconic Jerome Powell portrait on premium cotton tee',
    printifyProductId: 'mock-prod-001',
    printifyVariantId: 'mock-var-001',
    fullDescription: 'Show your appreciation for sound monetary policy with this classic Jerome Powell portrait t-shirt. Featuring a high-quality print on soft, comfortable cotton fabric. Perfect for FOMC meeting watch parties or everyday wear.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  },
  {
    id: '2',
    title: 'Transitory Inflation',
    price: 32.99,
    imageUrl: '/images/default2.png',
    description: 'Remember when inflation was transitory? Commemorate the moment',
    printifyProductId: 'mock-prod-002',
    printifyVariantId: 'mock-var-002',
    fullDescription: 'A humorous take on one of the most memorable economic predictions. This shirt commemorates the era when inflation was deemed "transitory." Perfect conversation starter for economists and finance enthusiasts.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  },
  {
    id: '3',
    title: 'JPOW Money Printer',
    price: 34.99,
    imageUrl: '/images/default3.png',
    description: 'The legendary money printer goes BRRR design',
    printifyProductId: 'mock-prod-003',
    printifyVariantId: 'mock-var-003',
    fullDescription: 'Celebrate the meme that captured quantitative easing in the public imagination. This design features the iconic "money printer goes BRRR" imagery that became synonymous with Fed policy during economic uncertainty.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  },
  {
    id: '4',
    title: 'Rate Hike Survivor',
    price: 29.99,
    imageUrl: '/images/default2.png',
    description: 'Survived the 2022-2023 rate hiking cycle',
    printifyProductId: 'mock-prod-004',
    printifyVariantId: 'mock-var-004',
    fullDescription: 'Badge of honor for those who weathered the aggressive rate hiking cycle. Show that you made it through one of the fastest monetary tightening periods in modern history.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  },
  {
    id: '5',
    title: 'Federal Reserve',
    price: 31.99,
    imageUrl: '/images/default3.png',
    description: 'Classic Federal Reserve logo with Powell signature',
    printifyProductId: 'mock-prod-005',
    printifyVariantId: 'mock-var-005',
    fullDescription: 'A sophisticated design featuring the Federal Reserve seal with Jerome Powell\'s signature. Perfect for those who prefer a more subtle nod to their interest in monetary policy.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  },
  {
    id: '6',
    title: 'Pivot Season',
    price: 32.99,
    imageUrl: '/images/default.png',
    description: 'Waiting for the pivot? This shirt understands',
    printifyProductId: 'mock-prod-006',
    printifyVariantId: 'mock-var-006',
    fullDescription: 'For everyone anticipating the policy pivot. Whether you\'re bullish on rate cuts or just tired of waiting, this shirt captures the sentiment of market watchers everywhere.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    material: '100% Premium Cotton',
  }
];

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const product = mockProducts.find(p => p.id === id);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="text-3xl font-bold text-sky-500 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="border-2 border-gray-300 hover:border-sky-500 text-gray-900 py-2 rounded-lg font-medium transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Material:</span> {product.material}
              </p>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-sky-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-sky-600 transition-colors mb-4">
              Add to Cart
            </button>

            {/* Quick Checkout (Mock) */}
            <Link 
              href="/cart"
              className="block w-full bg-gray-800 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors text-center"
            >
              Buy Now
            </Link>

            {/* Product Features */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Premium quality print
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Soft, comfortable fabric
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Made to order
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sustainable production
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
