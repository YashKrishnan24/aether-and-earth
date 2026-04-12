const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product'); 

dotenv.config();
connectDB();

// THE UPDATED PRODUCT ARRAY: IMAGES AND DESCRIPTIONS MATCH PERFECTLY
const products = [
  // MEN'S CATEGORY (NEW: HAND-PICKED ACCURATE IMAGES)
  { 
    name: "Casual Brown Overshirt", 
    category: "Men", 
    type: "Shirts", 
    price: 85, 
    // Image is now a men's brown corduroy overshirt/jacket
    image: "https://img105.savana.com/goods-pic/28953e6048ba4efd86e7f7a8e3332b8a_w1440_q90.webp",
    description: "A versatile earthy brown overshirt perfect for layering."
  },
  { 
    name: "Vintage Polo Shirt", 
    category: "Men", 
    type: "Shirts", 
    price: 70, 
    // Image is now a light blue men's knit polo
    image: "http://www.oxknit.com/cdn/shop/products/polo341.jpg?v=1663743680",
    description: "Classic vintage knit polo with a tailored fit."
  },
  { 
    name: "Maroon Dress Shirt", 
    category: "Men", 
    type: "Shirts", 
    price: 95, 
    // Image is now a men's maroon button-down dress shirt
    image: "https://cdn11.bigcommerce.com/s-2iveh3ifm0/images/stencil/1920w/products/2109/13768/apiebzt6z__27943.1592328664.jpg?c=2",
    description: "Crisp maroon dress shirt for formal and semi-formal occasions."
  },
  { 
    name: "Varsity Jacket", 
    category: "Men", 
    type: "Outerwear", 
    price: 120, 
    // Image is now a classic wool/leather letterman jacket
    image: "https://i.etsystatic.com/18714430/r/il/a3cf51/6368215368/il_1080xN.6368215368_qo9i.jpg",
    description: "Classic wool and leather varsity jacket."
  },
  { 
    name: "Wool Overcoat", 
    category: "Men", 
    type: "Outerwear", 
    price: 195, 
    // Image is now a men's tan/camel wool overcoat
    image: "https://peterjacksons.com/cdn/shop/files/mens-coat-chocolate-cashmere-WT25-SC02-30.webp?v=1746076857&width=2000",
    description: "Classic double-breasted camel wool overcoat."
  },

  // WOMEN'S CATEGORY (NAMES AND DESCRIPTIONS CORRECTED PREVIOUSLY)
  { 
    name: "White Tulle Midi Skirt", 
    category: "Women", 
    type: "Skirts", 
    price: 89, 
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800",
    description: "Flowy white tulle midi skirt, perfect for elegant layering."
  },
  { 
    name: "Red Floral Midi Dress", 
    category: "Women", 
    type: "Dresses", 
    price: 165, 
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800",
    description: "Elegant red floral dress perfect for summer evenings and events."
  },
  { 
    name: "Copper Bomber Jacket", 
    category: "Women", 
    type: "Outerwear", 
    price: 155, 
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
    description: "Lightweight copper bomber jacket for a sleek, modern casual look."
  },
  { 
    name: "Button-Down Denim Dress", 
    category: "Women", 
    type: "Dresses", 
    price: 55, 
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800",
    description: "Casual summer button-down denim shirt dress."
  },

  // KIDS' CATEGORY (INTACT)
  { 
    name: "Organic Cotton Onesie", 
    category: "Kids", 
    type: "Baby", 
    price: 25, 
    image: "https://cdn11.bigcommerce.com/s-pgv2f/images/stencil/1920w/products/1079/4510/onesie_204T__90795.1554837698.jpg?c=2",
    description: "Soft, breathable organic cotton for everyday comfort."
  },
  { 
    name: "Denim Overalls", 
    category: "Kids", 
    type: "Toddler", 
    price: 45, 
    image: "https://lsco.scene7.com/is/image/lsco/372310044-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=0.6,0.6,8&wid=2000&hei=1852",
    description: "Durable and adorable denim overalls."
  },
  { 
    name: "Mini Puffer Jacket", 
    category: "Kids", 
    type: "Outerwear", 
    price: 60, 
    image: "https://png.pngtree.com/png-vector/20250415/ourmid/pngtree-red-mini-rodini-hooded-puffer-jacket-for-kids-png-image_15974375.png",
    description: "Warm and lightweight puffer jacket for colder days."
  },
  { 
    name: "Graphic Knit Sweater", 
    category: "Kids", 
    type: "Knitwear", 
    price: 35, 
    image: "https://i.pinimg.com/originals/ad/57/b4/ad57b41b49356b327a9c38f689c9d3f6.jpg",
    description: "Cozy knit sweater with fun graphic details."
  },

  // ACCESSORIES CATEGORY (INTACT)
  { 
    name: "Canvas Weekender", 
    category: "Accessories", 
    type: "Bags", 
    price: 110, 
    image: "https://gatheredcollab.co.nz/cdn/shop/files/canvas_weekender_beige_017566b1-d53a-4373-8ed9-e466a833f1f1.jpg?crop=center&height=1800&v=1740733899&width=1200",
    description: "Spacious and durable canvas bag for short trips."
  },
  { 
    name: "Classic Aviator Sunglasses", 
    category: "Accessories", 
    type: "Eyewear", 
    price: 125, 
    image: "https://iconicsunglasses.co.uk/cdn/shop/files/1440_1.jpg?v=1716131760&width=1946",
    description: "Timeless aviator frames with UV protection."
  },
  { 
    name: "Quilted Leather Crossbody", 
    category: "Accessories", 
    type: "Bags", 
    price: 180, 
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
    description: "Premium quilted leather bag with gold hardware."
  },
  { 
    name: "Silver Chronograph Watch", 
    category: "Accessories", 
    type: "Watches", 
    price: 210, 
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800",
    description: "Elegant stainless steel chronograph timepiece."
  }
];

// THE IMPORT LOGIC (Full Database Wipe and Re-seed)
const importData = async () => {
  try {
    // This wipes the old database records containing the warehouse images
    await Product.deleteMany(); 
    // This inserts the new array containing the perfectly matched images and descriptions
    await Product.insertMany(products); 
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();