import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Circle } from 'rc-progress';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Fetch tasks from backend on load
  useEffect(() => {
    axios.get('https://smartdash-backend-pkgl.onrender.com/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, []);

  // Add task
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    axios.post('https://smartdash-backend-pkgl.onrender.com/api/tasks', {
      title: newTaskTitle,
      completed: false
    })
    .then(res => setTasks([...tasks, res.data]))
    .catch(err => console.error('Failed to add task:', err));
    setNewTaskTitle('');
  };

  // Delete task
  const deleteTask = (id) => {
    axios.delete(`https://smartdash-backend-pkgl.onrender.com/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(err => console.error('Failed to delete task:', err));
  };

  // Toggle complete
  const toggleTask = (id) => {
    const task = tasks.find(t => t._id === id);
    axios.put(`https://smartdash-backend-pkgl.onrender.com/api/tasks/${id}`, {
      ...task,
      completed: !task.completed
    })
    .then(res =>
      setTasks(tasks.map(t => (t._id === id ? res.data : t)))
    )
    .catch(err => console.error('Failed to toggle task:', err));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const percentCompleted = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">Organize your work and stay productive</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Task Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Task
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-500"
                  placeholder="Enter task description..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  disabled={!newTaskTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tasks ({tasks.length})
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-500">Add your first task to get started</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`group bg-white border rounded-lg p-4 hover:shadow-sm transition-all duration-200 ${
                        task.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleTask(task._id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {task.completed && (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                          <span
                            className={`font-medium transition-all duration-200 cursor-pointer flex-1 ${
                              task.completed
                                ? 'text-gray-500 line-through'
                                : 'text-gray-900'
                            }`}
                            onClick={() => toggleTask(task._id)}
                          >
                            {task.title}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Stats */}
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Progress Overview
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32">
                    <Circle
                      percent={percentCompleted}
                      strokeWidth={6}
                      trailWidth={6}
                      strokeColor="#3B82F6"
                      trailColor="#E5E7EB"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(percentCompleted)}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Total Tasks</span>
                  <span className="text-lg font-semibold text-gray-900">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">Completed</span>
                  <span className="text-lg font-semibold text-blue-600">{completedTasks}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-700 font-medium">Remaining</span>
                  <span className="text-lg font-semibold text-orange-600">{tasks.length - completedTasks}</span>
                </div>
              </div>

              {/* Status Message */}
              {tasks.length > 0 && (
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="text-center">
                      <p className="font-medium">
                        {percentCompleted === 100 
                          ? "All tasks completed!"
                          : percentCompleted >= 75 
                          ? "Almost there!"
                          : percentCompleted >= 50 
                          ? "Great progress!"
                          : "Keep going!"
                        }
                      </p>
                      <p className="text-blue-100 text-sm mt-1">
                        {percentCompleted === 100 
                          ? "Excellent work today"
                          : `${tasks.length - completedTasks} tasks remaining`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}