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
  origin:"https://divyanshapplicationgenerator.vercel.app",// Update with your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

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

// 📌 ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, roll, year, branch, uid, password } = req.body;

    // Check if user already exists
    if (await User.findOne({ $or: [{ uid }, { roll }] })) {
      return res.status(400).json({ message: "User with this UID or Roll Number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, roll, year, branch, uid, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// 📌 ✅ Login Route (Set HTTP-only Cookie)
app.post("/login", async (req, res) => {
  try {
    const { uid, password } = req.body;
    const user = await User.findOne({ uid });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ uid: user.uid }, JWT_SECRET, { expiresIn: "1h" });

    // ✅ Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to `false` for development, `true` for production (HTTPS)
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "success", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 ✅ Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict", secure: true });
  res.json({ message: "Logout successful" });
});

// 📌 ✅ Middleware to Verify Token
const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Support both methods

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

// 📌 ✅ Get User Data from Token
app.get("/user", verifyToken, async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid });
  res.json({ message: "Token verified", user });
});

// Start Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
