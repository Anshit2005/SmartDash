import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import api from "./api";
import {
  CalendarDays, Plus, Check, Trash2,
  ChevronLeft, ChevronRight, Sun, Moon, LogOut
} from "lucide-react";
import "./App.css";

// Separate TaskInput component to isolate input handling
const TaskInput = React.memo(({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="add-task-form">
      <input
        ref={inputRef}
        type="text"
        className="task-input"
        placeholder="Enter task description..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        autoComplete="off"
      />
      <button
        onClick={handleSubmit}
        disabled={!taskTitle.trim()}
        className="add-task-button"
      >
        <Plus className="button-icon" />
        Add Task
      </button>
    </div>
  );
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Fetch tasks only if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addTask = async (title) => {
    try {
      const { data } = await api.post("/tasks", {
        title: title,
        completed: false
      });
      setTasks((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const { data } = await api.put(`/tasks/${id}`, {
        ...task,
        completed: !task.completed
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const percentCompleted = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
  };

  // Calendar navigation functions
  const changeMonth = (offset) => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + offset, 1)
    );
  };

  const changeYear = (offset) => {
    setCalendarDate(
      new Date(calendarDate.getFullYear() + offset, calendarDate.getMonth(), 1)
    );
  };

  const goToToday = () => setCalendarDate(new Date());

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Calendar component
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = calendarDate.getMonth();
    const currentYear = calendarDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const weeks = [];
    const currentDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(days);
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className={`calendar-container ${isDarkMode ? "dark" : ""}`}>
        <div className="calendar-header">
          <h2 className="calendar-title">
            <CalendarDays className="calendar-icon" />
            Calendar
          </h2>
          <button onClick={goToToday} className="today-button">
            Today
          </button>
        </div>
        
        <div className="calendar-content">
          {/* Month Navigation */}
          <div className="month-navigation">
            <button onClick={() => changeMonth(-1)} className="nav-button">
              <ChevronLeft className="nav-icon" />
            </button>
            
            <div className="month-display">
              <h3 className="month-name">
                {monthNames[currentMonth]}
              </h3>
            </div>
            
            <button onClick={() => changeMonth(1)} className="nav-button">
              <ChevronRight className="nav-icon" />
            </button>
          </div>

          {/* Year Navigation */}
          <div className="year-navigation">
            <button onClick={() => changeYear(-1)} className="year-nav-button">
              <ChevronLeft className="year-nav-icon" />
            </button>
            
            <div className="year-display">
              <span className="year-text">
                {currentYear}
              </span>
            </div>
            
            <button onClick={() => changeYear(1)} className="year-nav-button">
              <ChevronRight className="year-nav-icon" />
            </button>
          </div>
          
          <div className="day-names">
            {dayNames.map(day => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
          </div>
          
          <div className="calendar-grid">
            {weeks.map((week, weekIndex) => 
              week.map((date, dayIndex) => {
                const isToday = date.toDateString() === today.toDateString();
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isCurrentMonth ? "current-month" : "other-month"}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date.getDate()}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="selected-date">
            <div className="selected-date-label">Selected Date</div>
            <div className="selected-date-value">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
        <div className="container">
          {/* Header */}
          <div className="header">
            {/* Dark Mode Toggle */}
            <div className="dark-mode-toggle">
              <button onClick={toggleDarkMode} className="theme-button">
                {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
              </button>
            </div>
            
            <div className="header-content">
              <h1 className="app-title">SmartDash</h1>
              <p className="app-subtitle">A simply smart dashboard manager</p>
            </div>

            {/* Logout Button */}
            <div className="logout-container">
              <button onClick={logout} className="logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content Flex */}
          <div className="main-content">
            {/* Left Column - Calendar only */}
            <div className="left-column">
              {renderCalendar()}
            </div>

            {/* Middle Column - Tasks */}
            <div className="middle-column">
              {/* Add Task Section */}
              <div className="add-task-section">
                <h2 className="section-title">
                  <Plus className="section-icon" />
                  Add New Task
                </h2>
                <TaskInput onAddTask={addTask} />
              </div>

              {/* Tasks List */}
              <div className="tasks-section">
                <h2 className="section-title">
                  Tasks ({tasks.length})
                </h2>
                <div className="tasks-list">
                  {tasks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <CalendarDays className="empty-icon" />
                      </div>
                      <h3 className="empty-state-title">No tasks yet</h3>
                      <p className="empty-state-text">Add your first task to get started</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task._id}
                        className={`task-item group ${task.completed ? "completed" : ""}`}
                      >
                        <div className="task-content">
                          <div className="task-main">
                            <button
                              onClick={() => toggleTask(task._id)}
                              className={`task-checkbox ${task.completed ? "checked" : ""}`}
                            >
                              {task.completed && <Check className="check-icon" />}
                            </button>
                            <span
                              className={`task-title ${task.completed ? "completed" : ""}`}
                              onClick={() => toggleTask(task._id)}
                            >
                              {task.title}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="delete-button"
                          >
                            <Trash2 className="delete-icon" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Progress */}
            <div className="right-column">
              <div className="progress-section">
                <h2 className="section-title">
                  Progress Overview
                </h2>
                
                {/* Progress Circle */}
                <div className="progress-circle-container">
                  <div className="progress-circle">
                    <div className="progress-svg">
                      <svg className="progress-ring" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="progress-ring-bg"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="progress-ring-fill"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentCompleted / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="progress-text">
                      <div className="progress-percentage">
                        {percentCompleted}%
                      </div>
                      <div className="progress-label">Complete</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="stats-container">
                  <div className="stat-item total">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-value">{tasks.length}</span>
                  </div>
                  <div className="stat-item completed">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value">{completedTasks}</span>
                  </div>
                  <div className="stat-item remaining">
                    <span className="stat-label">Remaining</span>
                    <span className="stat-value">{tasks.length - completedTasks}</span>
                  </div>
                </div>

                {/* Status Message */}
                {tasks.length > 0 && (
                  <div className="status-message-container">
                    <div className="status-message">
                      <div className="status-content">
                        <p className="status-title">
                          {percentCompleted === 100 
                            ? "All tasks completed!"
                            : percentCompleted >= 75 
                            ? "Almost there!"
                            : percentCompleted >= 50 
                            ? "Great progress!"
                            : "Keep going!"
                          }
                        </p>
                        <p className="status-subtitle">
                          {percentCompleted === 100 
                            ? "Excellent work today!"
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
    </Router>
  );
}