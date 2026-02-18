import { useEffect, useState } from "react";
import { getOrderHistory } from "../services/orderApi";
import { FaBoxOpen, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrderHistory(token);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':  return '#2ecc71';
      case 'shipped':    return '#3498db';
      case 'processing': return '#f39c12';
      case 'cancelled':  return '#e74c3c';
      default:           return '#95a5a6';
    }
  };

  return (
    <div className="order-history-page">

      {/* ── HEADER ── */}
      <div className="order-history-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track and manage all your past orders</p>
      </div>

      {/* ── LOADING ── */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>

      ) : orders.length === 0 ? (

        /* ── EMPTY STATE ── */
        <div className="empty-orders">
          <div className="empty-icon"><FaBoxOpen size={48} /></div>
          <h3>No Orders Yet</h3>
          <p>Your order history will appear here once you make a purchase.</p>
          <Link to="/books" className="shop-now-btn">
            <FaShoppingBag style={{ marginRight: 8 }} />
            Start Shopping
          </Link>
        </div>

      ) : (

        /* ── ORDERS LIST ── */
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className="order-card">

              {/* Order Header */}
              <div className="order-header">
                <div className="order-header-left">
                  <div className="order-id">
                    <span className="order-label">Order</span>
                    <span className="order-number">#{order.id}</span>
                  </div>
                  <div className="order-date">
                    <span className="order-label">Placed on</span>
                    <span className="date-value">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="order-header-right">
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-value">₹{order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.status && (
                    <div
                      className="order-status"
                      style={{
                        backgroundColor: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}
                    >
                      {order.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h4 className="items-title">Items in this order</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <div className="item-image-placeholder">
                        {item.title?.charAt(0) || 'B'}
                      </div>
                      <div className="item-info">
                        <h5 className="item-title">{item.title || 'Untitled Book'}</h5>
                        <p className="item-author">by {item.author || 'Unknown Author'}</p>
                        <div className="item-meta">
                          <span className="item-price">₹{item.price?.toFixed(2) || '0.00'}</span>
                          <span className="item-quantity">× {item.quantity || 1}</span>
                          <span className="item-subtotal">
                            Subtotal: ₹{(item.price * item.quantity)?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="order-footer">
                <div className="order-actions">
                  <button className="action-btn view-details-btn">View Details</button>
                  <button className="action-btn track-order-btn">Track Order</button>
                  <button className="action-btn reorder-btn">Reorder</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;