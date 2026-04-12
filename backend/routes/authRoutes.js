const express = require('express');
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  addShippingAddress,
  removeShippingAddress,
  addPaymentMethod,
  removePaymentMethod,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);

// Shipping addresses
router.post('/add-shipping-address', authMiddleware, addShippingAddress);
router.delete('/remove-shipping-address/:addressId', authMiddleware, removeShippingAddress);

// Payment methods
router.post('/add-payment-method', authMiddleware, addPaymentMethod);
router.delete('/remove-payment-method/:methodId', authMiddleware, removePaymentMethod);

module.exports = router;
