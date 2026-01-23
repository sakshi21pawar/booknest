const db = require("../db");

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all orders for user
    const [orders] = await db.promise().query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    // For each order, get items
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.promise().query(
          `SELECT b.title, b.author, b.price, oi.quantity
           FROM order_items oi
           JOIN books b ON oi.book_id = b.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(detailedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOrders };
