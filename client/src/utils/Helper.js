// Convert Lexical JSON to HTML
const lexicalToHtml = (content) => {
  if (!content) return "<p>No content yet...</p>";

  try {
    const data = typeof content === "string" ? JSON.parse(content) : content;

    const renderNode = (node, isInCodeBlock = false) => {
      if (!node) return "";

      // Handle text nodes
      if (node.type === "text") {
        let text = node.text || "";

        // For code blocks, preserve all whitespace and escape HTML
        if (isInCodeBlock) {
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }

        // For regular text, escape HTML first
        text = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        // Apply formatting (but not inside code blocks)
        if (node.format & 1) text = `<strong>${text}</strong>`; // Bold
        if (node.format & 2) text = `<em>${text}</em>`; // Italic
        if (node.format & 4) text = `<s>${text}</s>`; // Strikethrough
        if (node.format & 8) text = `<u>${text}</u>`; // Underline
        if (node.format & 16) text = `<code class="inline-code">${text}</code>`; // Inline code
        return text;
      }

      // Handle linebreak nodes in code blocks
      if (node.type === "linebreak") {
        return isInCodeBlock ? "\n" : "<br>";
      }

      // Handle container nodes with children
      const children =
        node.children
          ?.map((child) => renderNode(child, isInCodeBlock))
          .join("") || "";

      switch (node.type) {
        case "root":
          return children;
        case "paragraph":
          return `<p>${children || "<br>"}</p>`;
        case "heading": {
          const tag = node.tag || "h1";
          return `<${tag}>${children}</${tag}>`;
        }
        case "list": {
          const listTag = node.listType === "bullet" ? "ul" : "ol";
          return `<${listTag}>${children}</${listTag}>`;
        }
        case "listitem":
          return `<li>${children}</li>`;
        case "quote":
          return `<blockquote>${children}</blockquote>`;
        case "code": {
          // Handle code blocks - this is the dedicated code section like Slack
          const codeLines = [];

          // Extract text from all child nodes, preserving line breaks
          const extractCodeText = (codeNode) => {
            if (!codeNode) return;

            if (codeNode.type === "text") {
              codeLines.push(codeNode.text || "");
            } else if (codeNode.type === "linebreak") {
              codeLines.push("\n");
            } else if (codeNode.children) {
              codeNode.children.forEach(extractCodeText);
            }
          };

          if (node.children) {
            node.children.forEach(extractCodeText);
          }

          const codeContent = codeLines
            .join("")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          const language = node.language || "";
          return `<pre><code class="language-${language}">${codeContent || " "}</code></pre>`;
        }
        case "link":
          return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
        default:
          return children;
      }
    };

    return renderNode(data.root || data);
  } catch (error) {
    console.error("Error parsing content:", error);
    return content;
  }
};
export default lexicalToHtml;
