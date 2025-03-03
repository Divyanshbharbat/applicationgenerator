import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"; // ✅ Import cookie-parser

dotenv.config();
const app = express();

// Middleware https://firstbitecakeshop.vercel.app'
app.use(cors({ origin: "https://application-generator-ten-seven.vercel.app", credentials: true })); // ✅ Allow cookies
app.use(express.json());
app.use(cookieParser()); // ✅ Enable cookie parsing

// MongoDB Connection
 mongoose.connect("mongodb+srv://bharbatdivyansh1:divyansh23005045@cluster0.u9p8i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

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

// ✅ Login Route (Set Cookie)
app.post("/login", async (req, res) => {
  try {console.log(req.body)
    const { uid, password } = req.body;
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ uid: user.uid }, "divyansh", { expiresIn: "1h" });
console.log(token)

    // ✅ Send token as HTTP-only cookie

    
    res.json({ message: "success" ,token:token});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/signup", async (req, res) => {
  try {
    const { name, roll, year, branch, uid, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ uid });
    console.log(existingUser)
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({ name, roll, year, branch, uid, password: hashedPassword });
    
    let y=await newUser.save();
    

    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
});

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, "divyansh", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      req.user = decoded; // Store decoded user data in request
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ✅ Route to Get User Data from Token
app.get("/user", verifyToken,async (req, res) => {
 
 let t= await User.findOne({"id":req.user.id})
 
  res.json({ message: "Token verified", "user": t });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
