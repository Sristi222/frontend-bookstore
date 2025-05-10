// src/pages/StaffProcessClaim.jsx
import { useState } from "react";
import axios from "axios";

const StaffProcessClaim = () => {
  const [claimCode, setClaimCode] = useState("");
  const [result, setResult] = useState(null);
  const token = localStorage.getItem("token");
  const API_URL = "https://localhost:7085/api";

  const processClaim = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/Staff/process-claim`,
        { claimCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      alert("Claim processed successfully.");
    } catch (err) {
      alert(err.response?.data || err.message);
      setResult(null);
    }
  };

  return (
    <div className="staff-process-claim">
      <h2>Process Claim Code</h2>
      <input
        value={claimCode}
        onChange={(e) => setClaimCode(e.target.value)}
        placeholder="Enter Claim Code"
      />
      <button onClick={processClaim}>Verify & Fulfill</button>

      {result && (
        <div className="claim-result">
          <h4>Claim Details:</h4>
          <p>Order ID: {result.id}</p>
          <p>User ID: {result.userId}</p>
          <p>Status: {result.status}</p>
          <p>Total: Rs. {result.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default StaffProcessClaim;
