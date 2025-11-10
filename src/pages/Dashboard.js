import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const user_id = localStorage.getItem("user_id");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "", due_date: "" });

  const fetchTasks = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/tasks/${user_id}`);
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:5000/tasks", { ...task, user_id });
    setTask({ title: "", description: "", due_date: "" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        My Tasks
      </h1>
      <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="p-2 border rounded w-full md:w-1/4"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="p-2 border rounded w-full md:w-1/3"
        />
        <input
          type="datetime-local"
          value={task.due_date}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          className="p-2 border rounded w-full md:w-1/4"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
            <p className="text-gray-600">{t.description}</p>
            <p className="text-sm text-gray-500">{t.due_date}</p>
            <button
              onClick={() => deleteTask(t.id)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
