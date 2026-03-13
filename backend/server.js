import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const app = express();

//routes
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://notion-mern-blog.vercel.app"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(json());

// MongoDB Connection
connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Notion MERN Blog API 🚀",
    status: "running",
  });
});

// 404 - catch all unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
