import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 Hook for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error);
    }
  };
  
  



  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
      <button onClick={()=>{navigate("/signup")}} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">Signup</button>
    </div>
  );
};

export default Login;
