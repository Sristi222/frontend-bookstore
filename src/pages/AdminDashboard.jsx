import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddProduct from "./AddProduct";

const AdminDashboard = () => {
  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            background: "#333",
            color: "#fff",
            padding: "20px",
          }}
        >
          <h2>Admin Panel</h2>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/add-product" style={{ color: "#fff", textDecoration: "none" }}>
                  ➕ Add Product
                </Link>
              </li>
              <li>
                <Link to="/view-products" style={{ color: "#fff", textDecoration: "none" }}>
                  📦 View Products
                </Link>
              </li>
              <li>
                <Link to="/banner" style={{ color: "#fff", textDecoration: "none" }}>
                  📝 Orders
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-products" element={<ViewProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<h2>Welcome to Admin Dashboard</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AdminDashboard;
