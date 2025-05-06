import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://localhost:7085/api/Products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        alert("Product not found.");
        navigate("/"); // redirect if not found
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "15px" }}>⬅️ Back</button>

      <h2>{product.name}</h2>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ maxWidth: "300px", display: "block", marginBottom: "15px" }}
        />
      )}

      <p><strong>Author:</strong> {product.author || "N/A"}</p>
      <p><strong>Genre:</strong> {product.genre || "N/A"}</p>
      <p><strong>Publisher:</strong> {product.publisher || "N/A"}</p>
      <p><strong>ISBN:</strong> {product.isbn || "N/A"}</p>
      <p><strong>Language:</strong> {product.language || "N/A"}</p>
      <p><strong>Format:</strong> {product.format || "N/A"}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stockQuantity} units</p>

      {product.discountPercent > 0 && (
        <>
          <p><strong>Discount:</strong> {product.discountPercent}%</p>
          <p>
            <strong>Discount Valid:</strong>{" "}
            {product.discountStartDate ? new Date(product.discountStartDate).toLocaleDateString() : "N/A"}{" "}
            -{" "}
            {product.discountEndDate ? new Date(product.discountEndDate).toLocaleDateString() : "N/A"}
          </p>
        </>
      )}

      <p><strong>Description:</strong></p>
      <p>{product.description || "No description available."}</p>
    </div>
  );
};

export default ProductDetails;
