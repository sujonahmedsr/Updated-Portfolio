"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  ExternalLink,
  Lock,
  Key,
  Copy,
  Check,
  ArrowUpRight,
  Eye,
  Grid,
} from "lucide-react";
import { ShopifyProject } from "@/types/shopify";
import ShopifyAllProjectsModal from "./ShopifyAllProjectsModal";
import ShopifyInspectModal from "./ShopifyInspectModal";

interface ShopifyProjectsSectionProps {
  initialProjects: ShopifyProject[];
}

export default function ShopifyProjectsSection({
  initialProjects,
}: ShopifyProjectsSectionProps) {
  const [projects, setProjects] = useState<ShopifyProject[]>(initialProjects || []);
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [inspectProject, setInspectProject] = useState<ShopifyProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  // Exactly 6 projects displayed in the main section grid
  const featuredStores = projects.slice(0, 6);

  const handleCopyPassword = (e: React.MouseEvent, password: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="work"
      className="py-12 sm:py-20 bg-[#0A0A0A] border-b border-[#1A1A1A] relative"
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7CFF6B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6 border-b border-[#1A1A1A] pb-6 sm:pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-3">
              <ShoppingBag className="w-4 h-4" />
              <span>PRIMARY SPECIALIZATION • 120+ STORES DELIVERED</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
              SHOPIFY PROJECTS
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#A1A1A1] max-w-md font-sans leading-relaxed">
              Custom Shopify storefronts, bespoke Liquid theme architecture, and
              conversion-focused e-commerce designs engineered for global brands.
            </p>

            {/* Quick Header View All Button */}
            <button
              onClick={() => setIsAllModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161616] border border-[#2A2A2A] hover:border-[#7CFF6B] text-xs font-mono text-[#F5F5F0] transition-all hover:bg-[#1E1E1E] shrink-0"
            >
              <Grid className="w-3.5 h-3.5 text-[#7CFF6B]" />
              <span>View All ({projects.length})</span>
            </button>
          </div>
        </div>

        {/* ─── 3-COLUMN GRID AS SPECIFIED (SHOWING TOTAL 6 STORES) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredStores.map((project, index) => {
            const imageSrc =
              project.fullPageScreenshot ||
              project.thumbnail ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80";

            const cleanDomain = project.liveUrl
              ? project.liveUrl
                  .replace(/^https?:\/\//, "")
                  .replace(/\/.*$/, "")
              : "myshopify.com";

            return (
              <div
                key={project._id || index}
                className="group rounded-2xl border border-[#202020] bg-[#121212] hover:border-[#7CFF6B]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#7CFF6B]/5"
              >
                <div>
                  {/* Browser Window Device Chrome Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#171717] border-b border-[#242424] text-[11px] font-mono text-[#666]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#888] bg-[#0E0E0E] px-2.5 py-0.5 rounded-md border border-[#222] truncate max-w-[170px]">
                      <Lock className="w-3 h-3 text-[#7CFF6B] shrink-0" />
                      <span className="truncate">{cleanDomain}</span>
                    </div>

                    <span className="text-[10px] font-mono text-[#7CFF6B] uppercase font-bold truncate max-w-[80px]">
                      {project.theme || "Liquid"}
                    </span>
                  </div>

                  {/* Full-Page Interactive Screenshot with Slow Smooth Hover Scroll */}
                  <div
                    onClick={() => setInspectProject(project)}
                    className="relative h-64 sm:h-72 overflow-hidden bg-[#0A0A0A] cursor-pointer shopify-screen-container group/screen"
                  >
                    <Image
                      src={imageSrc}
                      alt={`${project.title} — Shopify store`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="shopify-screen-img object-cover object-top"
                    />

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity pointer-events-none" />

                    {/* Scroll Hint Badge */}
                    <div className="absolute top-3 left-3 pointer-events-none transition-opacity duration-300 group-hover/screen:opacity-0 z-10">
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-mono text-[#AAA]">
                        ↕ Hover to scroll
                      </span>
                    </div>

                    {/* Category Badge */}
                    {project.category && (
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#7CFF6B] border border-white/10 text-[10px] font-mono">
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Hover Inspect Bottom Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-between px-4 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#7CFF6B] px-3 py-1.5 text-xs font-mono font-bold text-black shadow-lg shadow-[#7CFF6B]/20">
                        <Eye className="w-3.5 h-3.5" /> Inspect Store
                      </span>
                      {project.completionDate && (
                        <span className="text-[10px] font-mono text-[#CCC] bg-black/70 px-2 py-1 rounded-md border border-white/10">
                          {project.completionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#7CFF6B] uppercase tracking-wider">
                          STORE 0{index + 1}
                        </span>
                        {project.clientName && (
                          <span className="text-[11px] text-[#777] font-mono truncate max-w-[160px]">
                            {project.clientName}
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors truncate">
                        {project.title}
                      </h3>
                    </div>

                    {project.description && (
                      <p className="text-xs text-[#999] leading-relaxed line-clamp-2">
                        {project.description.replace(/<[^>]*>/g, "")}
                      </p>
                    )}

                    {/* Feature Chips */}
                    {project.features && project.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.features.slice(0, 3).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] font-mono text-[#BBB]"
                          >
                            {feat}
                          </span>
                        ))}
                        {project.features.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#7CFF6B]">
                            +{project.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1E1E1E]">
                    {/* Live Store Link */}
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 hover:bg-[#7CFF6B] hover:text-black text-[#7CFF6B] px-3 py-2 text-xs font-mono font-medium transition-all truncate"
                        title="Visit Live Store"
                      >
                        <span className="truncate">Live Store</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl bg-[#161616] border border-[#222] text-[#666] px-3 py-2 text-xs font-mono">
                        Coming Soon
                      </div>
                    )}

                    {/* Store Password */}
                    {project.storePassword ? (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyPassword(e, project.storePassword!, project._id || `${index}`)
                        }
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 px-3 py-2 text-xs font-mono transition-all truncate group/pw"
                        title={`Store password: ${project.storePassword} (Click to copy)`}
                      >
                        {copiedId === (project._id || `${index}`) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-400 font-bold truncate">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <Key className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover/pw:rotate-45 transition-transform" />
                            <span className="truncate">{project.storePassword}</span>
                            <Copy className="w-3 h-3 text-amber-400/60 shrink-0 ml-0.5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInspectProject(project)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#181818] border border-[#282828] hover:border-[#7CFF6B] text-[#AAA] hover:text-[#F5F5F0] px-3 py-2 text-xs font-mono transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── PROMINENT "VIEW ALL" POPUP TRIGGER BUTTON ─── */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={() => setIsAllModalOpen(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#161616] border border-[#2A2A2A] hover:border-[#7CFF6B] text-[#F5F5F0] font-mono text-sm font-semibold transition-all duration-300 hover:bg-[#1C1C1C] hover:shadow-xl hover:shadow-[#7CFF6B]/10"
          >
            <Grid className="w-4 h-4 text-[#7CFF6B]" />
            <span>View All Shopify Projects ({projects.length})</span>
            <ArrowUpRight className="w-4 h-4 text-[#7CFF6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <p className="text-xs font-mono text-[#666] mt-3">
            Click to explore full 4-column archive of all e-commerce stores with live previews
          </p>
        </div>
      </div>

      {/* ─── ALL PROJECTS MODAL (4 COLUMNS GRID) ─── */}
      <ShopifyAllProjectsModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        projects={projects}
        onSelectProject={(p) => setInspectProject(p)}
      />

      {/* ─── SINGLE PROJECT FULL SCREENSHOT INSPECT MODAL ─── */}
      <ShopifyInspectModal
        project={inspectProject}
        onClose={() => setInspectProject(null)}
      />
    </section>
  );
}
