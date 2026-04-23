const express = require('express');
//import controller functions
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
//import auth middleware
const authMiddleware = require('../middleware/authMiddleware');
//create routerinstance

const router = express.Router();
//public routes
router.post('/signup', signup);
router.post('/login', login);

//protected routes
router.get('/me', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', authMiddleware, logout);
//shipping address routes
router.post('/add-shipping-address', authMiddleware, addShippingAddress);
router.delete('/remove-shipping-address/:addressId', authMiddleware, removeShippingAddress);
//payment method routes
router.post('/add-payment-method', authMiddleware, addPaymentMethod);
router.delete('/remove-payment-method/:methodId', authMiddleware, removePaymentMethod);

module.exports = router;
