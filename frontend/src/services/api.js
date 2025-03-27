import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://54.226.156.215:5000/api",
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;