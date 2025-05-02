import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await axios.post("https://localhost:7085/api/Auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // 🔐 Check if admin
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        navigate("/add-product"); // go to admin panel
      } else {
        localStorage.setItem("isAdmin", "false");
        navigate("/"); // go to homepage
      }
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Login</h3>
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary" onClick={loginUser}>
        Login
      </button>
    </div>
  );
};

export default Login;
