"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Cart.css"

const Cart = () => {
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || []
    setCart(stored)
  }, [])

  const validateForm = () => {
    const errors = {}
    if (!customerName.trim()) {
      errors.name = "Name is required"
    }
    if (!customerAddress.trim()) {
      errors.address = "Address is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const sendToWhatsApp = () => {
    if (!validateForm()) {
      return
    }

    // Format the product list
    const msg = cart.map((p) => `- ${p.name} (Rs. ${p.price})`).join("%0A")
    const total = cart.reduce((sum, p) => sum + Number(p.price), 0)

    // Format the customer details
    const customerInfo = `%0A%0A[Customer Details]%0AName: ${customerName}%0AAddress: ${customerAddress}`

    // Combine everything into the final message
    const fullMessage = `Order:%0A${msg}%0A%0ATotal: Rs.${total}${customerInfo}`

    // Open WhatsApp with the formatted message
    window.open(`https://wa.me/9779813244622?text=${fullMessage}`, "_blank")
  }

  const clearCart = () => {
    localStorage.removeItem("cart")
    setCart([])
  }

  const removeItem = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2)
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <p>
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
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
              {cart.map((item, index) => (
                <div className="cart-item" key={index}>
                  <div className="item-image">
                    <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                  </div>
                  <div className="item-price">Rs. {Number(item.price).toFixed(2)}</div>
                  <button className="remove-item-btn" onClick={() => removeItem(index)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {calculateTotal()}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {calculateTotal()}</span>
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

              <button className="checkout-btn" onClick={sendToWhatsApp}>
                Checkout via WhatsApp
              </button>

              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>

              <button className="continue-shopping-link" onClick={() => navigate("/")}>
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
