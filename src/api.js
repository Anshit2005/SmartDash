// api.js
import axios from "axios";

// Use production URL if deployed, else localhost
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://smartdash-backend-pkgl.onrender.com/api"
      : "http://localhost:5000/api",
});

// Add token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
