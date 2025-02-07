require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const app = express();
app.use(express.json());

// CORS - Allow only your frontend domain
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ MongoDB Connection - Use Environment Variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Failed:", err.message));

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

// ✅ Health Check Route (For Render)
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

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

// ✅ Use Environment Variable for Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
