const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth");
const productRoutes = require("../modules/product");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

module.exports = router;
