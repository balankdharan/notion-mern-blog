import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import CreateBlog from "../pages/CreateBlog";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SingleBlog from "../pages/SingleBlog";

import ProtectedRoute from "../components/ProtectedRoute";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../utils/Auth";

const AppRoutes = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      logout();
      window.location.href = "/login";
    }
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog/:id" element={<SingleBlog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
