// Printify API Client
// Docs: https://developers.printify.com/

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const USE_MOCK_DATA = !process.env.PRINTIFY_API_TOKEN; // Auto-detect if we should use mocks

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  tags: string[];
  variants: PrintifyVariant[];
  images: PrintifyImage[];
}

interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
}

interface PrintifyImage {
  src: string;
  position: string;
  is_default: boolean;
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
