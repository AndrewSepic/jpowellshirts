import ProductGallery from '@/components/ProductGallery';
import { getProducts, transformProductForDisplay } from '@/lib/printify';

export default async function Home() {

	const products = await getProducts();

	const enabledProducts = products.map(transformProductForDisplay);
	

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductGallery products={enabledProducts} />
    </div>
  );
}
