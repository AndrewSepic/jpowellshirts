/**
 * Shared application types used across components, API routes, and providers.
 */

export interface CartItem {
  productId: string;
  variantId: number;
  productTitle: string;
  variantTitle: string;
  price: number; // in dollars
  imageUrl: string;
  quantity: number;
  colorName?: string;
  sizeName?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}
