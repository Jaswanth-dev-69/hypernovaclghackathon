const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.getCurrentUser);

// User management routes
router.get('/users', authController.getAllUsers);

// Test endpoint to trigger error logging (for testing Google Sheets Errors tab)
router.get('/test-error', (req, res) => {
  try {
    // Intentionally throw an error to test error logging
    throw new Error('This is a test error for Google Sheets logging');
  } catch (error) {
    const sheetsLogger = require('../utils/googleSheetsLogger');
    sheetsLogger.logError('test_error', error.message, error.stack, {
      endpoint: '/api/auth/test-error',
      userId: 'test_user'
    });
    res.status(500).json({
      success: false,
      message: 'Test error logged to Google Sheets Errors tab'
    });
  }
});

module.exports = router;
