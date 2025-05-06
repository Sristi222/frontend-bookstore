// src/pages/AdminLayout.jsx
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
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
            <li><Link to="/admin/add-product" style={{ color: "#fff" }}>➕ Add Product</Link></li>
            <li><Link to="/admin/view-products" style={{ color: "#fff" }}>📦 View Products</Link></li>
            <li><Link to="/admin/orders" style={{ color: "#fff" }}>📝 Orders</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* This renders child routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
