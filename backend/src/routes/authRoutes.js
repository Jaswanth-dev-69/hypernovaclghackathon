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

module.exports = router;
