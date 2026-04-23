const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { seedProducts } = require('../controllers/productController');
//get product route
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error: Could not fetch products" });
  }
});
//seed products route
router.post('/seed', seedProducts);

module.exports = router;