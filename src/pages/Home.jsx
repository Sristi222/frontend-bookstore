"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import "./Home.css"

const isLoggedIn = () => !!localStorage.getItem("token")
const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
}

const Home = () => {
  const [products, setProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [awardWinners, setAwardWinners] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState(1000)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [banner, setBanner] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [loading, setLoading] = useState({
    all: true,
    trending: true,
    bestsellers: true,
    newReleases: true,
    awardWinners: true,
  })
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const navigate = useNavigate()
  const BACKEND_URL = "https://localhost:7085"
  const API_URL = `${BACKEND_URL}/api`
  const token = localStorage.getItem("token")

  const getUserId = () => {
    let id = localStorage.getItem("userId")
    if (!id || id.startsWith("guest-")) {
      id = "guest-" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("userId", id)
    }
    return id
  }

  // Fetch all products for browsing
  const fetchProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, all: true }))
      const res = await axios.get(`${API_URL}/Products?page=${currentPage}&limit=6`)
      const filtered = res.data.data
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((p) => Number.parseFloat(p.finalPrice || p.price) <= priceRange)
        .sort((a, b) => {
          const priceA = a.finalPrice || a.price
          const priceB = b.finalPrice || b.price
          return sortOrder === "asc" ? priceA - priceB : priceB - priceA
        })
      setProducts(filtered)
      setTotalPages(Math.ceil(res.data.total / res.data.limit))
      setLoading((prev) => ({ ...prev, all: false }))
    } catch (err) {
      console.error("Error fetching products:", err.message)
      setLoading((prev) => ({ ...prev, all: false }))
    }
  }

  // Fetch trending products
  const fetchTrendingProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, trending: true }))
      const res = await axios.get(`${API_URL}/Products/trending`)
      if (Array.isArray(res.data)) {
        setTrendingProducts(res.data.slice(0, 4))
      } else {
        console.error("Unexpected response format for trending products:", res.data)
        setTrendingProducts([])
      }
      setLoading((prev) => ({ ...prev, trending: false }))
    } catch (err) {
      console.error("Error fetching trending products:", err.message)
      setTrendingProducts([])
      setLoading((prev) => ({ ...prev, trending: false }))
    }
  }

  // Fetch bestsellers
  const fetchBestSellers = async () => {
    try {
      setLoading((prev) => ({ ...prev, bestsellers: true }))
      const res = await axios.get(`${API_URL}/Products/bestsellers`)
      if (Array.isArray(res.data)) {
        setBestSellers(res.data.slice(0, 4))
      } else {
        console.error("Unexpected response format for bestsellers:", res.data)
        setBestSellers([])
      }
      setLoading((prev) => ({ ...prev, bestsellers: false }))
    } catch (err) {
      console.error("Error fetching bestsellers:", err.message)
      setBestSellers([])
      setLoading((prev) => ({ ...prev, bestsellers: false }))
    }
  }

  // Fetch new releases
  const fetchNewReleases = async () => {
    try {
      setLoading((prev) => ({ ...prev, newReleases: true }))
      const res = await axios.get(`${API_URL}/Products/new-releases`)
      if (Array.isArray(res.data)) {
        setNewReleases(res.data.slice(0, 4))
      } else {
        console.error("Unexpected response format for new releases:", res.data)
        setNewReleases([])
      }
      setLoading((prev) => ({ ...prev, newReleases: false }))
    } catch (err) {
      console.error("Error fetching new releases:", err.message)
      setNewReleases([])
      setLoading((prev) => ({ ...prev, newReleases: false }))
    }
  }

  // Fetch award winners
  const fetchAwardWinners = async () => {
    try {
      setLoading((prev) => ({ ...prev, awardWinners: true }))
      const res = await axios.get(`${API_URL}/Products/award-winners`)
      if (Array.isArray(res.data)) {
        setAwardWinners(res.data.slice(0, 4))
      } else {
        console.error("Unexpected response format for award winners:", res.data)
        setAwardWinners([])
      }
      setLoading((prev) => ({ ...prev, awardWinners: false }))
    } catch (err) {
      console.error("Error fetching award winners:", err.message)
      setAwardWinners([])
      setLoading((prev) => ({ ...prev, awardWinners: false }))
    }
  }

  const fetchBookmarks = async () => {
    const userId = getUserId()
    if (!token || userId.startsWith("guest-")) return
    try {
      const res = await axios.get(`${API_URL}/Bookmarks?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBookmarks(res.data.map((b) => b.bookId))
    } catch (err) {
      console.error("Failed to load bookmarks:", err)
    }
  }

  const fetchBanner = async () => {
    try {
      const res = await axios.get(`${API_URL}/Banners`)
      if (res.data) {
        const now = new Date()
        const validBanners = res.data.filter(
          (b) =>
            b.isActive &&
            (!b.startDateTime || new Date(b.startDateTime) <= now) &&
            (!b.endDateTime || new Date(b.endDateTime) >= now),
        )
        if (validBanners.length > 0) {
          setBanner(validBanners[0])
          setShowBanner(true)
        }
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err)
    }
  }

  // Fetch category-specific products on initial load
  useEffect(() => {
    fetchTrendingProducts()
    fetchBestSellers()
    fetchNewReleases()
    fetchAwardWinners()
    fetchBookmarks()
    fetchBanner()
  }, [])

  // Fetch filtered products when filters change
  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, priceRange, sortOrder])

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  const addToCart = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn()) {
      showNotification("Please log in to add items to your cart.", "error")
      setTimeout(() => navigate("/login"), 2000)
      return
    }
    try {
      const userId = getUserId()
      await axios.post(
        `${API_URL}/Cart?userId=${userId}`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
      )
      showNotification(`${product.name} added to cart!`, "success")
    } catch (err) {
      showNotification("Failed to add item to cart. Please try again.", "error")
      console.error("Error adding to cart:", err.response?.data || err.message)
    }
  }

  const toggleBookmark = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!token) {
      showNotification("Login required to use bookmarks.", "error")
      return
    }
    const userId = getUserId()
    const isBookmarked = bookmarks.includes(product.id)
    try {
      if (isBookmarked) {
        await axios.delete(`${API_URL}/Bookmarks/${product.id}?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBookmarks(bookmarks.filter((id) => id !== product.id))
        showNotification("Bookmark removed.", "info")
      } else {
        await axios.post(
          `${API_URL}/Bookmarks?userId=${userId}`,
          { bookId: product.id },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } },
        )
        setBookmarks([...bookmarks, product.id])
        showNotification("Bookmark added.", "success")
      }
    } catch (err) {
      showNotification("Failed to update bookmark.", "error")
      console.error("Bookmark toggle failed:", err)
    }
  }

  const isBookmarkedFunc = (productId) => bookmarks.includes(productId)

  // Render category badges
  const renderCategoryBadges = (product) => {
    return (
      <div className="category-badges">
        {product.isTrending && <span className="category-badge trending">Trending</span>}
        {product.isBestseller && <span className="category-badge bestseller">Bestseller</span>}
        {product.hasAward && <span className="category-badge award">Award Winner</span>}
        {product.isNewRelease && <span className="category-badge new">New Release</span>}
        {product.isComingSoon && <span className="category-badge coming-soon">Coming Soon</span>}
        {product.isOnDeal && <span className="category-badge deal">Deal</span>}
      </div>
    )
  }

  // Render a product card
  const renderProductCard = (product) => (
    <Link to={`/products/${product.id}`} className="product-card" key={product.id}>
      <div className="product-image" style={{ position: "relative" }}>
        {product.finalPrice !== product.price && (
          <div className="sale-badge">
            SALE {Math.round(100 - ((product.finalPrice || product.price) / product.price) * 100)}% OFF
          </div>
        )}
        {renderCategoryBadges(product)}
        <img
          src={
            product.image?.startsWith("/uploads")
              ? `${BACKEND_URL}${product.image}`
              : product.image || "https://via.placeholder.com/150"
          }
          alt={product.name}
        />
        <button
          className={`bookmark-button ${isBookmarkedFunc(product.id) ? "bookmarked" : ""}`}
          onClick={(e) => toggleBookmark(product, e)}
          title={isBookmarkedFunc(product.id) ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isBookmarkedFunc(product.id) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>
          {product.description?.substring(0, 60)}
          {product.description?.length > 60 ? "..." : ""}
        </p>
        <div className="product-footer">
          {product.finalPrice !== product.price ? (
            <span className="product-price">
              <span className="original-price">Rs. {Number(product.price).toFixed(2)}</span>
              <span className="sale-price">Rs. {Number(product.finalPrice || product.price).toFixed(2)}</span>
            </span>
          ) : (
            <span className="product-price">Rs. {Number(product.price).toFixed(2)}</span>
          )}
          <button className="btn add-to-cart-btn" onClick={(e) => addToCart(product, e)}>
            Add to Basket
          </button>
        </div>
      </div>
    </Link>
  )

  // Render a category section
  const renderCategorySection = (title, products, isLoading, viewAllLink) => (
    <section className="category-section">
      <div className="section-header">
        <h2>{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all-link">
            View All
          </Link>
        )}
      </div>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading {title.toLowerCase()}...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid category-grid">{products.map(renderProductCard)}</div>
      ) : (
        <div className="no-products-message">
          <p>No {title.toLowerCase()} available at this time.</p>
        </div>
      )}
    </section>
  )

  return (
    <div className="app-container">
      {/* Notification */}
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      {/* Banner */}
      {showBanner && banner && (
        <div className="banner-popup">
          <div className="banner-popup-content">
            <button className="banner-close" onClick={() => setShowBanner(false)}>
              ×
            </button>
            <a href={banner.link || "#"}>
              <img
                src={banner.imageUrl?.startsWith("/uploads") ? `${BACKEND_URL}${banner.imageUrl}` : banner.imageUrl}
                alt={banner.title}
                className="banner-popup-image"
              />
            </a>
            <h2>{banner.title}</h2>
            <p>{banner.description}</p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <a href="/" className="logo">
            🛍 JG Enterprise
          </a>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <a href="/" className="nav-link">
              Home
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
            <a href="/my-reviews" className="nav-link">
              My Reviews
            </a>
            <a href="/ContactUs" className="nav-link">
              Contact
            </a>
            {isLoggedIn() && (
              <a href="/bookmarks" className="nav-link">
                Bookmarks
              </a>
            )}
            {isLoggedIn() && (
              <a href="/orders" className="nav-link">
                My Orders
              </a>
            )}
            <div className="auth-buttons">
              {isLoggedIn() ? (
                <button
                  className="btn logout-btn"
                  onClick={() => {
                    logout()
                    window.location.reload()
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <a href="/login" className="btn login-btn">
                    Login
                  </a>
                  <a href="/register" className="btn register-btn">
                    Register
                  </a>
                </>
              )}
              <a href="/cart" className="cart-icon">
                🛒
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
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

      {/* Category Sections */}
      <main className="main-content">
        <div className="container">
          {/* Featured Categories */}
          {renderCategorySection(
            "Trending Products",
            trendingProducts,
            loading.trending,
            "/products?category=trending",
          )}
          {renderCategorySection("New Releases", newReleases, loading.newReleases, "/products?category=new-releases")}
          {renderCategorySection("Bestsellers", bestSellers, loading.bestsellers, "/products?category=bestsellers")}
          {renderCategorySection(
            "Award Winners",
            awardWinners,
            loading.awardWinners,
            "/products?category=award-winners",
          )}

          {/* All Products Section */}
          <section className="all-products-section">
            <div className="section-header">
              <h2>All Products</h2>
            </div>

            <div className="filter-bar">
              <input
                className="search-input"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
              <div className="price-filter">
                <label>Max Price: Rs.{priceRange}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="price-slider"
                />
              </div>
            </div>

            {loading.all ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.length > 0 ? (
                  products.map(renderProductCard)
                ) : (
                  <div className="no-products-message">
                    <p>No products found matching your criteria.</p>
                    <button
                      className="reset-filters-btn"
                      onClick={() => {
                        setSearchTerm("")
                        setPriceRange(1000)
                        setSortOrder("asc")
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pagination">
              <button
                className="pagination-btn prev"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn next"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
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
                <li>
                  <a href="/products?category=new-releases">New Releases</a>
                </li>
                <li>
                  <a href="/products?category=bestsellers">Best Sellers</a>
                </li>
                <li>
                  <a href="/products?category=deals">Sale</a>
                </li>
                <li>
                  <a href="/products?category=award-winners">Award Winners</a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li>
                  <a href="/ContactUs">Contact Us</a>
                </li>
                <li>
                  <a href="/faq">FAQs</a>
                </li>
                <li>
                  <a href="/shipping">Shipping</a>
                </li>
                <li>
                  <a href="/returns">Returns</a>
                </li>
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
  )
}

export default Home
