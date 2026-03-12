const BlogPlaceholder = ({ title }) => {
  // Generate consistent colors based on the title
  const colors = [
    ["#f97316", "#ec4899"],
    ["#6366f1", "#06b6d4"],
    ["#10b981", "#3b82f6"],
    ["#f59e0b", "#ef4444"],
    ["#8b5cf6", "#14b8a6"],
  ];

  const index = title?.charCodeAt(0) % colors.length || 0;
  const [color1, color2] = colors[index];

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
    >
      {/* Blurred blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-32 h-32 rounded-full opacity-60 blur-2xl"
          style={{ background: color2, top: "-10%", left: "20%" }}
        />
        <div
          className="absolute w-40 h-40 rounded-full opacity-50 blur-2xl"
          style={{ background: color1, bottom: "-10%", right: "10%" }}
        />
        <div
          className="absolute w-24 h-24 rounded-full opacity-40 blur-xl"
          style={{ background: "#ffffff", top: "30%", left: "50%" }}
        />
      </div>
    </div>
  );
};

export default BlogPlaceholder;
