'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartContext';
import {
  PrintifyProduct,
  getAvailableColorOptions,
  getAvailableSizes,
  getImagesForVariant,
  findVariantByOptions,
  getMinPrice,
  getEnabledVariants
} from '@/lib/printify';
import ProductDetailsMobileLayout from './ProductDetailsMobileLayout';
import ProductDetailsDesktopLayout from './ProductDetailsDesktopLayout';

interface ProductDetailsClientProps {
  product: PrintifyProduct;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const colorOptions = getAvailableColorOptions(product);
  const sizeOptions = getAvailableSizes(product);
  const enabledVariants = getEnabledVariants(product);

  // State
  const [selectedColorId, setSelectedColorId] = useState<number | null>(
    colorOptions.length > 0 ? colorOptions[0].id : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Derived — variant lookup
  const sizeOption = product.options?.find(opt => opt.type === 'size');
  const selectedSizeId = selectedSize
    ? sizeOption?.values.find(v => v.title === selectedSize)?.id || null
    : null;
  const currentVariant = findVariantByOptions(product, selectedColorId, selectedSizeId);

  // Derived — description truncation
  const truncateDescription = (html: string, wordLimit: number) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return { truncated: html, needsTruncation: false };
    return { truncated: `<p>${words.slice(0, wordLimit).join(' ')}...</p>`, needsTruncation: true };
  };
  const { truncated, needsTruncation } = truncateDescription(product.description, 100);
  const displayDescription = isDescriptionExpanded ? product.description : truncated;

  // Derived — available sizes for selected color
  const sizesForSelectedColor = enabledVariants
    .filter(v => v.options[0] === selectedColorId)
    .map(v => v.options[1])
    .map(sizeId => sizeOption?.values.find(s => s.id === sizeId)?.title)
    .filter((s): s is string => Boolean(s));

  // Derived — display images
  const displayImages = currentVariant
    ? getImagesForVariant(product, currentVariant.id)
    : product.images.filter(img =>
        selectedColorId
          ? img.variant_ids.some(vid => {
              const variant = enabledVariants.find(v => v.id === vid);
              return variant?.options[0] === selectedColorId;
            })
          : true
      );

  // Derived — price
  const currentPrice = currentVariant
    ? (currentVariant.price / 100).toFixed(2)
    : getMinPrice(product).toFixed(2);

  // Handlers
  const handleAddToCart = () => {
    if (!currentVariant || !selectedColorId || !selectedSize) return;
    const colorOption = colorOptions.find(c => c.id === selectedColorId);
    const imageUrl = displayImages[0]?.src || product.images[0]?.src || '';
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      productTitle: product.title,
      variantTitle: currentVariant.title,
      price: currentVariant.price / 100,
      imageUrl,
      colorName: colorOption?.title,
      sizeName: selectedSize,
    });
    router.push('/cart');
  };

  const handleBuyNow = () => handleAddToCart();

  const canAddToCart = selectedColorId !== null && selectedSize !== null && currentVariant !== null;

  // Shared props passed to both layout components
  const layoutProps = {
    title: product.title,
    currentPrice,
    displayImages: displayImages.length > 0 ? displayImages : product.images.slice(0, 1),
    displayDescription,
    needsTruncation,
    isDescriptionExpanded,
    onToggleDescription: () => setIsDescriptionExpanded(prev => !prev),
    colorOptions,
    sizeOptions,
    sizesForSelectedColor,
    selectedColorId,
    selectedSize,
    onColorChange: setSelectedColorId,
    onSizeChange: setSelectedSize,
    canAddToCart,
    onAddToCart: handleAddToCart,
    onBuyNow: handleBuyNow,
  };

  return (
    <>
      {/* Mobile layout — hidden on large screens */}
      <div className="lg:hidden">
        <ProductDetailsMobileLayout {...layoutProps} />
      </div>

      {/* Desktop layout — hidden on small screens */}
      <div className="hidden lg:block">
        <ProductDetailsDesktopLayout {...layoutProps} />
      </div>
    </>
  );
}
