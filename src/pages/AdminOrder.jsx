import { useEffect, useState } from "react"
import axios from "axios"


const AdminOrders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:7085/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrders(res.data)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="admin-orders-container">
      <h2>📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order.id}</span>
              <span className={`status status-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p>
              <strong>Claim Code:</strong> {order.claimCode}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> Rs. {order.totalAmount.toFixed(2)}
            </p>

            <h4>Items:</h4>
            <ul>
              {order.orderItems.map((item, index) => (
                <li key={index}>
                  {item.productName} × {item.quantity} @ Rs. {item.unitPrice}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}

export default AdminOrders
