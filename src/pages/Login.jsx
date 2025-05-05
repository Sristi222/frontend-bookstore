import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://localhost:7085/api/Auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Decode token
      const decoded = jwtDecode(token);

      console.log("Decoded token:", decoded); // check structure

      const userRoles = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // ✅ Check role (array or string)
      const isAdmin =
        (Array.isArray(userRoles) && userRoles.includes("Admin")) ||
        userRoles === "Admin";

      localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

      if (isAdmin) {
        navigate("/add-product");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") loginUser();
  };

  return (
    <div className="container mt-4">
      <h3>Login</h3>
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className="form-control mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="btn btn-primary" onClick={loginUser} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
