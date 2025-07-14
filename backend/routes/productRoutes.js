const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const qrController = require("../controllers/qrController");

// Authentication routes
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/verify", authController.verifyToken);

// Product routes
router.get("/product/:id", productController.getProduct);
router.get("/products/count", productController.getProductCount);
router.post("/register", productController.registerProduct);
router.post("/checkpoint", productController.addCheckpoint);
router.post("/certification", productController.addCertification);
router.get("/product/qr/:qrHash", productController.getProductByQR);
router.post("/verify-authenticity", productController.verifyAuthenticity);

// QR Code routes
router.post("/qr/generate", qrController.generateQR);
router.get("/qr/scan/:qrData", qrController.scanQR);
router.get("/qr/product/:productId", qrController.generateProductQR);
// POST QR scan (body: { qrData })
router.post('/qr/scan', qrController.scanQRPost);

// Role management routes
router.post("/users/add", authController.addUser);
router.put("/users/role", authController.updateUserRole);
router.delete("/users/:address", authController.removeUser);
router.get("/users/role/:address", authController.getUserRole);

// General Products routes
router.get("/products", productController.getProducts);
router.post("/products/checkpoint", productController.addJourneyCheckpoint);
router.get("/products/journey/:id", productController.getProductJourney);
router.post("/products/verify", productController.verifyProductAuthenticity);
router.get("/products/stats", productController.getSupplyChainStats);
router.post("/products/initialize", productController.initializeProducts);

module.exports = router;
