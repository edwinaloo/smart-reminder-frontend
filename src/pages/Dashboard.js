import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../App.css";

// 💬 Motivational Quotes
const quotes = [
  "Discipline beats motivation every time.",
  "Dream big. Start small. Act now.",
  "Don’t watch the clock—do what it does. Keep going.",
  "Your future is created by what you do today.",
  "It always seems impossible until it’s done.",
  "Push yourself, because no one else is going to do it for you.",
  "Stay consistent. Little progress adds up.",
  "You are stronger than your excuses.",
  "Success is the sum of small efforts repeated daily.",
  "Don’t stop until you’re proud.",
];

// 🧠 Ask permission for notifications
const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
};

export default function Dashboard() {
  const user_id = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "", due_date: "" });

  // 📥 Fetch tasks (memoized with useCallback)
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/tasks/${user_id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }, [user_id]);

  // 🔔 Check for upcoming tasks (within 5 minutes)
  const checkForUpcomingTasks = useCallback(() => {
    const now = new Date();
    tasks.forEach((t) => {
      const due = new Date(t.due_date);
      const diff = due - now;
      if (diff > 0 && diff < 300000) {
        new Notification("Task Reminder", {
          body: `${t.title} is due soon!`,
          icon: "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
        });
      }
    });
  }, [tasks]);

  // ➕ Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/tasks", { ...task, user_id });
      setTask({ title: "", description: "", due_date: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ❌ Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ⚙️ Initialize notifications & fetch tasks
  useEffect(() => {
    requestNotificationPermission();
    fetchTasks();

    const interval = setInterval(() => {
      checkForUpcomingTasks();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchTasks, checkForUpcomingTasks]);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        {/* 💡 Motivational Quote Widget */}
        <div className="quote-box">
          <h3>💡 Daily Motivation</h3>
          <p>{quotes[Math.floor(Math.random() * quotes.length)]}</p>
        </div>

        {/* 📝 Task Form */}
        <div className="task-form-container">
          <h2>Create a Task</h2>
          <form onSubmit={addTask} className="task-form">
            <input
              type="text"
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
            <input
              type="datetime-local"
              value={task.due_date}
              onChange={(e) => setTask({ ...task, due_date: e.target.value })}
              required
            />
            <button type="submit">Add Task</button>
          </form>
        </div>

        {/* 📋 Task List */}
        <div className="task-list-container">
          <h2>My Tasks</h2>
          <div className="task-grid">
            {tasks.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                No tasks yet — add one above!
              </p>
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="task-card">
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <p className="due-date">Due: {t.due_date}</p>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
