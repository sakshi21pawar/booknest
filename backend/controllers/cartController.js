const db = require("../db");

// GET user cart
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [items] = await db.promise().query(`
      SELECT ci.book_id, b.title, b.author, b.price, ci.quantity
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      JOIN books b ON ci.book_id = b.id
      WHERE c.user_id = ?
    `, [userId]);

    // Ensure an array is always returned
    res.json(items || []);
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD book to cart
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    console.log(`Adding book ${bookId} to cart for user ${userId}`);

    // 1. find or create cart
    const [cartRows] = await db.promise().query(
      "SELECT id FROM carts WHERE user_id = ?", [userId]
    );

    let cartId;
    if (cartRows.length === 0) {
      const [result] = await db.promise().query(
        "INSERT INTO carts (user_id) VALUES (?)", [userId]
      );
      cartId = result.insertId;
      console.log("Created new cart:", cartId);
    } else {
      cartId = cartRows[0].id;
      console.log("Using existing cart:", cartId);
    }

    // 2. check if book already in cart
    const [itemRows] = await db.promise().query(
      "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND book_id = ?",
      [cartId, bookId]
    );

    if (itemRows.length > 0) {
      // increment quantity
      await db.promise().query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?",
        [itemRows[0].id]
      );
      console.log("Incremented quantity for book", bookId);
    } else {
      // add new item
      await db.promise().query(
        "INSERT INTO cart_items (cart_id, book_id, quantity) VALUES (?, ?, 1)",
        [cartId, bookId]
      );
      console.log("Inserted new book into cart:", bookId);
    }

    res.json({ message: "Book added to cart" });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE quantity
const updateQuantity = async (req, res) => {
  const userId = req.user.id;
  const { bookId, quantity } = req.body;

  if (!bookId || quantity == null) {
    return res.status(400).json({ message: "Book ID and quantity are required" });
  }

  try {
    await db.promise().query(`
      UPDATE cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      SET ci.quantity = ?
      WHERE c.user_id = ? AND ci.book_id = ?
    `, [quantity, userId, bookId]);

    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("updateQuantity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE item
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  if (!bookId) return res.status(400).json({ message: "Book ID is required" });

  try {
    await db.promise().query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ? AND ci.book_id = ?
    `, [userId, bookId]);

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("removeFromCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart };
