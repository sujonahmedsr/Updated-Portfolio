"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
  ExternalLink,
  Copy,
  Link as LinkIcon,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "projects" | "articles" | "general";
  label?: string;
  error?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "projects",
  label = "FEATURED / COVER IMAGE",
  error,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB.");
      return;
    }

    // Check type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success && res.data?.url) {
        onChange(res.data.url);
        toast.success("Image uploaded to Cloudinary successfully!", { id: toastId });
      } else {
        throw new Error(res.data?.message || "Upload failed");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to upload image.";
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Image URL copied to clipboard!");
  };

  return (
    <div className="space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-[#A1A1A1] block">{label}</label>
        
        {/* Toggle between Upload and URL input */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`px-2.5 py-1 rounded transition-colors ${
              inputMode === "upload"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30"
                : "text-[#666] hover:text-[#A1A1A1]"
            }`}
          >
            Upload to Cloudinary
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`px-2.5 py-1 rounded transition-colors ${
              inputMode === "url"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] border border-[#7CFF6B]/30"
                : "text-[#666] hover:text-[#A1A1A1]"
            }`}
          >
            Enter URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Direct URL input mode */}
      {inputMode === "url" && (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-[#555] absolute left-3 top-3.5" />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or https://example.com/image.jpg"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#161616] border border-[#262626] text-sm text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] font-mono"
          />
        </div>
      )}

      {/* Upload Zone / Active Preview */}
      {inputMode === "upload" && (
        <>
          {value ? (
            /* Image Preview Card */
            <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
              <div className="relative rounded-lg overflow-hidden border border-[#333] bg-[#0A0A0A] aspect-video max-h-56 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Cloudinary Badge */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#7CFF6B]/40 text-[10px] font-mono text-[#7CFF6B] flex items-center gap-1.5 shadow-lg">
                  <Check className="w-3 h-3 text-[#7CFF6B]" />
                  <span>Hosted on Cloudinary</span>
                </div>
              </div>

              {/* URL String & Action Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 font-mono text-xs pt-1">
                <div className="truncate text-[11px] text-[#888] bg-[#121212] px-3 py-2 rounded border border-[#222] flex-1">
                  {value}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#7CFF6B]"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#7CFF6B]"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#7CFF6B] hover:bg-[#7CFF6B]/10 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3 h-3 ${uploading ? "animate-spin" : ""}`} />
                    <span>Change</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#FF5F56] hover:border-[#FF5F56]/40"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                isDragOver
                  ? "border-[#7CFF6B] bg-[#7CFF6B]/5"
                  : "border-[#2A2A2A] bg-[#141414] hover:border-[#7CFF6B]/50 hover:bg-[#161616]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mx-auto text-[#7CFF6B]">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono font-medium text-[#F5F5F0]">
                  {uploading
                    ? "Uploading directly to Cloudinary..."
                    : "Click to upload or drag and drop image here"}
                </p>
                <p className="text-[11px] font-mono text-[#666]">
                  PNG, JPG, WEBP, GIF, SVG up to 10MB • Auto-hosted on Cloudinary
                </p>
              </div>

              {!uploading && (
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#333] text-[#7CFF6B] font-mono text-xs hover:bg-[#7CFF6B] hover:text-black transition-all"
                >
                  Select File
                </button>
              )}
            </div>
          )}
        </>
      )}

      {error && <span className="text-xs font-mono text-[#FF5F56] block">{error}</span>}
    </div>
  );
}
