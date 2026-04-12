const Product = require('../models/productModel');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Seed database with professional dummy data
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({}); // Clear existing

    const sampleProducts = [
      // MEN - 4 Unique Items
      { name: "Brown Canvas Overshirt Jacket", image: "https://images.unsplash.com/photo-1594745014930-ff1886b172fd?w=800&q=80", description: "Relaxed fit brown canvas overshirt with front pockets and button closure. Perfect for casual everyday wear.", price: 85, category: "Men", type: "Tops" },
      { name: "Cream Ribbed Polo Collar Shirt", image: "https://images.unsplash.com/photo-1589941013453-ec89f33b1e95?w=800&q=80", description: "Classic cream-colored polo shirt with ribbed collar. Timeless style for any occasion.", price: 70, category: "Men", type: "Tops" },
      { name: "Burgundy Formal Dress Shirt", image: "https://images.unsplash.com/photo-1595777707802-221ae45f3938?w=800&q=80", description: "Deep maroon burgundy formal dress shirt. Perfect for evening events and business occasions.", price: 95, category: "Men", type: "Tops" },
      { name: "Black Varsity College Jacket", image: "https://images.unsplash.com/photo-1551567081-53ab681b0f86?w=800&q=80", description: "Classic black varsity jacket with white sleeves and contrast ribbing. Athletic and stylish.", price: 120, category: "Men", type: "Outerwear" },
      // WOMEN - 4 Unique Items
      { name: "Yellow Sunflower Print Wide Leg Trousers", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", description: "Gorgeous yellow sunflower print wide-leg trousers. Comfortable and stylish for everyday wear.", price: 89, category: "Women", type: "Bottoms" },
      { name: "Golden Yellow Floral Halter Maxi Dress", image: "https://images.unsplash.com/photo-1612528443702-f6741f271a6f?w=800&q=80", description: "Stunning golden yellow floral halter dress with floor-length silhouette. Perfect for special occasions.", price: 165, category: "Women", type: "Dresses" },
      { name: "Black Pinstripe Tailored Blazer", image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80", description: "Sophisticated black pinstripe blazer with clean tailoring. Essential for professional wardrobe.", price: 155, category: "Women", type: "Outerwear" },
      { name: "Ivory Botanical Floral Wrap Dress", image: "https://images.unsplash.com/photo-1615572914957-c1ee12b475a9?w=800&q=80", description: "Elegant ivory wrap dress with botanical floral print detailing. Flattering fit for all body types.", price: 175, category: "Women", type: "Dresses" },
      // ACCESSORIES
      { name: "Canvas Weekender", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800", description: "Durable travel bag with leather trims.", price: 110, category: "Accessories", type: "Bags" },
      { name: "Minimalist Chronograph", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800", description: "Silver steel and leather.", price: 210, category: "Accessories", type: "Watches" },
      { name: "Acetate Sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800", description: "100% UV Protection.", price: 125, category: "Accessories", type: "Eyewear" },
      { name: "Leather Cardholder", image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=800", description: "Slim profile, genuine leather.", price: 40, category: "Accessories", type: "Wallets" },
      // KIDS (New Section)
      { name: "Organic Cotton Onesie", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800", description: "Soft on sensitive skin.", price: 25, category: "Kids", type: "Infant" },
      { name: "Denim Overalls", image: "https://images.unsplash.com/photo-1560203088-11eae90aa8a3?q=80&w=800", description: "Playground ready.", price: 45, category: "Kids", type: "Bottoms" },
      { name: "Mini Puffer Jacket", image: "https://images.unsplash.com/photo-1565149666747-61f6268feda0?q=80&w=800", description: "Warm and lightweight.", price: 60, category: "Kids", type: "Outerwear" },
      { name: "Graphic Knit Sweater", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800", description: "Cozy winter wear.", price: 35, category: "Kids", type: "Tops" }
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: "Database seeded successfully with new inventory!" });
  } catch (error) {
    res.status(500).json({ message: "Seeding Failed", error: error.message });
  }
};

module.exports = {
  getProducts,
  seedProducts
};