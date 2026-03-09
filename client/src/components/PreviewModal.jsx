import lexicalToHtml from "../utils/Helper";
import { X } from "lucide-react";

// Preview Modal Component
const PreviewModal = ({ isOpen, onClose, blog }) => {
  if (!isOpen) return null;

  const htmlContent = lexicalToHtml(blog.content);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-73px)]">
            <article className="max-w-3xl mx-auto px-6 py-8">
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="mb-8 -mx-6">
                  <img
                    src={blog.coverImage}
                    alt="Cover"
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

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
              <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Author</p>
                    <p className="text-xs text-gray-500">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <style>{`
                  .preview-content h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; }
                  .preview-content h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; }
                  .preview-content h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1.25rem; }
                  .preview-content h4 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
                  .preview-content h5 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
                  .preview-content h6 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
                  .preview-content p { margin-bottom: 1rem; line-height: 1.75; }
                  .preview-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
                  .preview-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
                  .preview-content li { margin-bottom: 0.5rem; }
                  .preview-content blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; margin: 1rem 0; color: #4b5563; }
                  
                  /* Code Block Section - Like Slack's code snippet */
                  .preview-content pre { 
                    background-color: #1e293b; 
                    padding: 1.5rem; 
                    border-radius: 0.5rem; 
                    overflow-x: auto; 
                    margin: 1.5rem 0;
                    border: 1px solid #334155;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                  }
                  .preview-content pre code { 
                    background-color: transparent; 
                    padding: 0; 
                    border-radius: 0; 
                    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; 
                    font-size: 0.875rem;
                    line-height: 1.6;
                    color: #e2e8f0;
                    display: block;
                    white-space: pre;
                    border: none;
                  }
                  
                  /* Inline Code - Small code snippets within text */
                  .preview-content code.inline-code { 
                    background-color: #f1f5f9; 
                    padding: 0.2rem 0.4rem; 
                    border-radius: 0.25rem; 
                    font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; 
                    font-size: 0.875em;
                    color: #e11d48;
                    border: 1px solid #e2e8f0;
                  }
                  
                  .preview-content a { color: #2563eb; text-decoration: underline; }
                  .preview-content strong { font-weight: 700; }
                  .preview-content em { font-style: italic; }
                `}</style>
                <div
                  className="preview-content text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: htmlContent,
                  }}
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
