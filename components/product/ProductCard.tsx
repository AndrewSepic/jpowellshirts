import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductCard({ id, title, price, imageUrl, description }: ProductCardProps) {
  return (
    <Link href={`/products/${id}?title=${encodeURIComponent(title)}&price=${price}&imageUrl=${encodeURIComponent(imageUrl)}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-slate-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">
            {title}
          </h3>
          {description && (
            <p 
				className="text-sm text-gray-600 mb-2 line-clamp-2"
			 	dangerouslySetInnerHTML={{ __html: description }}>
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-slate-900">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
