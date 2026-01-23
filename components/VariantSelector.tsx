'use client';

import { PrintifyOption } from '@/lib/printify';

interface VariantSelectorProps {
  colorOptions: Array<{id: number; title: string}>;
  sizeOptions: string[];
  selectedColorId: number | null;
  selectedSize: string | null;
  onColorChange: (colorId: number) => void;
  onSizeChange: (size: string) => void;
  availableColorIds?: number[]; // Optional: to disable unavailable colors
  availableSizes?: string[]; // Optional: to disable unavailable sizes
}

export default function VariantSelector({
  colorOptions,
  sizeOptions,
  selectedColorId,
  selectedSize,
  onColorChange,
  onSizeChange,
  availableColorIds,
  availableSizes
}: VariantSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {colorOptions.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Select Color
            {selectedColorId && (
              <span className="ml-2 font-normal text-gray-600">
                ({colorOptions.find(c => c.id === selectedColorId)?.title})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => {
              const isAvailable = !availableColorIds || availableColorIds.includes(color.id);
              const isSelected = selectedColorId === color.id;
              
              return (
                <button
                  key={color.id}
                  onClick={() => onColorChange(color.id)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 rounded-lg border-2 font-medium transition-all text-sm pointer
                    ${isSelected 
                      ? 'border-sky-500 bg-sky-50 text-sky-700' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  title={color.title}
                >
                  {color.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizeOptions.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Select Size
          </label>
          <div className="grid grid-cols-5 gap-2">
            {sizeOptions.map((size) => {
              const isAvailable = !availableSizes || availableSizes.includes(size);
              const isSelected = selectedSize === size;
              
              return (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  disabled={!isAvailable}
                  className={`
                    border-2 py-2 rounded-lg font-medium transition-all
                    ${isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : ''}
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
