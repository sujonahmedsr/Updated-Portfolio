"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  Search,
  Lock,
  Key,
  Copy,
  Check,
  ShoppingBag,
  Maximize2,
} from "lucide-react";
import { ShopifyProject } from "@/types/shopify";

interface ShopifyAllProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ShopifyProject[];
  onSelectProject?: (project: ShopifyProject) => void;
}

export default function ShopifyAllProjectsModal({
  isOpen,
  onClose,
  projects,
  onSelectProject,
}: ShopifyAllProjectsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ["all", ...Array.from(set)];
  }, [projects]);

  // Filter projects by search and category
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.clientName && p.clientName.toLowerCase().includes(q)) ||
        (p.theme && p.theme.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.features && p.features.some((f) => f.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === "all" ||
        (p.category &&
          p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategory]);

  const handleCopyPassword = (e: React.MouseEvent, password: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0E0E0E] border border-[#262626] rounded-2xl w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#141414]/95 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/25 flex items-center justify-center text-[#7CFF6B] shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider">
                  ALL SHOPIFY STORES
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1F1F1F] border border-[#2E2E2E] text-[10px] font-mono text-[#A1A1A1]">
                  {filteredProjects.length} of {projects.length} Total
                </span>
              </div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#F5F5F0]">
                Shopify Portfolio Archive
              </h2>
            </div>
          </div>

          {/* Right Controls: Search, Clear & Close */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 md:max-w-md justify-end">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                placeholder="Search stores, themes, features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F5F5F0] placeholder:text-[#666] focus:outline-none focus:border-[#7CFF6B] transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#F5F5F0] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1] hover:text-[#F5F5F0] hover:border-[#7CFF6B]/50 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#111111] border-b border-[#1E1E1E] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#7CFF6B] text-black font-semibold shadow-sm shadow-[#7CFF6B]/20"
                  : "bg-[#181818] text-[#888] border border-[#262626] hover:text-[#F5F5F0] hover:border-[#383838]"
              }`}
            >
              {cat === "all" ? "All Stores" : cat}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content: 4-COLUMN GRID AS REQUESTED */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 px-4 border border-[#222222] rounded-2xl bg-[#121212]/50">
              <ShoppingBag className="w-12 h-12 text-[#444] mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-[#F5F5F0] mb-1">
                No stores found
              </h3>
              <p className="text-xs text-[#888] font-mono max-w-sm mx-auto">
                No Shopify stores matched &quot;{searchTerm}&quot;. Try clearing filters or searching another keyword.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#1F1F1F] border border-[#2E2E2E] text-xs font-mono text-[#7CFF6B] hover:border-[#7CFF6B] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProjects.map((project, index) => {
                const imageSrc =
                  project.fullPageScreenshot ||
                  project.thumbnail ||
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80";

                const cleanDomain = project.liveUrl
                  ? project.liveUrl
                      .replace(/^https?:\/\//, "")
                      .replace(/\/.*$/, "")
                  : "myshopify.com";

                return (
                  <div
                    key={project._id || index}
                    className="group rounded-xl border border-[#202020] bg-[#141414] hover:border-[#7CFF6B]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#7CFF6B]/5"
                  >
                    <div>
                      {/* Browser Window Device Header */}
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181818] border-b border-[#242424] text-[10px] font-mono text-[#666]">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-[#FF5F56]/80" />
                          <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/80" />
                          <span className="w-2 h-2 rounded-full bg-[#27C93F]/80" />
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-[#888] bg-[#0E0E0E] px-2 py-0.5 rounded border border-[#222] truncate max-w-[130px]">
                          <Lock className="w-2.5 h-2.5 text-[#7CFF6B] shrink-0" />
                          <span className="truncate">{cleanDomain}</span>
                        </div>
                        <span className="text-[9px] font-mono text-[#7CFF6B] uppercase font-bold truncate max-w-[65px]">
                          {project.theme || "Liquid"}
                        </span>
                      </div>

                      {/* Full-Page Interactive Screenshot with Hover Scroll */}
                      <div
                        onClick={() => onSelectProject?.(project)}
                        className="relative h-48 sm:h-52 overflow-hidden bg-[#0A0A0A] cursor-pointer shopify-screen-container group/screen"
                      >
                        <Image
                          src={imageSrc}
                          alt={`${project.title} — Shopify store`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="shopify-screen-img object-cover object-top"
                        />

                        {/* Top Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity pointer-events-none" />

                        {/* Scroll Hint Badge */}
                        <div className="absolute top-2 left-2 pointer-events-none transition-opacity duration-300 group-hover/screen:opacity-0 z-10">
                          <span className="inline-flex items-center gap-1 rounded bg-black/75 backdrop-blur-md border border-white/10 px-1.5 py-0.5 text-[8px] font-mono text-[#AAA]">
                            ↕ Scroll
                          </span>
                        </div>

                        {/* Category Badge */}
                        {project.category && (
                          <div className="absolute top-2 right-2 z-10 pointer-events-none">
                            <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#7CFF6B] border border-white/10 text-[9px] font-mono">
                              {project.category}
                            </span>
                          </div>
                        )}

                        {/* Quick View Hover Pill */}
                        <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-between pointer-events-none z-10">
                          <span className="inline-flex items-center gap-1 rounded bg-[#7CFF6B] px-2 py-1 text-[10px] font-mono font-bold text-black shadow-md">
                            <Maximize2 className="w-2.5 h-2.5" /> Inspect
                          </span>
                          {project.completionDate && (
                            <span className="text-[9px] font-mono text-[#CCC] bg-black/80 px-1.5 py-0.5 rounded border border-white/10">
                              {project.completionDate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Store Details Body */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <h4 className="font-heading text-sm font-bold text-[#F5F5F0] truncate group-hover:text-[#7CFF6B] transition-colors">
                            {project.title}
                          </h4>
                          {project.clientName && (
                            <p className="text-[10px] text-[#777] font-mono truncate mt-0.5">
                              {project.clientName}
                            </p>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-[11px] text-[#999] leading-relaxed line-clamp-2">
                            {project.description.replace(/<[^>]*>/g, "")}
                          </p>
                        )}

                        {/* Feature Badges */}
                        {project.features && project.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.features.slice(0, 2).map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-1.5 py-0.5 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-[9px] font-mono text-[#AAA] truncate max-w-[120px]"
                              >
                                {feat}
                              </span>
                            ))}
                            {project.features.length > 2 && (
                              <span className="px-1 py-0.5 text-[9px] font-mono text-[#7CFF6B]">
                                +{project.features.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3.5 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5 pt-2.5 border-t border-[#1F1F1F]">
                        {/* Live Store Link */}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 rounded-lg bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 hover:bg-[#7CFF6B] hover:text-black text-[#7CFF6B] px-2 py-1.5 text-[11px] font-mono font-medium transition-all truncate"
                            title="Open Live Store"
                          >
                            <span className="truncate">Live Store</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <div className="flex items-center justify-center rounded-lg bg-[#181818] border border-[#262626] text-[#666] px-2 py-1.5 text-[10px] font-mono">
                            No Link
                          </div>
                        )}

                        {/* Store Password */}
                        {project.storePassword ? (
                          <button
                            type="button"
                            onClick={(e) =>
                              handleCopyPassword(e, project.storePassword!, project._id || `${index}`)
                            }
                            className="flex items-center justify-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 px-2 py-1.5 text-[11px] font-mono transition-all truncate"
                            title={`Store Password: ${project.storePassword} (Click to copy)`}
                          >
                            {copiedId === (project._id || `${index}`) ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="text-emerald-400 text-[10px] font-bold">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                <span className="truncate text-[10px]">
                                  {project.storePassword}
                                </span>
                                <Copy className="w-2.5 h-2.5 text-amber-400/60 shrink-0 ml-0.5" />
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectProject?.(project)}
                            className="flex items-center justify-center gap-1 rounded-lg bg-[#1A1A1A] border border-[#2B2B2B] hover:border-[#7CFF6B] text-[#AAA] hover:text-[#F5F5F0] px-2 py-1.5 text-[11px] font-mono transition-all"
                          >
                            <span>Inspect</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#111111] border-t border-[#1F1F1F] flex items-center justify-between text-xs font-mono text-[#777]">
          <span>
            Showing <strong className="text-[#F5F5F0]">{filteredProjects.length}</strong> stores
          </span>
          <span className="text-[11px]">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
