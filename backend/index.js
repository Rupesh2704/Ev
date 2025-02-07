const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/taskmanager", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// User Schema & Model
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Task Schema & Model
const Task = mongoose.model("Task", new mongoose.Schema({
  userId: String,
  title: String,
}));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// User Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// User Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get All Tasks for Logged-in User
app.get("/api/tasks", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Create a New Task
app.post("/api/tasks", verifyToken, async (req, res) => {
  const task = new Task({ userId: req.userId, title: req.body.title });
  await task.save();
  res.json(task);
});

// Update a Task by ID
app.put("/api/tasks/:id", verifyToken, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
  res.json(task);
});

// Delete a Task by ID
app.delete("/api/tasks/:id", verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
