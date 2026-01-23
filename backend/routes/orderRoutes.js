const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getOrders } = require("../controllers/orderController");

// Get all orders for logged-in user
router.get("/", auth, getOrders);

module.exports = router;
