import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else fetchTasks();
  }, [navigate]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
  
      const data = await response.json();  // Safe parsing
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  

  // Create Task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: newTask }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error adding task");
      }
  
      const task = await response.json();
      setTasks([...tasks, task]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  

  // Update Task
  const handleUpdateTask = async (taskId) => {
    if (!updatedTitle.trim()) return;
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: updatedTitle }),
      });
      setTasks(tasks.map(task => (task._id === taskId ? { ...task, title: updatedTitle } : task)));
      setEditingTask(null);
      setUpdatedTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter task" className="border px-2 py-1 rounded" />
        <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      {/* Task List */}
      <ul className="w-96">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center p-2 border-b">
            {editingTask === task._id ? (
              <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} className="border px-2 py-1 rounded" />
            ) : (
              <span>{task.title}</span>
            )}
            <div>
              {editingTask === task._id ? (
                <button onClick={() => handleUpdateTask(task._id)} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
              ) : (
                <button onClick={() => setEditingTask(task._id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              )}
              <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">Logout</button>

      
    </div>
  );
};

export default Dashboard;
