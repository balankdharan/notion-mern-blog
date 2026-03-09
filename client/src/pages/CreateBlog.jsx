import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LexicalEditor from "../components/editor/LexicalEditor";
import { createBlog } from "../api/blogApi";
import { Image, X, Eye, Send, ArrowLeft } from "lucide-react";
import { supabase } from "../utils/image";
import PreviewModal from "../components/PreviewModal";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null); // stores the raw File
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [showCoverInput, setShowCoverInput] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please add a title");
      return;
    }

    try {
      setIsPublishing(true);

      let finalImageUrl = coverImage;

      // If there's a pending file, upload it now
      if (coverImageFile) {
        setIsUploading(true);
        finalImageUrl = await uploadImage(coverImageFile);
        setCoverImage(finalImageUrl); // replace blob with real URL
        setCoverImageFile(null);
        URL.revokeObjectURL(coverImage); // free memory
        setIsUploading(false);
      }

      await createBlog({
        title,
        content,
        coverImage: finalImageUrl, // ✅ real Supabase URL saved to DB
        excerpt,
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to publish blog");
    } finally {
      setIsPublishing(false);
      setIsUploading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      "blogDraft",
      JSON.stringify({ title, content, coverImage, excerpt }),
    );
    alert("Draft saved!");
  };

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

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Save Draft
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPublishing}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                {isUploading
                  ? "Uploading image..."
                  : isPublishing
                    ? "Publishing..."
                    : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image Section */}
          {coverImage ? (
            <div className="relative h-96 bg-gray-100">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              {/* <button
                onClick={() => setCoverImage("")}
                
              > */}
              <button
                onClick={() => {
                  if (coverImage.startsWith("blob:"))
                    URL.revokeObjectURL(coverImage);
                  setCoverImage("");
                  setCoverImageFile(null);
                }}
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
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const previewUrl = URL.createObjectURL(file);
                        setCoverImageFile(file);
                        setCoverImage(previewUrl);
                        setShowCoverInput(false);
                      }}
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

          {/* Title Input */}
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

          {/* Excerpt Input */}
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
            <LexicalEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Writing Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Use markdown shortcuts: **bold**, *italic*, # for headings
            </li>
            <li>• Add cover images to make your blog visually appealing</li>
            <li>
              • Write a clear excerpt to help readers understand your content
            </li>
            <li>• Save drafts regularly to avoid losing your work</li>
          </ul>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blog={{ title, content, coverImage, excerpt }}
      />
    </div>
  );
}
