import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ParagraphNode, TextNode } from "lexical";

const theme = {
  paragraph: "editor-paragraph",
};

// eslint-disable-next-line no-unused-vars
export default function LexicalEditor({ value, onChange }) {
  const initialConfig = {
    namespace: "BlogEditor",
    theme,
    nodes: [ParagraphNode, TextNode],
    onError(error) {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="border p-4 min-h-[300px]" />
        }
        placeholder={<div className="text-gray-400">Write something…</div>}
      />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            onChange(JSON.stringify(editorState));
          });
        }}
      />
    </LexicalComposer>
  );
}
