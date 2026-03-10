import Blog from "../models/blogModel.js";
import mongoose from "mongoose";

// Get all published blogs (public)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.logs("err", err);
    res.status(500).json({ message: err.message });
  }
};

// Get single blog by slug (public)
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "name avatar");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSingleBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id), isPublished: true },
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "name avatar");

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs by authenticated user
export const getAllBlogsOfUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.userId }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create blog
export const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.userId,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.userId });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    console.log("req.body", req.body);
    Object.assign(blog, req.body);
    console.log("blog", blog);

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
