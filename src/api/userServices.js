import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials:true
});

export const login = async (formData) => {
  try {
    const response = await API.post("/api/users/login");
    return response;
  } catch (error) {
    throw error;
  }
}