const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const mongoose = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authController = require("./controllers/authController");

const app = express();

// Configure CORS for network access
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));

app.use(express.json());

// API routes
app.use("/api", productRoutes);

// Auth routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.get("/api/auth/verify", authController.verifyToken);
app.post("/api/auth/addUser", authController.addUser);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Start server only after database connection is established
const startServer = async () => {
  try {
    // Wait for database connection
    await mongoose.connection.asPromise();
    
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📊 MongoDB connected: ${mongoose.connection.host}`);
      console.log(`🌐 Accessible from network at: http://[your-local-ip]:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
