import { supabase } from './supabase';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get current user ID from session
 */
const getUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Get user's cart items from Supabase
 */
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const userId = getUserId();
    if (!userId) {
      console.log('No user logged in, returning empty cart');
      return [];
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get cart items error:', error);
    return [];
  }
};

/**
 * Add product to cart (via backend API with metrics tracking)
 */
export const addToCart = async (product: Product, quantity: number = 1): Promise<CartItem | null> => {
  const startTime = performance.now();
  
  try {
    const userId = getUserId();
    console.log('[Cart Service] Adding to cart:', { userId, product, quantity });
    
    if (!userId) {
      const error = new Error('User must be logged in to add items to cart');
      console.error('[Cart Service] Error:', error.message);
      throw error;
    }

    // Call backend API which tracks metrics
    const response = await fetch(`${API_URL}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        product,
        quantity
      })
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    try {
      await fetch(`${API_URL}/metrics/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/api/cart/add',
          method: 'POST',
          status: String(response.status),
          duration,
          type: 'cart_operation'
        })
      });
    } catch (metricsError) {
      console.warn('Failed to emit metrics:', metricsError);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cart Service] API error:', data);
      throw new Error(data.message || 'Failed to add to cart');
    }

    console.log('[Cart Service] Success:', data);
    return data.data;
  } catch (error) {
    console.error('[Cart Service] Add to cart error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity (via backend API with metrics tracking)
 */
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem | null> => {
  const startTime = performance.now();
  
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User must be logged in');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const response = await fetch(`${API_URL}/api/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cartItemId, quantity })
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    try {
      await fetch(`${API_URL}/metrics/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/api/cart/update',
          method: 'PUT',
          status: String(response.status),
          duration
        })
      });
    } catch (metricsError) {
      console.warn('Failed to emit metrics:', metricsError);
    }

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || 'Update failed');
    return data.data;
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

/**
 * Remove item from cart (via backend API with metrics tracking)
 */
export const removeFromCart = async (cartItemId: string): Promise<boolean> => {
  const startTime = performance.now();
  
  try {
    console.log('[Cart Service] Removing item with ID:', cartItemId);
    
    const userId = getUserId();
    if (!userId) {
      const error = new Error('User must be logged in');
      console.error('[Cart Service] Error:', error.message);
      throw error;
    }

    console.log('[Cart Service] User ID:', userId);

    const response = await fetch(`${API_URL}/api/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cartItemId })
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    try {
      await fetch(`${API_URL}/metrics/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/api/cart/remove',
          method: 'DELETE',
          status: String(response.status),
          duration
        })
      });
    } catch (metricsError) {
      console.warn('Failed to emit metrics:', metricsError);
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[Cart Service] Delete error:', data);
      throw new Error(data.message || 'Failed to remove item');
    }
    
    console.log('[Cart Service] Item removed successfully');
    return true;
  } catch (error) {
    console.error('[Cart Service] Remove from cart error:', error);
    throw error;
  }
};

/**
 * Clear entire cart (via backend API with metrics tracking)
 */
export const clearCart = async (): Promise<boolean> => {
  const startTime = performance.now();
  
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User must be logged in');
    }

    const response = await fetch(`${API_URL}/api/cart/clear/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    try {
      await fetch(`${API_URL}/metrics/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/api/cart/clear',
          method: 'DELETE',
          status: String(response.status),
          duration
        })
      });
    } catch (metricsError) {
      console.warn('Failed to emit metrics:', metricsError);
    }

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message || 'Failed to clear cart');
    return true;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

/**
 * Get cart item count
 */
export const getCartCount = async (): Promise<number> => {
  try {
    const userId = getUserId();
    if (!userId) return 0;

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    if (error) throw error;

    const totalCount = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    return totalCount;
  } catch (error) {
    console.error('Get cart count error:', error);
    return 0;
  }
};
