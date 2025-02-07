import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


// CRUD API Calls
export const fetchTasks = () => api.get("/tasks");
export const createTask = (task) => api.post("/tasks", { title: task });
export const updateTask = (taskId, title) => api.put(`/tasks/${taskId}`, { title });
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export default api;
