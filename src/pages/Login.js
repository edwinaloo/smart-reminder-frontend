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
    setMessage(""); // clear previous messages

    try {
      // Login request
      const res = await axios.post("http://127.0.0.1:5000/login", form);

      if (res.status === 200) {
        const { token, user_id } = res.data;

        // ✅ Store token and user_id in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);

        // ✅ Set axios default Authorization header for all future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // ✅ Navigate to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      // Show backend message if available
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
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
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
