import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🧠 Smart Reminder</div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
}
