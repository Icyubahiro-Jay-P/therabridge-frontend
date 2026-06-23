// src/lib/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Your backend

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions if your backend uses them
});

// Request interceptor (optional but nice)
api.interceptors.request.use(
  (config) => {
    // You can add auth token here later if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(errorMessage));
  }
);