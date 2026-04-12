const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { seedProducts } = require('../controllers/productController');

// @desc    Fetch all products from MongoDB
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all documents
    res.json(products);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error: Could not fetch products" });
  }
});

// @desc    Seed database with 16 sample products
// @route   POST /api/products/seed
router.post('/seed', seedProducts);

module.exports = router;