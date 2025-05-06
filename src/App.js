import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import ContactUs from "./pages/Contact";
import ViewProducts from "./pages/ViewProducts";
import AdminLayout from "./pages/AdminLayout";
import Bookmarks from "./pages/Bookmark"


import './App.css';

const isLoggedIn = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("isAdmin") === "true";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  return isLoggedIn() && isAdmin() ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Routes>
          {/* USER SIDE */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/bookmarks" element={<Bookmarks />} />


          {/* ADMIN SIDE */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="add-product" element={<AddProduct />} />
            <Route path="view-products" element={<ViewProducts />} />
            
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
