"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Quote,
  Square,
  Underline as UnderlineIcon,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  parseHTML() {
    return [{ tag: "div[data-rich-callout]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-rich-callout": "true" }, 0];
  },
});

const extensions = [
  StarterKit,
  Underline,
  Image.configure({ allowBase64: false }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Callout,
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  folder: "projects" | "articles";
  error?: string;
  minHeight?: string;
}

function ToolbarButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`rich-editor-toolbar-button ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="rich-editor-divider" aria-hidden="true" />;
}

export default function RichTextEditor({
  value,
  onChange,
  folder,
  error,
  minHeight = "420px",
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions,
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-editor-content",
        style: `min-height: ${minHeight}`,
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: nextEditor }) => onChange(nextEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  const insertLink = () => {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter the link URL", currentHref);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const insertImage = () => {
    if (!editor) return;
    const url = window.prompt("Paste an image URL");
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const insertCallout = () => {
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: "callout",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Write an important note here..." },
            ],
          },
        ],
      })
      .run();
  };

  const uploadImage = async (file: File) => {
    if (!editor || !file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be under 10MB.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `${folder}/content`);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result?.success || !result?.url)
        throw new Error(result?.message || "Image upload failed.");
      editor.chain().focus().setImage({ src: result.url }).run();
      toast.success("Image inserted from Cloudinary.", { id: toastId });
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.",
        { id: toastId },
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="rich-editor-shell">
        <div
          className="rich-editor-toolbar"
          role="toolbar"
          aria-label="Rich text formatting tools"
        >
          <ToolbarButton
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </ToolbarButton>
          <ToolbarButton
            label="Inline code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            label="Heading 1"
            active={editor.isActive("heading", { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <span className="font-bold">H1</span>
          </ToolbarButton>
          <ToolbarButton
            label="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <span className="font-bold">H2</span>
          </ToolbarButton>
          <ToolbarButton
            label="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <span className="font-bold">H3</span>
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            label="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </ToolbarButton>
          <ToolbarButton
            label="Block quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            label="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft />
          </ToolbarButton>
          <ToolbarButton
            label="Align center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            label="Add link"
            active={editor.isActive("link")}
            onClick={insertLink}
          >
            <LinkIcon />
          </ToolbarButton>
          <ToolbarButton label="Add image URL" onClick={insertImage}>
            <ImagePlus />
          </ToolbarButton>
          <ToolbarButton label="Insert border callout" onClick={insertCallout}>
            <Square />
          </ToolbarButton>
          <ToolbarButton
            label="Insert divider"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </ToolbarButton>
          <label
            className={`rich-editor-upload ${uploading ? "is-uploading" : ""}`}
            title="Upload image to Cloudinary"
          >
            {uploading ? <LoaderCircle className="animate-spin" /> : <Upload />}
            <span>{uploading ? "Uploading" : "Upload image"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={uploading}
              onChange={(event) =>
                event.target.files?.[0] && uploadImage(event.target.files[0])
              }
            />
          </label>
        </div>
        <EditorContent editor={editor} />
      </div>
      <p className="text-[11px] font-mono text-[#666]">
        Rich HTML content is saved with your entry. Images are uploaded directly
        to Cloudinary.
      </p>
      {error && (
        <span className="text-xs font-mono text-[#FF5F56]">{error}</span>
      )}
    </div>
  );
}
