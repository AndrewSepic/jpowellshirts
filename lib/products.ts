// Product data utilities
import { getProducts } from './printify';

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  printifyProductId: string;
  printifyVariantId: string;
  fullDescription?: string;
  sizes?: string[];
  material?: string;
}

/**
 * Fetch all products - automatically uses Printify API if available, otherwise uses mocks
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const printifyProducts = await getProducts();
    
    // Transform Printify data to our app format
    return printifyProducts.map(product => ({
      id: product.id,
      title: product.title,
      price: product.variants[0]?.price / 100 || 29.99, // Convert cents to dollars
      imageUrl: product.images[0]?.src || '/images/default.png',
      description: product.description || '',
      printifyProductId: product.id,
      printifyVariantId: product.variants[0]?.id.toString() || '',
      fullDescription: product.description,
      sizes: product.variants.map(v => v.title),
      material: '100% Premium Cotton',
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id) || null;
}
