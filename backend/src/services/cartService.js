const supabase = require('../config/supabase');

/**
 * Get user's cart items
 */
const getCartItems = async (userId) => {
  try {
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
    console.error('Get cart items service error:', error);
    throw error;
  }
};

/**
 * Add item to cart or update quantity if exists
 */
const addToCart = async (userId, product, quantity = 1) => {
  try {
    // Check if item already exists in cart
    const { data: existing, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      throw checkError;
    }

    if (existing) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([
          {
            user_id: userId,
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image,
            product_description: product.description,
            quantity: quantity
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Add to cart service error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
  try {
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
    console.error('Update cart item quantity error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
const removeFromCart = async (userId, cartItemId) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

/**
 * Clear all cart items for user
 */
const clearCart = async (userId) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

/**
 * Get cart item count for user
 */
const getCartCount = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    if (error) throw error;

    const totalCount = data.reduce((sum, item) => sum + item.quantity, 0);
    return totalCount;
  } catch (error) {
    console.error('Get cart count error:', error);
    throw error;
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartCount
};
