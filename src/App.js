import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, Trash2, CalendarDays, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch tasks from backend on load
  useEffect(() => {
    fetch('https://smartdash-backend-pkgl.onrender.com/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, []);

  // Add task
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    fetch('https://smartdash-backend-pkgl.onrender.com/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTaskTitle,
        completed: false
      })
    })
    .then(res => res.json())
    .then(data => setTasks([...tasks, data]))
    .catch(err => console.error('Failed to add task:', err));
    setNewTaskTitle('');
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`https://smartdash-backend-pkgl.onrender.com/api/tasks/${id}`, {
      method: 'DELETE'
    })
    .then(() => setTasks(tasks.filter(task => task._id !== id)))
    .catch(err => console.error('Failed to delete task:', err));
  };

  // Toggle complete
  const toggleTask = (id) => {
    const task = tasks.find(t => t._id === id);
    fetch(`https://smartdash-backend-pkgl.onrender.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed
      })
    })
    .then(res => res.json())
    .then(data => setTasks(tasks.map(t => (t._id === id ? data : t))))
    .catch(err => console.error('Failed to toggle task:', err));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const percentCompleted = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCalendarDate(new Date());
  };

  const goToPreviousYear = () => {
    setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1));
  };

  const goToNextYear = () => {
    setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1));
  };

  // Calendar component
  const CalendarComponent = () => {
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
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={`calendar-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="calendar-header">
          <h2 className="calendar-title">
            <CalendarDays className="calendar-icon" />
            Calendar
          </h2>
          <button
            onClick={goToToday}
            className="today-button"
          >
            Today
          </button>
        </div>
        
        <div className="calendar-content">
          {/* Month Navigation */}
          <div className="month-navigation">
            <button
              onClick={goToPreviousMonth}
              className="nav-button"
            >
              <ChevronLeft className="nav-icon" />
            </button>
            
            <div className="month-display">
              <h3 className="month-name">
                {monthNames[currentMonth]}
              </h3>
            </div>
            
            <button
              onClick={goToNextMonth}
              className="nav-button"
            >
              <ChevronRight className="nav-icon" />
            </button>
          </div>

          {/* Year Navigation */}
          <div className="year-navigation">
            <button
              onClick={goToPreviousYear}
              className="year-nav-button"
            >
              <ChevronLeft className="year-nav-icon" />
            </button>
            
            <div className="year-display">
              <span className="year-text">
                {currentYear}
              </span>
            </div>
            
            <button
              onClick={goToNextYear}
              className="year-nav-button"
            >
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
                const isToday = date.toDateString() === (new Date()).toDateString();
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current-month' : 'other-month'}`}
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
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container">
        {/* Header */}
        <div className="header">
          {/* Dark Mode Toggle */}
          <div className="dark-mode-toggle">
            <button
              onClick={toggleDarkMode}
              className="theme-button"
            >
              {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
            </button>
          </div>
          
          <div className="header-content">
            <h1 className="app-title">
              SmartDash
            </h1>
            <p className="app-subtitle">A simply smart dashboard manager</p>
          </div>
        </div>

        {/* Main Content Flex */}
        <div className="main-content">
          {/* Left Column - Calendar only */}
          <div className="left-column">
            <CalendarComponent />
          </div>

          {/* Middle Column - Tasks */}
          <div className="middle-column">
            {/* Add Task Section */}
            <div className="add-task-section">
              <h2 className="section-title">
                <Plus className="section-icon" />
                Add New Task
              </h2>
              <div className="add-task-form">
                <input
                  type="text"
                  className="task-input"
                  placeholder="Enter task description..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  disabled={!newTaskTitle.trim()}
                  className="add-task-button"
                >
                  <Plus className="button-icon" />
                  Add Task
                </button>
              </div>
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
                      className={`task-item group ${task.completed ? 'completed' : ''}`}
                    >
                      <div className="task-content">
                        <div className="task-main">
                          <button
                            onClick={() => toggleTask(task._id)}
                            className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                          >
                            {task.completed && <Check className="check-icon" />}
                          </button>
                          <span
                            className={`task-title ${task.completed ? 'completed' : ''}`}
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
                      {Math.round(percentCompleted)}%
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
                          ? "🎉 All tasks completed!"
                          : percentCompleted >= 75 
                          ? "⚡ Almost there!"
                          : percentCompleted >= 50 
                          ? "🚀 Great progress!"
                          : "💪 Keep going!"
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
  );
}