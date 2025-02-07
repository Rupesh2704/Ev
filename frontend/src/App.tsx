import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Signup from "./pages/Signup.tsx"; // Add Signup
import React from "react";

const App = () => { 
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
  );
};

export default App;
