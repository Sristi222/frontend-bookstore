"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const isLoggedIn = () => !!localStorage.getItem("token");
const logout = () => localStorage.removeItem("token");

const Home = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(1000);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`https://localhost:7085/api/Products?page=${currentPage}&limit=6`);
      const filtered = res.data.data
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => parseFloat(p.price) <= priceRange)
        .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

      setProducts(filtered);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, priceRange, sortOrder]);

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

  return (
    <div className="app-container">
      {/* ====================== NAVBAR ====================== */}
      <header className="navbar">
        <div className="navbar-container">
          <a href="/" className="logo">🛍️ JG Enterprise</a>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
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

      {/* ====================== HERO SECTION ====================== */}
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

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="main-content">
        <div className="container">
          {/* 🔍 Filters and Sorting */}
          <div className="filter-bar d-flex flex-wrap justify-content-between align-items-center mb-3">
            <input
              className="form-control mb-2 me-2"
              placeholder="🔍 Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }}
            />

            <select
              className="form-select mb-2 me-2"
              style={{ width: "180px" }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Sort by Price: Low to High</option>
              <option value="desc">Sort by Price: High to Low</option>
            </select>

            <div className="mb-2">
              <label className="me-2 fw-bold">Max ₹{priceRange}</label>
              <input
                type="range"
                min="0"
                max="1000000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>
          </div>

          {/* 🛍️ Product Grid */}
          <section className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={
                        product.image?.startsWith("/uploads")
                          ? `https://localhost:7085${product.image}`
                          : product.image || "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                    />
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
              <div className="loading-message"><p>No products found.</p></div>
            )}
          </section>

          {/* ⏩ Pagination */}
          <div className="pagination mt-4 d-flex justify-content-center">
            <button className="btn btn-secondary me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
            <span className="align-self-center">Page {currentPage} of {totalPages}</span>
            <button className="btn btn-secondary ms-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </main>

      {/* ====================== FOOTER ====================== */}
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
