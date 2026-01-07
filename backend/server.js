import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//routes
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// Middleware
app.use(cors());
app.use(json());

// MongoDB Connection
// connect(process.env.MONGODB_URI || "mongodb://localhost:27017/notion-blog", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
