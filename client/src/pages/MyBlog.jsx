import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Trash2,
  Edit,
  Eye,
  BookOpen,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getMyBlogs, deleteBlog } from "../api/blogApi";
import { getCurrentUser, logout } from "../utils/Auth";
import lexicalToHtml from "../utils/Helper";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getMyBlogs();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlainText = (content) => {
    const html = lexicalToHtml(content);
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Hero Banner */}
      <div className="bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-white/10">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-purple-300 text-2xl md:text-2xl font-bold tracking-wide uppercase mb-1">
                  My Blogs
                </h1>
                {/* <h1 className="text-3xl md:text-4xl font-bold">
                  {user?.name?.split(" ")[0]}'s Writing
                </h1> */}
                <p className="text-blue-100 text-sm mt-1">
                  {blogs.length > 0
                    ? `${blogs.length} blog${blogs.length > 1 ? "s" : ""} published`
                    : "No blogs yet"}
                </p>
              </div>
            </div>

            <Link
              to="/create"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
              New Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start writing your first blog post!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 hover:opacity-90 text-white rounded-lg transition-opacity font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
              >
                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Title */}
                  <Link to={`/blog/${blog._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt ||
                      getPlainText(blog.content)?.substring(0, 150) + "..." ||
                      "No description available"}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {getReadingTime(blog.content || "")} min read
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/blog/edit/${blog._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlog;
