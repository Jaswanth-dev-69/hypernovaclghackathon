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
 * Add product to cart
 */
export const addToCart = async (product: Product, quantity: number = 1): Promise<CartItem | null> => {
  try {
    const userId = getUserId();
    console.log('[Cart Service] Adding to cart:', { userId, product, quantity });
    
    if (!userId) {
      const error = new Error('User must be logged in to add items to cart');
      console.error('[Cart Service] Error:', error.message);
      throw error;
    }

    // Check if item already exists
    console.log('[Cart Service] Checking for existing item...');
    const { data: existing, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[Cart Service] Check error:', checkError);
      throw checkError;
    }

    if (existing) {
      // Update quantity
      console.log('[Cart Service] Updating existing item:', existing);
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('[Cart Service] Update error:', error);
        throw error;
      }
      console.log('[Cart Service] Update success:', data);
      return data;
    } else {
      // Insert new item
      console.log('[Cart Service] Inserting new item...');
      const newItem = {
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        product_description: product.description,
        quantity: quantity
      };
      console.log('[Cart Service] New item data:', newItem);
      
      const { data, error } = await supabase
        .from('cart_items')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        console.error('[Cart Service] Insert error:', error);
        throw error;
      }
      console.log('[Cart Service] Insert success:', data);
      return data;
    }
  } catch (error) {
    console.error('[Cart Service] Add to cart error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User must be logged in');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId: string): Promise<boolean> => {
  try {
    console.log('[Cart Service] Removing item with ID:', cartItemId);
    
    const userId = getUserId();
    if (!userId) {
      const error = new Error('User must be logged in');
      console.error('[Cart Service] Error:', error.message);
      throw error;
    }

    console.log('[Cart Service] User ID:', userId);

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) {
      console.error('[Cart Service] Delete error:', error);
      throw error;
    }
    
    console.log('[Cart Service] Item removed successfully');
    return true;
  } catch (error) {
    console.error('[Cart Service] Remove from cart error:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<boolean> => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User must be logged in');
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
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
