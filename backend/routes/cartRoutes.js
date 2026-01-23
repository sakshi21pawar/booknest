const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart
} = require("../controllers/cartController");

// Protected routes
router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateQuantity);
router.delete("/remove/:bookId", auth, removeFromCart);

module.exports = router;
