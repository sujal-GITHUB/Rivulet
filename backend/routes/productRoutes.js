const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/product/:id", productController.getProduct);
router.post("/register", productController.registerProduct);

module.exports = router;
