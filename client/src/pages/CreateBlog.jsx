import { useState } from "react";
import LexicalEditor from "../components/editor/LexicalEditor";
import { createBlog } from "../api/blogApi";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    await createBlog({ title, content });
  };

  return (
    <div className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <LexicalEditor value={content} onChange={setContent} />

      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2">
        Publish
      </button>
    </div>
  );
}
