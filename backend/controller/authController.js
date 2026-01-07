import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const { sign, verify } = jwt;

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
export const getLoggedInUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
