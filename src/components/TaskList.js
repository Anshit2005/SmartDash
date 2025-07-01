import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get('/api/tasks');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleToggle = async (id, completed) => {
    const res = await axios.put(`/api/tasks/${id}`, { completed });
    setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
  };

  return (
    <div>
      <TaskForm onAdd={handleAdd} />
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
