// src/pages/StaffOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const API_URL = "https://localhost:7085/api";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/Staff/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const markFulfilled = async (orderId) => {
    try {
      await axios.put(`${API_URL}/Staff/orders/${orderId}/fulfill`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order marked as fulfilled.");
      fetchOrders();
    } catch (err) {
      alert(
        "Failed to mark fulfilled: " + (err.response?.data || err.message)
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="staff-orders">
      <h2>All Orders</h2>
      <table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>User</th>
            <th>Status</th>
            <th>Total</th>
            <th>ClaimCode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{o.status}</td>
              <td>Rs. {o.totalAmount}</td>
              <td>{o.claimCode}</td>
              <td>
                {o.status === "Pending" ? (
                  <button onClick={() => markFulfilled(o.id)}>Mark Fulfilled</button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffOrders;
