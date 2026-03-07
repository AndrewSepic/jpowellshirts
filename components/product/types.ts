import { PrintifyImage } from '@/lib/printify';

export interface ProductLayoutProps {
  // Product info
  title: string;
  currentPrice: string;
  displayImages: PrintifyImage[];

  // Description
  displayDescription: string;
  needsTruncation: boolean;
  isDescriptionExpanded: boolean;
  onToggleDescription: () => void;

  // Variant selection
  colorOptions: Array<{ id: number; title: string }>;
  sizeOptions: string[];
  sizesForSelectedColor: string[];
  selectedColorId: number | null;
  selectedSize: string | null;
  onColorChange: (colorId: number) => void;
  onSizeChange: (size: string) => void;

  // Cart actions
  canAddToCart: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}
