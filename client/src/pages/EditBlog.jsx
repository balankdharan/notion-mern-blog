import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Image, Loader2 } from "lucide-react";
import { getBlogById, updateBlog } from "../api/blogApi"; // adjust import path
import LexicalEditor from "../components/editor/LexicalEditor"; // adjust import path
import PreviewModal from "../components/PreviewModal";
import { supabase } from "../utils/image";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(""); // preview URL (blob: or remote)
  const [coverImageFile, setCoverImageFile] = useState(null); // new File if user picks one
  const [showCoverInput, setShowCoverInput] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL after upload
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);

    return urlData.publicUrl; // ✅ returns the Supabase URL string
  };

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        const blog = data.data;

        setTitle(blog.title || "");
        setExcerpt(blog.excerpt || "");
        setContent(blog.content || "");
        setCoverImage(blog.coverImage || "");
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (coverImage.startsWith("blob:")) URL.revokeObjectURL(coverImage);
    };
  }, [coverImage]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revoke old blob if any
    if (coverImage.startsWith("blob:")) URL.revokeObjectURL(coverImage);

    const previewUrl = URL.createObjectURL(file);
    setCoverImageFile(file);
    setCoverImage(previewUrl);
    setShowCoverInput(false);
  };

  const handleRemoveCover = () => {
    if (coverImage.startsWith("blob:")) URL.revokeObjectURL(coverImage);
    setCoverImage("");
    setCoverImageFile(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalCoverImage = coverImage;

      // If user picked a new file, upload it first to get a URL string
      if (coverImageFile) {
        finalCoverImage = await uploadImage(coverImageFile);
        setCoverImage(finalCoverImage); // swap blob preview for real URL
        setCoverImageFile(null);
        URL.revokeObjectURL(coverImage);
      }

      // Always send plain JSON — req.body will be populated correctly
      await updateBlog(id, {
        title,
        excerpt,
        content,
        coverImage: finalCoverImage,
      });
      navigate(`/blog/${id}`); // adjust redirect as needed
    } catch (err) {
      console.error("Failed to update blog:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  // ── Main UI (mirrors CreateBlog exactly) ─────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Cover Image Section */}
        {coverImage ? (
          <div className="relative h-96 bg-gray-100">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveCover}
              className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="p-8 border-b border-gray-200">
            {showCoverInput ? (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                  <Image className="w-4 h-4" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </label>
                <button
                  onClick={() => setShowCoverInput(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCoverInput(true)}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors group"
              >
                <Image className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Add cover image</span>
              </button>
            )}
          </div>
        )}

        {/* Title */}
        <div className="p-8 pb-4">
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-bold text-gray-900 placeholder-gray-300 outline-none border-none focus:ring-0"
            style={{ caretColor: "#2563eb" }}
          />
        </div>

        {/* Excerpt */}
        <div className="px-8 pb-4">
          <input
            type="text"
            placeholder="Add a brief description..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full text-lg text-gray-600 placeholder-gray-400 outline-none border-none focus:ring-0"
          />
        </div>

        {/* Editor */}
        <div className="px-8 pb-8">
          <LexicalEditor
            value={content}
            onChange={setContent}
            initialContent={content}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          💡 Writing Tips
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use markdown shortcuts: **bold**, *italic*, # for headings</li>
          <li>• Add cover images to make your blog visually appealing</li>
          <li>
            • Write a clear excerpt to help readers understand your content
          </li>
          <li>• Save drafts regularly to avoid losing your work</li>
        </ul>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blog={{ title, content, coverImage, excerpt }}
      />
    </div>
  );
};

export default EditBlog;
