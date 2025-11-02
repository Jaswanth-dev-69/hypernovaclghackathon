const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Cart routes
router.get('/:userId', cartController.getUserCart);
router.get('/:userId/count', cartController.getUserCartCount);
router.post('/add', cartController.addItemToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeCartItem);
router.delete('/:userId/clear', cartController.clearUserCart);

module.exports = router;
