import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import ContactUs from "./pages/Contact";

import './App.css';

const isLoggedIn = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("isAdmin") === "true";

// Protected route for normal users
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

// Protected route for admins only
function AdminRoute({ children }) {
  return isLoggedIn() && isAdmin() ? children : <Navigate to="/login" />;
}

// Prevent logged-in users from accessing login/register again
function GuestRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/contactUs" element={<ContactUs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
