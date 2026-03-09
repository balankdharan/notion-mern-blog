import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";

import ToolbarPlugin from "./Toolbar";

const theme = {
  heading: {
    h1: "text-4xl font-bold mb-4 mt-6",
    h2: "text-3xl font-bold mb-3 mt-5",
    h3: "text-2xl font-semibold mb-2 mt-4",
  },
  paragraph: "mb-2 text-gray-800 leading-relaxed",
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
  list: {
    ul: "list-disc list-inside ml-4 mb-2",
    ol: "list-decimal list-inside ml-4 mb-2",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600",
  },
  code: "bg-gray-900 text-white p-4 rounded-lg font-mono text-sm my-4 block overflow-x-auto",
  link: "text-blue-600 hover:text-blue-700 underline cursor-pointer",
};

// eslint-disable-next-line no-unused-vars
export default function LexicalEditor({ value, onChange }) {
  const initialConfig = {
    namespace: "NotionLikeEditor",
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
    onError(error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
        <ToolbarPlugin />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-125 p-8 outline-none prose prose-lg max-w-none focus:outline-none" />
            }
            placeholder={
              <div className="absolute top-8 left-8 text-gray-400 pointer-events-none select-none">
                Start writing your story...
              </div>
            }
            ErrorBoundary={(props) => (
              <div className="text-red-600 p-4">
                An error occurred: {props.error?.message}
              </div>
            )}
          />
        </div>

        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              onChange(JSON.stringify(editorState.toJSON()));
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
