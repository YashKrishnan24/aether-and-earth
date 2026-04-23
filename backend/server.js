const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
//cors middleware to allow requests from frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
//JSON middleware
app.use(express.json()); 
//import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
//use routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
//port setup

const PORT = process.env.PORT || 5000;
//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));