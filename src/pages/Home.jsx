// ✅ Updated Home.jsx to ensure product image is displayed correctly
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const isLoggedIn = () => !!localStorage.getItem("token");
const logout = () => localStorage.removeItem("token");

const Home = () => {
  const [products, setProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(500);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    if (!isLoggedIn()) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...existingCart, product]));
    navigate("/cart");
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleMobileFilter = () => setMobileFilterOpen(!mobileFilterOpen);
  const handlePriceChange = (e) => setPriceRange(e.target.value);

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="navbar-container">
          <a href="/" className="logo">🛍️ JG Enterprise</a>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>{mobileMenuOpen ? "✕" : "☰"}</button>
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <a href="/" className="nav-link">Home</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/ContactUs" className="nav-link">Contact</a>
            <div className="auth-buttons">
              {isLoggedIn() ? (
                <button className="btn logout-btn" onClick={() => { logout(); window.location.reload(); }}>Logout</button>
              ) : (
                <>
                  <a href="/login" className="btn login-btn">Login</a>
                  <a href="/register" className="btn register-btn">Register</a>
                
                </>
              )}
              <a href="/cart" className="cart-icon">🛒</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="offer-badge">Special Offer</span>
            <h1>20% OFF ONLY TODAY AND GET SPECIAL GIFT!</h1>
            <p>Today only, enjoy a stylish 20% off and receive an exclusive gift with your purchase!</p>
            <button className="btn shop-now-btn">Shop Now</button>
          </div>
          <div className="hero-image">
            <img src="https://i.ibb.co/4NRtXNz/fashion-hero.png" alt="Fashion promotion" />
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="container">
          <button className="mobile-filter-toggle" onClick={toggleMobileFilter}>
            {mobileFilterOpen ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          <aside className={`sidebar ${mobileFilterOpen ? "active" : ""}`}>
            <div className="filter-section">
              <h3>Filter Products</h3>
              <div className="filter-group">
                <h4>Categories</h4>
                <div className="checkbox-group">
                  <label><input type="checkbox" /> Jackets & Coats</label>
                  <label><input type="checkbox" /> T-Shirts</label>
                  <label><input type="checkbox" /> Shoes</label>
                  <label><input type="checkbox" /> Accessories</label>
                </div>
              </div>
              <div className="filter-group">
                <h4>Price Range</h4>
                <input type="range" min="0" max="1000" value={priceRange} onChange={handlePriceChange} />
                <div className="price-labels">
                  <span>₹0</span>
                  <span className="current-price">₹{priceRange}</span>
                  <span>₹1000</span>
                </div>
              </div>
            </div>
          </aside>

          <section className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product._id}>
                  <div className="product-image">
                    <img src={product.image?.startsWith("/uploads") ? `http://localhost:5000${product.image}` : product.image || "https://via.placeholder.com/150"} alt={product.name} />
                  </div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">Rs. {product.price}</span>
                      <button className="btn add-to-cart-btn" onClick={() => addToCart(product)}>
                        Add to Basket
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="loading-message">
                <p>Loading products...</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>JG Enterprise</h3>
              <p>Your one-stop destination for trendy fashion and accessories.</p>
            </div>
            <div className="footer-column">
              <h4>Shop</h4>
              <ul>
                <li><a href="#">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Sale</a></li>
                <li><a href="#">Collections</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Shipping</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Newsletter</h4>
              <p>Subscribe to get special offers and updates.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button className="btn subscribe-btn">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} JG Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
