const {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../services/cartService');

// ============================================
// PROMETHEUS METRICS DISABLED - Using Google Sheets
// ============================================
// const { metrics } = require('../middleware/metricsExporter');

const sheetsLogger = require('../utils/googleSheetsLogger');

/**
 * Get user's cart items
 */
const getUserCart = async (req, res) => {
  const startTime = Date.now();
  const operation = 'get';
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const userId = req.params.userId;

    if (!userId) {
      // metrics.cartOperations.inc({ operation, status: 'failure', env });
      // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
      await sheetsLogger.logCart(operation, 'failure', 'unknown', { reason: 'missing_user_id' });
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cartItems = await getCartItems(userId);

    // metrics.cartOperations.inc({ operation, status: 'success', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseQueries.observe({ operation: 'select', table: 'cart', env }, (Date.now() - startTime) / 1000);
    await sheetsLogger.logCart(operation, 'success', userId, { 
      itemCount: cartItems.length,
      totalValue: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems
    });
  } catch (error) {
    console.error('Get user cart error:', error);
    // metrics.cartOperations.inc({ operation, status: 'error', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseErrors.inc({ operation: 'select', table: 'cart', env });
    await sheetsLogger.logError('cart_error', error.message, error.stack, { 
      endpoint: '/api/cart/:userId',
      userId: req.params.userId || 'unknown'
    });
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
  const startTime = Date.now();
  const operation = 'add';
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { userId, product, quantity } = req.body;

    if (!userId || !product) {
      // metrics.cartOperations.inc({ operation, status: 'failure', env });
      // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
      await sheetsLogger.logCart(operation, 'failure', userId || 'unknown', { 
        reason: 'missing_required_fields' 
      });
      return res.status(400).json({
        success: false,
        message: 'User ID and product are required'
      });
    }

    const cartItem = await addToCart(userId, product, quantity || 1);

    // metrics.cartOperations.inc({ operation, status: 'success', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseQueries.observe({ operation: 'insert', table: 'cart', env }, (Date.now() - startTime) / 1000);
    await sheetsLogger.logCart(operation, 'success', userId, {
      productId: product.id || product.product_id,
      quantity: quantity || 1
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    // metrics.cartOperations.inc({ operation, status: 'error', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseErrors.inc({ operation: 'insert', table: 'cart', env });
    await sheetsLogger.logError('cart_error', error.message, error.stack, {
      endpoint: '/api/cart/add',
      userId: req.body.userId || 'unknown'
    });
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
  const startTime = Date.now();
  const operation = 'update';
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { userId, cartItemId, quantity } = req.body;

    if (!userId || !cartItemId || !quantity) {
      // metrics.cartOperations.inc({ operation, status: 'failure', env });
      // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
      await sheetsLogger.logCart(operation, 'failure', userId || 'unknown', {
        reason: 'missing_required_fields'
      });
      return res.status(400).json({
        success: false,
        message: 'User ID, cart item ID, and quantity are required'
      });
    }

    const updatedItem = await updateCartItemQuantity(userId, cartItemId, quantity);

    // metrics.cartOperations.inc({ operation, status: 'success', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseQueries.observe({ operation: 'update', table: 'cart', env }, (Date.now() - startTime) / 1000);
    await sheetsLogger.logCart(operation, 'success', userId, {
      cartItemId,
      quantity
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    // metrics.cartOperations.inc({ operation, status: 'error', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseErrors.inc({ operation: 'update', table: 'cart', env });
    await sheetsLogger.logError('cart_error', error.message, error.stack, {
      endpoint: '/api/cart/update',
      userId: req.body.userId || 'unknown'
    });
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
  const startTime = Date.now();
  const operation = 'remove';
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { userId, cartItemId } = req.body;

    if (!userId || !cartItemId) {
      // metrics.cartOperations.inc({ operation, status: 'failure', env });
      // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
      await sheetsLogger.logCart(operation, 'failure', userId || 'unknown', {
        reason: 'missing_required_fields'
      });
      return res.status(400).json({
        success: false,
        message: 'User ID and cart item ID are required'
      });
    }

    await removeFromCart(userId, cartItemId);

    // metrics.cartOperations.inc({ operation, status: 'success', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseQueries.observe({ operation: 'delete', table: 'cart', env }, (Date.now() - startTime) / 1000);
    await sheetsLogger.logCart(operation, 'success', userId, {
      cartItemId
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    // metrics.cartOperations.inc({ operation, status: 'error', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseErrors.inc({ operation: 'delete', table: 'cart', env });
    await sheetsLogger.logError('cart_error', error.message, error.stack, {
      endpoint: '/api/cart/remove',
      userId: req.body.userId || 'unknown'
    });
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
  const startTime = Date.now();
  const operation = 'clear';
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const userId = req.params.userId;

    if (!userId) {
      // metrics.cartOperations.inc({ operation, status: 'failure', env });
      // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
      await sheetsLogger.logCart(operation, 'failure', 'unknown', {
        reason: 'missing_user_id'
      });
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    await clearCart(userId);

    // metrics.cartOperations.inc({ operation, status: 'success', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseQueries.observe({ operation: 'delete', table: 'cart', env }, (Date.now() - startTime) / 1000);
    await sheetsLogger.logCart(operation, 'success', userId, {
      itemCount: 0,
      totalValue: 0
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    // metrics.cartOperations.inc({ operation, status: 'error', env });
    // metrics.cartOperationDuration.observe({ operation, env }, (Date.now() - startTime) / 1000);
    // metrics.databaseErrors.inc({ operation: 'delete', table: 'cart', env });
    await sheetsLogger.logError('cart_error', error.message, error.stack, {
      endpoint: '/api/cart/:userId/clear',
      userId: req.params.userId || 'unknown'
    });
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

