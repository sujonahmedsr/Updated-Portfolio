"use client";

import React from "react";

interface RichContentViewerProps {
  content: string | undefined | null;
  className?: string;
  emptyMessage?: string;
}

export default function RichContentViewer({
  content,
  className = "",
  emptyMessage = "No description provided.",
}: RichContentViewerProps) {
  if (!content || !content.trim() || content === "<p></p>") {
    return (
      <p className="text-xs text-[#666] italic font-mono py-2">{emptyMessage}</p>
    );
  }

  // If content is plain text without any HTML tags, format line breaks
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  const formattedHtml = hasHtml
    ? content
    : content
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");

  return (
    <div
      className={`rich-editor-content text-sm text-[#D0D0C8] leading-relaxed break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}
