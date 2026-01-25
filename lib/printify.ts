// Printify API Client
// Docs: https://developers.printify.com/

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const USE_MOCK_DATA = !process.env.PRINTIFY_API_TOKEN; // Auto-detect if we should use mocks

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  variants: PrintifyVariant[];
  images: PrintifyImage[];
  options: PrintifyOption[];
  is_locked?: boolean;
  external?: {
    id: string;
    handle: string;
  };
}

export interface PrintifyOption {
  name: string;
  type: string;
  values: Array<{id: number; title: string}>;
  display_in_preview?: boolean;
}

export interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
  options: number[]; // Array of option value IDs [colorId, sizeId]
  cost: number;
  grams?: number;
  is_available: boolean;
  is_default: boolean;
  sku?: string;
  quantity?: number;
}

export interface PrintifyImage {
  src: string;
  position: string;
  is_default: boolean;
  variant_ids: number[]; // Which variants this image applies to
  is_selected_for_publishing?: boolean;
  order?: number | null;
}

export interface DisplayProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  printifyProductId: string;
  fullProduct: PrintifyProduct;
}

interface PrintifyOrderItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

interface PrintifyShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

interface PrintifyShippingCosts {
  standard?: number;
  express?: number;
  priority?: number;
  printify_express?: number;
  economy?: number;
}

interface PrintifyShippingLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  external_id?: string;
}

export interface ShippingResponse {
 	standard: number,
    express: number,
    priority: number,
    printify_express: number,
    economy: number,
}

// Mock data for testing without API access
const MOCK_PRODUCTS: PrintifyProduct[] = [
  {
    id: 'mock-prod-001',
    title: 'Classic Powell Portrait',
    description: 'Iconic Jerome Powell portrait on premium cotton tee',
    tags: ['powell', 'fed', 'portrait'],
    variants: [
      { id: 1, title: 'S', price: 2999, is_enabled: true },
      { id: 2, title: 'M', price: 2999, is_enabled: true },
      { id: 3, title: 'L', price: 2999, is_enabled: true },
      { id: 4, title: 'XL', price: 2999, is_enabled: true },
      { id: 5, title: '2XL', price: 2999, is_enabled: true },
    ],
    images: [
      { src: '/images/default.png', position: 'front', is_default: true }
    ],
    options: [
      { name: 'Sizes', type: 'size', values: [
        { id: 1, title: 'S' },
        { id: 2, title: 'M' },
        { id: 3, title: 'L' },
        { id: 4, title: 'XL' },
        { id: 5, title: '2XL' }
      ]}
    ]
  },
  // Add more mock products as needed
];

/**
 * Fetch all products from your Printify shop
 */
export async function getProducts(): Promise<PrintifyProduct[]> {
  if (USE_MOCK_DATA) {
    console.log('🔧 Using mock Printify data (API token not set)');
    return MOCK_PRODUCTS;
  }

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${shopId}/products.json`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch Printify products:', error);
    throw error;
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(productId: string): Promise<PrintifyProduct | null> {
  if (USE_MOCK_DATA) {
    return MOCK_PRODUCTS.find(p => p.id === productId) || null;
  }

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}.json`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Printify product:', error);
    return null;
  }
}

/**
 * Utility: Get only enabled variants from a product
 */
export function getEnabledVariants(product: PrintifyProduct): PrintifyVariant[] {
  return product.variants.filter(v => v.is_enabled);
}

/**
 * Utility: Get minimum price from enabled variants (in dollars)
 */
export function getMinPrice(product: PrintifyProduct): number {
  const enabledVariants = getEnabledVariants(product);
  if (enabledVariants.length === 0) return 0;
  return Math.min(...enabledVariants.map(v => v.price)) / 100;
}

/**
 * Utility: Get default or first available image
 */
export function getDefaultImage(product: PrintifyProduct): string {
  return product.images.find(img => img.is_default)?.src 
    || product.images[0]?.src 
    || '/images/default.png';
}

/**
 * Utility: Extract sizes from product options
 */
export function getUniqueSizes(product: PrintifyProduct): string[] {
  const sizeOption = product.options?.find(opt => opt.type === 'size');
  if (!sizeOption) return [];
  return sizeOption.values.map(v => v.title);
}

/**
 * Utility: Get only sizes that have enabled variants
 */
export function getAvailableSizes(product: PrintifyProduct): string[] {
  const enabledVariants = getEnabledVariants(product);
  const sizeOption = product.options?.find(opt => opt.type === 'size');
  if (!sizeOption) return [];
  
  const availableSizeIds = new Set(
    enabledVariants.map(v => v.options[1]) // Size is typically second option
  );
  
  return sizeOption.values
    .filter(size => availableSizeIds.has(size.id))
    .map(size => size.title);
}

/**
 * Utility: Get color options from product
 */
export function getColorOptions(product: PrintifyProduct) {
  const colorOption = product.options?.find(opt => opt.type === 'color');
  if (!colorOption) return [];
  return colorOption.values;
}

/**
 * Utility: Get only color options that have enabled variants
 */
export function getAvailableColorOptions(product: PrintifyProduct) {
  const enabledVariants = getEnabledVariants(product);
  const colorOption = product.options?.find(opt => opt.type === 'color');
  if (!colorOption) return [];
  
  const availableColorIds = new Set(
    enabledVariants.map(v => v.options[0]) // Color is typically first option
  );
  
  return colorOption.values.filter(color => availableColorIds.has(color.id));
}

/**
 * Utility: Get images for a specific variant
 */
export function getImagesForVariant(product: PrintifyProduct, variantId: number): PrintifyImage[] {
  return product.images.filter(img => img.variant_ids.includes(variantId));
}

/**
 * Utility: Find variant by color and size option IDs
 */
export function findVariantByOptions(
  product: PrintifyProduct, 
  colorId: number | null, 
  sizeId: number | null
): PrintifyVariant | null {
  const enabledVariants = getEnabledVariants(product);
  
  return enabledVariants.find(variant => {
    const [variantColorId, variantSizeId] = variant.options;
    const colorMatch = colorId === null || variantColorId === colorId;
    const sizeMatch = sizeId === null || variantSizeId === sizeId;
    return colorMatch && sizeMatch;
  }) || null;
}

/**
 * Transform Printify product to display format for ProductCard
 */
export function transformProductForDisplay(product: PrintifyProduct): DisplayProduct {
  return {
    id: product.id,
    title: product.title,
    price: getMinPrice(product),
    imageUrl: getDefaultImage(product),
    description: product.description,
    printifyProductId: product.id,
    fullProduct: product
  };
}

/**
 * Calculate shipping costs for an order
 */
export async function calculateShipping(
  lineItems: PrintifyShippingLineItem[],
  address: PrintifyShippingAddress
): Promise<PrintifyShippingCosts> {
  if (USE_MOCK_DATA) {
    console.log('🔧 Using mock shipping costs');
    return {
      standard: 500,
      economy: 399,
      express: 1200,
    };
  }

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    const url = `${PRINTIFY_API_URL}/shops/${shopId}/orders/shipping.json`;
    
    console.log('Printify shipping URL:', url);
    console.log('Shop ID:', shopId);
    console.log('Request body:', JSON.stringify({
      line_items: lineItems,
      address_to: address,
    }, null, 2));
    
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: lineItems,
          address_to: address,
        }),
      }
    );
	console.log("res", response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Printify shipping calculation failed: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to calculate shipping:', error);
    throw error;
  }
}

/**
 * Create an order in Printify
 */
export async function createOrder(
  orderId: string,
  items: PrintifyOrderItem[],
  shippingAddress: PrintifyShippingAddress
) {
  if (USE_MOCK_DATA) {
    console.log('🔧 Mock Printify order created:', {
      orderId,
      items,
      shippingAddress
    });
    return {
      id: `printify-mock-${Date.now()}`,
      status: 'pending',
      external_id: orderId,
    };
  }

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    
    const orderData = {
      external_id: orderId,
      label: orderId,
      line_items: items.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      shipping_method: 1, // Standard shipping
      send_shipping_notification: true,
      address_to: shippingAddress,
    };

    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${shopId}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Printify order creation failed: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('✅ Printify order created:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to create Printify order:', error);
    throw error;
  }
}

/**
 * Submit an order for production (moves from draft to production queue)
 */
export async function submitOrderForProduction(printifyOrderId: string) {
  if (USE_MOCK_DATA) {
    console.log('🔧 Mock Printify order submitted for production:', printifyOrderId);
    return { success: true };
  }

  try {
    const shopId = process.env.PRINTIFY_SHOP_ID;
    
    const response = await fetch(
      `${PRINTIFY_API_URL}/shops/${shopId}/orders/${printifyOrderId}/send_to_production.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to submit order for production: ${response.status}`);
    }

    console.log('✅ Printify order submitted for production:', printifyOrderId);
    return await response.json();
  } catch (error) {
    console.error('Failed to submit order for production:', error);
    throw error;
  }
}
