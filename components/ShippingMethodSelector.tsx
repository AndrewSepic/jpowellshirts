'use client';

interface ShippingMethod {
  name: string;
  cost: number;
  costCents: number;
  deliveryTime?: string;
}

interface ShippingMethodSelectorProps {
  methods: Record<string, { cost: number; costCents: number }>;
  selectedMethod: string | null;
  onMethodSelect: (method: string, costCents: number) => void;
}

const methodDetails: Record<string, { label: string; deliveryTime: string }> = {
  economy: { label: 'Economy', deliveryTime: '7-14 business days' },
  standard: { label: 'Standard', deliveryTime: '5-7 business days' },
  express: { label: 'Express', deliveryTime: '2-3 business days' },
  priority: { label: 'Priority', deliveryTime: '1-2 business days' },
  printify_express: { label: 'Printify Express', deliveryTime: '3-5 business days' },
};

export default function ShippingMethodSelector({ 
  methods, 
  selectedMethod, 
  onMethodSelect 
}: ShippingMethodSelectorProps) {
  if (Object.keys(methods).length === 0) {
    return null;
  }

  // Sort methods by cost (lowest first)
  const sortedMethods = Object.entries(methods).sort(([, a], [, b]) => a.cost - b.cost);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
      <div className="space-y-2">
        {sortedMethods.map(([method, { cost, costCents }]) => {
          const details = methodDetails[method] || { label: method, deliveryTime: '' };
          const isSelected = selectedMethod === method;

          return (
            <button
              key={method}
              onClick={() => onMethodSelect(method, costCents)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                isSelected
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">{details.label}</div>
                  {details.deliveryTime && (
                    <div className="text-sm text-gray-600 mt-1">{details.deliveryTime}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${cost.toFixed(2)}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
