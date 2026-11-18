"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  ShoppingBag,
  Lock,
  Key,
  Copy,
  Check,
} from "lucide-react";
import { ShopifyProject } from "@/types/shopify";

interface ShopifyInspectModalProps {
  project: ShopifyProject | null;
  onClose: () => void;
}

export default function ShopifyInspectModal({
  project,
  onClose,
}: ShopifyInspectModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const imageSrc =
    project.fullPageScreenshot ||
    project.thumbnail ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";

  const cleanDomain = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : "myshopify.com";

  const handleCopyPassword = () => {
    if (!project.storePassword) return;
    navigator.clipboard.writeText(project.storePassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#101010] border border-[#262626] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#161616] px-5 sm:px-6 py-4 border-b border-[#222] flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-9 h-9 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/20 flex items-center justify-center text-[#7CFF6B] shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#7CFF6B] uppercase">
                  {project.category || "Shopify Store"}
                </span>
                {project.theme && (
                  <span className="px-2 py-0.5 rounded bg-[#202020] text-[10px] font-mono text-[#A1A1A1] border border-[#2E2E2E]">
                    {project.theme}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F5F0] truncate">
                {project.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7CFF6B] text-black font-mono text-xs font-semibold hover:bg-[#68e057] transition-all"
              >
                <span>Visit Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#202020] text-[#A1A1A1] hover:text-[#F5F5F0] hover:bg-[#282828] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split layout with Screenshot on left, Store Info on right */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Screenshot in browser window mockup */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-xl border border-[#262626] overflow-hidden bg-[#0A0A0A] shadow-xl flex flex-col flex-1">
              {/* Browser mockup header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#1A1A1A] border-b border-[#262626] text-[11px] font-mono text-[#777]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[#0D0D0D] border border-[#242424] text-[10px] text-[#A1A1A1] max-w-[240px] truncate">
                  <Lock className="w-3 h-3 text-[#7CFF6B]" />
                  <span className="truncate">{cleanDomain}</span>
                </div>
                <span className="text-[10px] text-[#7CFF6B] font-mono">200 OK</span>
              </div>

              {/* Scrollable image container */}
              <div className="relative w-full h-[360px] sm:h-[480px] overflow-y-auto bg-[#0E0E0E]">
                <div className="relative w-full min-h-[900px]">
                  <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <p className="text-[11px] font-mono text-[#666] mt-2 text-center">
              ↕ Scroll inside preview window to view complete storefront
            </p>
          </div>

          {/* Details & Specs column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider block mb-1">
                  ABOUT THIS PROJECT
                </span>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F5F0]">
                  {project.title}
                </h4>
                {project.clientName && (
                  <p className="text-xs font-mono text-[#888] mt-1">
                    Client: {project.clientName}
                  </p>
                )}
              </div>

              {project.description && (
                <div className="text-sm text-[#A1A1A1] leading-relaxed">
                  <p>{project.description.replace(/<[^>]*>/g, "")}</p>
                </div>
              )}

              {/* Key metadata grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#222]">
                <div>
                  <span className="text-[10px] font-mono text-[#777] uppercase block">
                    Theme Engine
                  </span>
                  <span className="text-xs font-mono text-[#F5F5F0] font-semibold mt-0.5 block truncate">
                    {project.theme || "Custom Liquid"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#777] uppercase block">
                    Category
                  </span>
                  <span className="text-xs font-mono text-[#F5F5F0] font-semibold mt-0.5 block truncate">
                    {project.category || "E-Commerce"}
                  </span>
                </div>
                {project.completionDate && (
                  <div>
                    <span className="text-[10px] font-mono text-[#777] uppercase block">
                      Delivered
                    </span>
                    <span className="text-xs font-mono text-[#F5F5F0] font-semibold mt-0.5 block">
                      {project.completionDate}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-[#777] uppercase block">
                    Status
                  </span>
                  <span className="text-xs font-mono text-[#7CFF6B] font-semibold mt-0.5 block">
                    {project.status || "Published"}
                  </span>
                </div>
              </div>

              {/* Store Password card if protected */}
              {project.storePassword && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] font-mono text-amber-300 block uppercase">
                        Store Access Password
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-200">
                        {project.storePassword}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Features list */}
              {project.features && project.features.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-[#777] uppercase tracking-wider block mb-2">
                    IMPLEMENTED FEATURES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#181818] border border-[#262626] text-xs font-mono text-[#D4D4D4]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#222] flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7CFF6B]/15"
                >
                  <span>Launch Live Shopify Store</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
