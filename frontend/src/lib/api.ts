// ============================================================================
// API MODULE
// Handles all data fetching with telemetry integration
// ============================================================================

import { logEvent, recordMetric, reportError } from './telemetry';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ============================================================================
// PRODUCTS API
// ============================================================================

/**
 * Fetch all products from the data source
 * In production, this would be a real API call
 */
export async function fetchProducts(): Promise<Product[]> {
  const startTime = performance.now();
  logEvent('api_call_initiated', { endpoint: '/api/products', method: 'GET' });

  try {
    // Simulate network delay
    await delay(300);

    // Import products data (in production, this would be fetch())
    const response = await import('@/data/products.json');
    const products = response.default;

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('api_response_time', duration, 'ms');
    logEvent('api_call_success', {
      endpoint: '/api/products',
      itemCount: products.length,
      duration: `${duration.toFixed(0)}ms`,
    });

    return products;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    reportError(error as Error, 'high', {
      endpoint: '/api/products',
      duration: `${duration.toFixed(0)}ms`,
    });

    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  const startTime = performance.now();
  logEvent('api_call_initiated', { endpoint: `/api/products/${id}`, method: 'GET' });

  try {
    // Simulate network delay
    await delay(200);

    const products = await fetchProducts();
    const product = products.find((p) => p.id === id) || null;

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('api_response_time', duration, 'ms');
    logEvent('api_call_success', {
      endpoint: `/api/products/${id}`,
      found: !!product,
      duration: `${duration.toFixed(0)}ms`,
    });

    return product;
  } catch (error) {
    reportError(error as Error, 'medium', {
      endpoint: `/api/products/${id}`,
    });
    throw error;
  }
}

// ============================================================================
// CART API (Simulated)
// ============================================================================

/**
 * Simulate adding a product to cart (API call)
 * In production, this would sync with backend
 */
export async function addToCart(product: Product, quantity: number = 1): Promise<void> {
  const startTime = performance.now();
  logEvent('add_to_cart', {
    productId: product.id,
    productName: product.name,
    quantity,
    price: product.price,
  });

  try {
    // Simulate network delay
    await delay(150);

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('cart_operation_time', duration, 'ms');
    logEvent('cart_updated', {
      operation: 'add',
      productId: product.id,
      duration: `${duration.toFixed(0)}ms`,
    });
  } catch (error) {
    reportError(error as Error, 'medium', {
      operation: 'add_to_cart',
      productId: product.id,
    });
    throw error;
  }
}

/**
 * Simulate removing from cart
 */
export async function removeFromCart(productId: number): Promise<void> {
  const startTime = performance.now();
  logEvent('remove_from_cart', { productId });

  try {
    await delay(150);

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('cart_operation_time', duration, 'ms');
    logEvent('cart_updated', {
      operation: 'remove',
      productId,
      duration: `${duration.toFixed(0)}ms`,
    });
  } catch (error) {
    reportError(error as Error, 'medium', {
      operation: 'remove_from_cart',
      productId,
    });
    throw error;
  }
}

/**
 * Simulate checkout process
 */
export async function checkout(cartItems: CartItem[], total: number): Promise<{ success: boolean; orderId: string }> {
  const startTime = performance.now();
  logEvent('checkout_initiated', {
    itemCount: cartItems.length,
    total,
  });

  try {
    // Simulate processing time
    await delay(1000);

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('checkout_time', duration, 'ms');
    logEvent('checkout_completed', {
      orderId,
      itemCount: cartItems.length,
      total,
      duration: `${duration.toFixed(0)}ms`,
    });

    return { success: true, orderId };
  } catch (error) {
    reportError(error as Error, 'critical', {
      operation: 'checkout',
      itemCount: cartItems.length,
      total,
    });
    throw error;
  }
}

// ============================================================================
// SEARCH API
// ============================================================================

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const startTime = performance.now();
  logEvent('search_initiated', { query });

  try {
    await delay(200);

    const products = await fetchProducts();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    recordMetric('search_time', duration, 'ms');
    logEvent('search_completed', {
      query,
      resultCount: results.length,
      duration: `${duration.toFixed(0)}ms`,
    });

    return results;
  } catch (error) {
    reportError(error as Error, 'low', {
      operation: 'search',
      query,
    });
    throw error;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Utility to simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
