import { Router } from "express";
const router = Router();
import auth from "../middleware/auth.js";

import {
  getAllBlogs,
  getSingleBlog,
  getAllBlogsOfUser,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controller/blogController.js";

// Get all published blogs (public)
router.get("/public", getAllBlogs);

// Get single blog by slug (public)
router.get("/public/:slug", getSingleBlog);

// Get all blogs by authenticated user
router.get("/my-blogs", auth, getAllBlogsOfUser);

// Create blog
router.post("/", auth, createBlog);

// Update blog
router.put("/:id", auth, updateBlog);

// Delete blog
router.delete("/:id", auth, deleteBlog);

export default router;
