import {
  DecoratorNode,
  createCommand,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

// ── Command ───────────────────────────────────────────────────────────────────
export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");

// ── Node ──────────────────────────────────────────────────────────────────────
export class ImageNode extends DecoratorNode {
  __src;
  __alt;

  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src, alt = "", key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  static importJSON(serializedNode) {
    return $createImageNode(serializedNode.src, serializedNode.alt);
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
    };
  }

  createDOM() {
    return document.createElement("span");
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <img
        src={this.__src}
        alt={this.__alt}
        className="max-w-full rounded-lg my-4 block"
        draggable={false}
      />
    );
  }
}

export function $createImageNode(src, alt = "") {
  return new ImageNode(src, alt);
}

// ── Plugin ────────────────────────────────────────────────────────────────────
// uploadImage: (File) => Promise<string>  (your existing helper)
export function ImagePlugin({ uploadImage }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (file) => {
        uploadImage(file).then((url) => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $insertNodes([$createImageNode(url, file.name)]);
            }
          });
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor, uploadImage]);

  return null;
}
