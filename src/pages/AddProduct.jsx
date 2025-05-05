"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`https://localhost:7085/api/Products?page=${page}&limit=${limit}`);
      setProducts(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name || !desc || !price || !imageFile) {
      alert("Please fill all fields including image.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);              // ✅ FIX: uppercase
    formData.append("Description", desc);       // ✅ FIX: uppercase
    formData.append("Price", price);            // ✅ FIX: uppercase
    formData.append("Image", imageFile);

    try {
      const res = await axios.post("https://localhost:7085/api/Products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`✅ Product "${name}" added successfully!`);
      fetchProducts();
      setName("");
      setDesc("");
      setPrice("");
      setImageFile(null);
      setPreview("");
      setShowForm(false);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("❌ Failed to add product: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`https://localhost:7085/api/Products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <div className="add-product-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Manage Products</h2>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "➕ Add New Product"}
        </button>
      </div>

      {showForm && (
        <div className="add-product-card mt-3">
          <div className="add-product-header">
            <h3>Add New Product</h3>
            <p>Enter the details of your new product below</p>
          </div>

          <div className="add-product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                className="form-control"
                placeholder="Enter product description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="price"
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                id="image"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && <img src={preview} alt="Preview" className="image-preview" />}
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      <div className="product-table-section mt-5">
        <h4>All Products (Page {page} of {Math.ceil(total / limit)})</h4>
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.map((p, i) => (
                <tr key={p.id}>
                  <td>{(page - 1) * limit + i + 1}</td>
                  <td>{p.name}</td>
                  <td>Rs. {p.price}</td>
                  <td>
                    <img
                      src={p.image?.startsWith("/uploads") ? `https://localhost:7085${p.image}` : p.image}
                      className="product-thumb"
                      alt=""
                    />
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls mt-3 d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ◀ Prev
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
