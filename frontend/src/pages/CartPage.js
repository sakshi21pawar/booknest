import { useEffect, useState } from "react";
import { getCart, updateQuantity, removeItem, addToCart } from "../services/cartApi";
import './CartPage.css';
import {
  FaTrash, FaPlus, FaMinus, FaShoppingCart,
  FaArrowLeft, FaCreditCard, FaShippingFast
} from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const formatPrice = (price) => Number(price || 0).toFixed(2);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart(token);
      if (Array.isArray(data)) setCart(data);
      else setCart([]);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleIncrease = async (bookId, quantity) => {
    try {
      await updateQuantity(bookId, quantity + 1, token);
      setCart(cart.map(item =>
        item.book_id === bookId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } catch (err) { console.error(err); }
  };

  const handleDecrease = async (bookId, quantity) => {
    if (quantity <= 1) { handleRemove(bookId); return; }
    try {
      await updateQuantity(bookId, quantity - 1, token);
      setCart(cart.map(item =>
        item.book_id === bookId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (bookId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    try {
      await removeItem(bookId, token);
      setCart(cart.filter(item => item.book_id !== bookId));
    } catch (err) { console.error(err); }
  };

  const total = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0)
    : 0;

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">

      {/* ── HEADER ── */}
      <div className="cart-header">
        <Link to="/books" className="back-button">
          <FaArrowLeft /> Continue Shopping
        </Link>
        <h1 className="cart-title">
          <FaShoppingCart /> Shopping Cart
        </h1>
        <div>
          <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="cart-content">

        {/* Cart Items */}
        <div className="cart-items-section">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart size={48} />
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any books yet.</p>
              <Link to="/books" className="browse-books-btn">Browse Books</Link>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.book_id} className="cart-item-card">

                <div className="cart-item-image">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/90x120?text=Book'}
                    alt={item.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/90x120?text=Book'; }}
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-author">by {item.author}</p>
                  <div className="item-price">${formatPrice(item.price)}</div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button className="quantity-btn" onClick={() => handleDecrease(item.book_id, item.quantity)} aria-label="Decrease">
                        <FaMinus />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => handleIncrease(item.book_id, item.quantity)} aria-label="Increase">
                        <FaPlus />
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => handleRemove(item.book_id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  <div className="subtotal-label">Subtotal</div>
                  <div className="subtotal-amount">${formatPrice(Number(item.price) * item.quantity)}</div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${formatPrice(total * 0.08)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">${formatPrice(total * 1.08)}</span>
              </div>

              <button className="checkout-btn">
                <FaCreditCard /> Proceed to Checkout
              </button>

              <div className="payment-methods">
                <p>Secure payment accepted</p>
                <div className="payment-icons">
                  <FaCreditCard />
                </div>
              </div>
            </div>

            <div className="shipping-info">
              <h4><FaShippingFast style={{ marginRight: 8 }} />Free Shipping</h4>
              <p>Enjoy free shipping on all orders. Delivery in 3–5 business days.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;