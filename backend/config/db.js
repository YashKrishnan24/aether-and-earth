const mongoose = require('mongoose');

// We use an async function because connecting to a database takes time
const connectDB = async () => {
  try {
    // Attempt to connect using the secret URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If successful, print a confirmation in the terminal
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If it fails (e.g., bad password, no internet), print the error and crash the app
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;