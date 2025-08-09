import React, { useEffect, useState } from "react";
import api from "./api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const addTask = async (title) => {
    try {
      const res = await api.post("/tasks", { title });
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await api.put(`/tasks/${id}`, { completed });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Your Tasks</h2>
      <TaskForm onAdd={addTask} />
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onDelete={deleteTask} onToggle={toggleTask} />
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
