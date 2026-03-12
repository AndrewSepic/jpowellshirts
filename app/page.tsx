import ProductGallery from '@/components/layout/ProductGallery';
import { getProducts, transformProductForDisplay } from '@/lib/printify';
import productOrder from '@/product-order.json';

export default async function Home() {

	const products = await getProducts();

	const enabledProducts = products.map(transformProductForDisplay);

	const orderedProducts = [...enabledProducts].sort((a, b) => {
		const aIdx = productOrder.findIndex(p => p.id === a.id);
		const bIdx = productOrder.findIndex(p => p.id === b.id);
		const aPos = aIdx === -1 ? Infinity : aIdx;
		const bPos = bIdx === -1 ? Infinity : bIdx;
		return aPos - bPos;
	});

  return (
    <div className="min-h-screen bg-slate-50">
      <ProductGallery products={orderedProducts} />
    </div>
  );
}
