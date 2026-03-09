import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import lexicalToHtml from "../utils/Helper";
import { getBlogBySlug, deleteBlog } from "../api/blogApi";

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔒 Replace this with your actual auth check
  const isAuthUser = true;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(id);
        console.log("data", data);
        setBlog(data.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      setIsDeleting(true);
      await deleteBlog(id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Blog not found.</p>
      </div>
    );
  }

  const htmlContent = lexicalToHtml(blog.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>

            {/* Edit / Delete — only for auth user */}
            {isAuthUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/blog/edit/${id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="h-96">
              <img
                src={blog.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="px-8 py-10">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {blog.title || "Untitled"}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            {/* Metadata */}
            {/* Option 1 — Avatar with name and date */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {blog.author.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Content */}
            <style>{`
              .blog-content h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; }
              .blog-content h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; }
              .blog-content h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1.25rem; }
              .blog-content p { margin-bottom: 1rem; line-height: 1.75; }
              .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
              .blog-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
              .blog-content li { margin-bottom: 0.5rem; }
              .blog-content blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; margin: 1rem 0; color: #4b5563; }
              .blog-content pre { background-color: #1e293b; padding: 1.5rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; border: 1px solid #334155; }
              .blog-content pre code { background-color: transparent; padding: 0; font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.875rem; line-height: 1.6; color: #e2e8f0; display: block; white-space: pre; border: none; }
              .blog-content code.inline-code { background-color: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; color: #e11d48; border: 1px solid #e2e8f0; }
              .blog-content a { color: #2563eb; text-decoration: underline; }
              .blog-content strong { font-weight: 700; }
              .blog-content em { font-style: italic; }
            `}</style>
            <div
              className="blog-content text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlog;
