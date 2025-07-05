import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, Trash2, CalendarDays, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';

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
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Calendar
          </h2>
          <button
            onClick={goToToday}
            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
        </div>
        
        <div className="mb-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <ChevronLeft className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            <div className="text-center">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {monthNames[currentMonth]}
              </h3>
            </div>
            
            <button
              onClick={goToNextMonth}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
            >
              <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousYear}
              className={`p-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded transition-colors`}
            >
              <ChevronLeft className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            
            <div className="text-center">
              <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {currentYear}
              </span>
            </div>
            
            <button
              onClick={goToNextYear}
              className={`p-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded transition-colors`}
            >
              <ChevronRight className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className={`text-center text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} p-2`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {weeks.map((week, weekIndex) => 
              week.map((date, dayIndex) => {
                const isToday = date.toDateString() === (new Date()).toDateString();
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      h-8 w-8 text-sm rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}
                      ${isToday 
                        ? 'bg-blue-600 text-white font-bold shadow-md' 
                        : isSelected
                        ? `${isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-700'} font-semibold`
                        : isCurrentMonth 
                        ? `${isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-100'}` 
                        : `${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`
                      }
                    `}
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
          <div className={`mt-4 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Selected Date</div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          {/* Dark Mode Toggle */}
          <div className="absolute top-0 left-0">
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="text-center">
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              SmartDash
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>A simply smart dashboard manager</p>
          </div>
        </div>

        {/* Main Content Flex */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Calendar only */}
          <div className="flex flex-col space-y-6 basis-1/4 min-w-[280px] max-w-[320px] flex-shrink-0">
            <CalendarComponent />
          </div>

          {/* Middle Column - Tasks */}
          <div className="flex flex-col space-y-6 basis-2/5 min-w-[320px] max-w-[600px] flex-grow">
            {/* Add Task Section */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <Plus className="w-5 h-5 text-blue-600" />
                Add New Task
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  className={`flex-1 px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-500 focus:border-blue-500 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                  placeholder="Enter task description..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  disabled={!newTaskTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Tasks ({tasks.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <CalendarDays className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No tasks yet</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add your first task to get started</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`group ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
                        task.completed 
                          ? `${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}` 
                          : `${isDarkMode ? 'border-gray-600 hover:border-blue-500' : 'border-gray-200 hover:border-blue-300'}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleTask(task._id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              task.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : `${isDarkMode ? 'border-gray-500 hover:border-blue-400' : 'border-gray-300 hover:border-blue-400'}`
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3" />}
                          </button>
                          <span
                            className={`font-medium transition-all duration-200 cursor-pointer flex-1 ${
                              task.completed
                                ? `${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-through`
                                : `${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`
                            }`}
                            onClick={() => toggleTask(task._id)}
                          >
                            {task.title}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className={`opacity-0 group-hover:opacity-100 ${isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} p-1 transition-all duration-200`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Progress */}
          <div className="flex flex-col space-y-6 basis-[35%] min-w-[280px] max-w-[400px] flex-shrink-0">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                Progress Overview
              </h2>
              
              {/* Progress Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={isDarkMode ? "#374151" : "#E5E7EB"}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentCompleted / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(percentCompleted)}%
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className={`flex justify-between items-center py-3 px-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Total Tasks</span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tasks.length}</span>
                </div>
                <div className={`flex justify-between items-center py-3 px-4 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg`}>
                  <span className={`${isDarkMode ? 'text-green-400' : 'text-green-700'} font-medium`}>Completed</span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{completedTasks}</span>
                </div>
                <div className={`flex justify-between items-center py-3 px-4 ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'} rounded-lg`}>
                  <span className={`${isDarkMode ? 'text-orange-400' : 'text-orange-700'} font-medium`}>Remaining</span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{tasks.length - completedTasks}</span>
                </div>
              </div>

              {/* Status Message */}
              {tasks.length > 0 && (
                <div className="mt-6">
                  <div className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white`}>
                    <div className="text-center">
                      <p className="font-medium">
                        {percentCompleted === 100 
                          ? "🎉 All tasks completed!"
                          : percentCompleted >= 75 
                          ? "⚡ Almost there!"
                          : percentCompleted >= 50 
                          ? "🚀 Great progress!"
                          : "💪 Keep going!"
                        }
                      </p>
                      <p className="text-blue-100 text-sm mt-1">
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