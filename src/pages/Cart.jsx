"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const isLoggedIn = () => !!localStorage.getItem("token");
  const API_URL = "https://localhost:7085/api";
  const userId = localStorage.getItem("userId") || "guest";

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/Cart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!customerName.trim()) errors.name = "Name is required";
    if (!customerAddress.trim()) errors.address = "Address is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendToWhatsApp = () => {
    if (!validateForm()) return;

    const msg = cart.items
      .map((item) => `- ${item.product.name} x${item.quantity} (Rs. ${item.subtotal})`)
      .join("%0A");

    const customerInfo = `%0A%0A[Customer Details]%0AName: ${customerName}%0AAddress: ${customerAddress}`;
    const fullMessage = `Order:%0A${msg}%0A%0ATotal: Rs.${cart.total}${customerInfo}`;

    window.open(`https://wa.me/9779813244622?text=${fullMessage}`, "_blank");
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/Cart?userId=${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      setCart({ items: [], subtotal: 0, total: 0, itemCount: 0 });
    } catch (err) {
      alert("Failed to clear cart. Please try again.");
      console.error("Error clearing cart:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/Cart/${itemId}?userId=${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      fetchCart();
    } catch (err) {
      alert("Failed to remove item. Please try again.");
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${API_URL}/Cart/${itemId}?userId=${userId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchCart();
    } catch (err) {
      alert("Failed to update quantity. Please try again.");
      console.error("Error updating quantity:", err);
    }
  };

  if (loading) return <div className="loading">Loading your cart...</div>;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <p>{cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart</p>
          {error && <p className="error-message">{error}</p>}
        </div>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map((item, index) => (
                <div className="cart-item" key={item.id || index}>
                  <div className="item-image">
                    <img
                      src={
                        item.product.image?.startsWith("/uploads")
                          ? `https://localhost:7085${item.product.image}`
                          : item.product.image || "https://via.placeholder.com/150"
                      }
                      alt={item.product.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-description">{item.product.description}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-price">Rs. {item.subtotal?.toFixed(2)}</div>
                  <button className="remove-item-btn" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span><span>Rs. {cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span><span>Free</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span><span>Rs. {cart.total?.toFixed(2)}</span>
              </div>

              <div className="customer-details">
                <h4>Customer Information</h4>
                <div className="form-group">
                  <label htmlFor="customerName">Your Name</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className={formErrors.name ? "error" : ""}
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="customerAddress">Delivery Address</label>
                  <textarea
                    id="customerAddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows="3"
                    className={formErrors.address ? "error" : ""}
                  ></textarea>
                  {formErrors.address && <span className="error-message">{formErrors.address}</span>}
                </div>
              </div>

              <button className="checkout-btn" onClick={sendToWhatsApp}>Checkout via WhatsApp</button>
              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
              <button className="continue-shopping-link" onClick={() => navigate("/")}>← Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
