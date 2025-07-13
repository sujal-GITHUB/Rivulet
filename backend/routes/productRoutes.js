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
router.post("/register", productController.registerProduct);
router.post("/checkpoint", productController.addCheckpoint);
router.post("/certification", productController.addCertification);
router.get("/product/qr/:qrHash", productController.getProductByQR);
router.post("/verify-authenticity", productController.verifyAuthenticity);

// QR Code routes
router.post("/qr/generate", qrController.generateQR);
router.get("/qr/scan/:qrData", qrController.scanQR);

// Role management routes
router.post("/users/add", authController.addUser);
router.put("/users/role", authController.updateUserRole);
router.delete("/users/:address", authController.removeUser);
router.get("/users/role/:address", authController.getUserRole);

module.exports = router;
