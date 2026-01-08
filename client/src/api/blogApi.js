import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getBlogs = () => api.get("/blogs");
export const getMyBlogs = () => api.get("/blogs/me");
export const createBlog = (data) => api.post("/blogs", data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`);
