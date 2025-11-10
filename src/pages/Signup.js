import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/register", form);
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>
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
          placeholder="Create a password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
