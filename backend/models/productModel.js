const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  type: { type: String } // Optional: for extra filtering like "Shirts" or "Pants"
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;