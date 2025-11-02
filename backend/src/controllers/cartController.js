const {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../services/cartService');

/**
 * Get user's cart items
 */
const getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cartItems = await getCartItems(userId);

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });
  } catch (error) {
    console.error('Get user cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart items'
    });
  }
};

/**
 * Add item to cart
 */
const addItemToCart = async (req, res) => {
  try {
    const { userId, product, quantity } = req.body;

    if (!userId || !product) {
      return res.status(400).json({
        success: false,
        message: 'User ID and product are required'
      });
    }

    const cartItem = await addToCart(userId, product, quantity || 1);

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

/**
 * Update cart item quantity
 */
const updateCartItem = async (req, res) => {
  try {
    const { userId, cartItemId, quantity } = req.body;

    if (!userId || !cartItemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'User ID, cart item ID, and quantity are required'
      });
    }

    const updatedItem = await updateCartItemQuantity(userId, cartItemId, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update cart item'
    });
  }
};

/**
 * Remove item from cart
 */
const removeCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.body;

    if (!userId || !cartItemId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and cart item ID are required'
      });
    }

    await removeFromCart(userId, cartItemId);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
};

/**
 * Clear user's cart
 */
const clearUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    await clearCart(userId);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

/**
 * Get cart item count
 */
const getUserCartCount = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const count = await getCartCount(userId);

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count'
    });
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearUserCart,
  getUserCartCount
};
