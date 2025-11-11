import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", form);
      if (res.status === 200) {
        localStorage.setItem("user_id", res.data.user_id);
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {message && <p className="error">{message}</p>}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
