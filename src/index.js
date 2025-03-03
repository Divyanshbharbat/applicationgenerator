import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: "https://divyanshapplicationgenerator.vercel.app", 
  // origin:"http://localhost:5173",
  methods: "GET,POST,PUT,DELETE", 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  uid: { type: String, unique: true },
  roll: { type: String, unique: true },
  year: Number,
  branch: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "divyansh";

// Login Route (Set HTTP-only Cookie)
app.post("/login", async (req, res) => {
  try {
    const { uid, password } = req.body;
    const user = await User.findOne({ uid });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ uid: user.uid }, JWT_SECRET, { expiresIn: "1h" });


    res.json({ message: "success", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, roll, year, branch, uid, password } = req.body;
    const existingUser = await User.findOne({ uid });

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, roll, year, branch, uid, password: hashedPassword });
    let t=await newUser.save();

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Fail", error: error.message });
  }
});

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get User Data from Token
app.get("/user", verifyToken, async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid });
  res.json({ message: "Token verified", user });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
