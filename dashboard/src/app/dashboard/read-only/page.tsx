"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  FolderKanban,
  FileText,
  ExternalLink,
  Lock,
  Key,
  Copy,
  Check,
  Eye,
  Github,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Search,
  Calendar,
  Layers,
  Tag,
  Code2,
  X,
  ArrowUpRight,
} from "lucide-react";
import {
  getProjectsApi,
  getShopifyProjectsApi,
  getArticlesApi,
} from "@/lib/api";
import { Project, ShopifyProject, Article } from "@/types";
import { getRichTextExcerpt } from "@/lib/richText";
import RichContentViewer from "@/components/RichContentViewer";
import { toast } from "sonner";

type Tab = "all" | "shopify" | "projects" | "articles";

export default function ReadOnlyDashboardPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [shopifyProjects, setShopifyProjects] = useState<ShopifyProject[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedPw, setCopiedPw] = useState<string | null>(null);

  // Detail Modal States (Read-Only)
  const [selectedShopify, setSelectedShopify] = useState<ShopifyProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projData, shopifyData, artData] = await Promise.all([
        getProjectsApi(),
        getShopifyProjectsApi(),
        getArticlesApi(),
      ]);
      setProjects(projData);
      setShopifyProjects(shopifyData);
      setArticles(artData);
    } catch (e) {
      console.error("Error fetching demo data:", e);
      toast.error("Could not load showcase data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyPw = (pw: string, id: string) => {
    navigator.clipboard.writeText(pw);
    setCopiedPw(id);
    toast.success("Storefront password copied!");
    setTimeout(() => setCopiedPw(null), 2000);
  };

  // Filtered lists based on search
  const filteredShopify = useMemo(() => {
    return shopifyProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.theme || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shopifyProjects, searchTerm]);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.technologies || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const filteredArticles = useMemo(() => {
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  return (
    <div className="space-y-8 font-sans pb-16 text-[#F5F5F0]">
      {/* ─── Top Read-Only Banner ─── */}
      <header className="pb-6 border-b border-[#1E1E1E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GUEST / DEMO SHOWCASE — READ ONLY</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
              Curated Portfolio &amp; Storefront Showcase
            </h1>
            <p className="text-xs sm:text-sm text-[#888] mt-1 font-sans max-w-2xl leading-relaxed">
              Explore live client Shopify storefronts, full-stack web applications,
              and engineering publications. Content editing and deletion are disabled
              in public demo mode.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition-colors"
              title="Refresh Showcase Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Metric Cards Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#222] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              SHOPIFY STORES
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : shopifyProjects.length}
            </div>
            <span className="text-[10px] text-[#777] mt-1 block">
              Active E-Commerce builds
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#222] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              WEB PROJECTS
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B]">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : projects.length}
            </div>
            <span className="text-[10px] text-[#777] mt-1 block">
              Full-stack applications
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#222] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              ARTICLES &amp; BLOGS
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : articles.length}
            </div>
            <span className="text-[10px] text-[#777] mt-1 block">
              Technical articles
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121212] border border-[#222] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              AVAILABILITY
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-bold text-[#7CFF6B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse" />
              Open for Work
            </div>
            <span className="text-[10px] text-[#777] mt-1 block">
              Freelance &amp; Contract
            </span>
          </div>
        </div>
      </div>

      {/* ─── Control Bar: Tab Navigation & Search ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        {/* Navigation Tabs */}
        <div className="inline-flex rounded-xl border border-[#262626] bg-[#121212] p-1 gap-1">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              tab === "all"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                : "text-[#888] hover:text-[#CCC]"
            }`}
          >
            All Works
          </button>
          <button
            onClick={() => setTab("shopify")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              tab === "shopify"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                : "text-[#888] hover:text-[#CCC]"
            }`}
          >
            <ShoppingBag size={12} />
            <span>Shopify ({shopifyProjects.length})</span>
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              tab === "projects"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                : "text-[#888] hover:text-[#CCC]"
            }`}
          >
            <Code2 size={12} />
            <span>Web Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setTab("articles")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              tab === "articles"
                ? "bg-[#7CFF6B]/15 text-[#7CFF6B] font-bold border border-[#7CFF6B]/30"
                : "text-[#888] hover:text-[#CCC]"
            }`}
          >
            <FileText size={12} />
            <span>Articles ({articles.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            type="text"
            placeholder="Search stores, projects, articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#121212] py-2 pl-9 pr-3 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
          />
        </div>
      </div>

      {/* ─── SECTION 1: SHOPIFY STORES (CARD SYSTEM WITH SLOW HOVER SCROLL) ─── */}
      {(tab === "all" || tab === "shopify") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Shopify E-Commerce Stores
              </h2>
            </div>
            <span className="text-xs font-mono text-[#888]">
              {filteredShopify.length} storefront{filteredShopify.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] h-96"
                />
              ))}
            </div>
          ) : filteredShopify.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShopify.map((project) => (
                <div
                  key={project._id}
                  className="group relative rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#7CFF6B]/40 hover:shadow-xl hover:shadow-[#7CFF6B]/5 flex flex-col justify-between"
                >
                  <div>
                    {/* Browser Device Header */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-[#161616] border-b border-[#222] text-[10px] font-mono text-[#666]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#777] bg-[#0E0E0E] px-2.5 py-0.5 rounded-md border border-[#222] max-w-[170px] truncate">
                        <Lock size={9} className="text-[#7CFF6B] shrink-0" />
                        <span className="truncate">
                          {project.liveUrl
                            ? project.liveUrl.replace(/^https?:\/\//, "")
                            : "store.myshopify.com"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#7CFF6B] font-mono uppercase font-bold truncate max-w-[70px]">
                        {project.theme || "Shopify"}
                      </span>
                    </div>

                    {/* Screenshot Preview with Slow Hover-to-Scroll (8.5s) */}
                    <div
                      className="relative h-64 sm:h-72 overflow-hidden bg-[#0A0A0A] cursor-pointer group/screen shopify-screen-container"
                      onClick={() => setSelectedShopify(project)}
                    >
                      {project.fullPageScreenshot ? (
                        <Image
                          src={project.fullPageScreenshot}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="shopify-screen-img object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center bg-[#141414] text-[#444] gap-2">
                          <ShoppingBag size={40} className="text-[#333]" />
                          <span className="text-[11px] font-mono text-[#555]">
                            No screenshot uploaded
                          </span>
                        </div>
                      )}

                      {/* Scroll Hint Badge */}
                      <div className="absolute top-2.5 left-2.5 pointer-events-none transition-opacity duration-300 group-hover/screen:opacity-0">
                        <span className="inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-mono text-[#AAA]">
                          ↕ Hover to scroll
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                          {project.status || "Published"}
                        </span>
                      </div>

                      {/* Hover Inspect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#7CFF6B] px-3 py-1.5 text-xs font-mono font-bold text-black shadow-lg shadow-[#7CFF6B]/20">
                          <Eye size={12} /> Inspect Store
                        </span>
                        {project.completionDate && (
                          <span className="text-[10px] font-mono text-[#DDD] bg-black/70 px-2 py-1 rounded-md border border-white/10">
                            {project.completionDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-[#F5F5F0] font-heading truncate">
                          {project.title}
                        </h3>
                        {project.clientName && (
                          <p className="text-[11px] text-[#777] font-mono mt-0.5">
                            Client: {project.clientName}
                          </p>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-xs text-[#888] leading-relaxed line-clamp-2">
                          {getRichTextExcerpt(project.description, 120)}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.category && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#2A2A2A] bg-[#181818] px-2 py-0.5 text-[10px] font-mono text-[#999]">
                            <Tag size={9} /> {project.category}
                          </span>
                        )}
                        {project.theme && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#2A2A2A] bg-[#181818] px-2 py-0.5 text-[10px] font-mono text-[#999]">
                            <Layers size={9} /> {project.theme}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Side-by-side Live Link & Password */}
                  <div className="px-5 pb-5 pt-0 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1E1E1E]">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-3 py-2 text-xs font-mono font-medium text-[#7CFF6B] transition hover:bg-[#7CFF6B] hover:text-black shadow-sm shadow-[#7CFF6B]/10 truncate"
                          title="Open Live Shopify Store"
                        >
                          <ExternalLink size={12} className="shrink-0" />
                          <span className="truncate">Live Store</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-[#222] bg-[#161616] px-3 py-2 text-[11px] font-mono text-[#555]">
                          No Live URL
                        </div>
                      )}

                      {project.storePassword ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyPw(project.storePassword!, project._id)
                          }
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-mono text-amber-300 transition hover:bg-amber-500/20 active:scale-95 truncate group/pw"
                          title={`Click to copy password: ${project.storePassword}`}
                        >
                          {copiedPw === project._id ? (
                            <>
                              <Check size={12} className="text-emerald-400 shrink-0" />
                              <span className="text-emerald-400 font-bold truncate">
                                Copied!
                              </span>
                            </>
                          ) : (
                            <>
                              <Key
                                size={12}
                                className="text-amber-400 shrink-0 group-hover/pw:rotate-45 transition-transform"
                              />
                              <span className="font-mono tracking-wider truncate font-semibold text-[11px]">
                                {project.storePassword}
                              </span>
                              <Copy
                                size={10}
                                className="text-amber-400/60 shrink-0 ml-0.5"
                              />
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-[#222] bg-[#161616] px-3 py-2 text-[11px] font-mono text-[#555]">
                          No Password
                        </div>
                      )}
                    </div>

                    {/* Details Trigger */}
                    <div className="pt-2 border-t border-[#1C1C1C]">
                      <button
                        onClick={() => setSelectedShopify(project)}
                        className="w-full py-1.5 rounded-lg bg-[#181818] border border-[#242424] text-[11px] font-mono text-[#CCC] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition flex items-center justify-center gap-1.5"
                      >
                        <Eye size={12} />
                        <span>Inspect Storefront Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#666] bg-[#121212] rounded-2xl border border-[#222]">
              No Shopify stores matching &quot;{searchTerm}&quot;.
            </div>
          )}
        </section>
      )}

      {/* ─── SECTION 2: WEB PROJECTS (CARD SYSTEM) ─── */}
      {(tab === "all" || tab === "projects") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Web Engineering Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-[#888]">
              {filteredProjects.length} application{filteredProjects.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] h-80"
                />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden hover:border-[#7CFF6B]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Project Image */}
                    <div
                      className="relative h-48 w-full bg-[#181818] overflow-hidden cursor-pointer"
                      onClick={() => setSelectedProject(p)}
                    >
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#333]">
                          <FolderKanban size={36} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] text-white flex items-center gap-1 border border-[#333]">
                          <Eye size={11} className="text-[#7CFF6B]" /> Click to inspect
                        </span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-5 space-y-2.5">
                      <h3
                        onClick={() => setSelectedProject(p)}
                        className="font-heading text-base font-bold text-[#F5F5F0] hover:text-[#7CFF6B] transition-colors cursor-pointer truncate"
                      >
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="text-xs text-[#888] font-sans line-clamp-2 leading-relaxed">
                          {getRichTextExcerpt(p.description, 110)}
                        </p>
                      )}

                      {/* Tech Chips */}
                      {p.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.technologies
                            .split(",")
                            .slice(0, 4)
                            .map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-[#181818] text-[10px] font-mono text-[#7CFF6B] border border-[#262626]"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="px-5 pb-5 pt-0">
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1C1C1C]">
                      {p.liveLink ? (
                        <a
                          href={p.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-3 py-2 text-xs font-mono text-[#7CFF6B] hover:bg-[#7CFF6B] hover:text-black transition truncate"
                        >
                          <ExternalLink size={12} className="shrink-0" />
                          <span className="truncate">Live Demo</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-[#222] bg-[#161616] px-3 py-2 text-[11px] font-mono text-[#555]">
                          No Demo
                        </div>
                      )}

                      {p.githubLink ? (
                        <a
                          href={p.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2A2A2A] bg-[#161616] px-3 py-2 text-xs font-mono text-[#CCC] hover:text-white hover:border-[#444] transition truncate"
                        >
                          <Github size={12} className="shrink-0" />
                          <span className="truncate">Source</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2A2A2A] bg-[#161616] px-3 py-2 text-xs font-mono text-[#AAA] hover:text-white transition"
                        >
                          <Eye size={12} />
                          <span>Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#666] bg-[#121212] rounded-2xl border border-[#222]">
              No web projects matching &quot;{searchTerm}&quot;.
            </div>
          )}
        </section>
      )}

      {/* ─── SECTION 3: ARTICLES & PUBLICATIONS (CARD SYSTEM) ─── */}
      {(tab === "all" || tab === "articles") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Articles &amp; Tech Insights
              </h2>
            </div>
            <span className="text-xs font-mono text-[#888]">
              {filteredArticles.length} publication{filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] h-72"
                />
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((a) => (
                <div
                  key={a._id}
                  onClick={() => setSelectedArticle(a)}
                  className="rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden hover:border-[#7CFF6B]/30 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {a.image && (
                      <div className="relative h-44 w-full bg-[#181818] overflow-hidden">
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />
                        {a.category && (
                          <div className="absolute top-2.5 right-2.5">
                            <span className="rounded-md bg-black/70 backdrop-blur-md border border-[#333] px-2 py-0.5 text-[9px] font-mono text-[#7CFF6B]">
                              {a.category}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                        {a.createdAt && (
                          <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                      {a.description && (
                        <p className="text-xs text-[#888] font-sans line-clamp-3 leading-relaxed">
                          {getRichTextExcerpt(a.description, 120)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono text-[#7CFF6B]">
                      <span>Read Publication</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#666] bg-[#121212] rounded-2xl border border-[#222]">
              No articles matching &quot;{searchTerm}&quot;.
            </div>
          )}
        </section>
      )}

      {/* ─── DETAIL MODAL: SHOPIFY STORE (READ-ONLY) ─── */}
      {selectedShopify && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedShopify(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0E0E0E] shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedShopify(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-black/60 backdrop-blur-md text-[#888] hover:text-white transition-colors border border-[#333]"
            >
              <X size={16} />
            </button>

            {selectedShopify.fullPageScreenshot && (
              <div className="rounded-t-2xl border-b border-[#242424] bg-[#0E0E0E] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161616] border-b border-[#242424] text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#888] bg-[#0A0A0A] px-3 py-1 rounded-md border border-[#222] max-w-sm truncate">
                    <Lock size={10} className="text-[#7CFF6B]" />
                    <span className="truncate">
                      {selectedShopify.liveUrl || "store.myshopify.com"}
                    </span>
                  </div>
                  <a
                    href={selectedShopify.fullPageScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#7CFF6B] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Full Raw View</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                <div className="relative w-full max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] bg-[#0A0A0A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedShopify.fullPageScreenshot}
                    alt={selectedShopify.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>SHOPIFY STORE DETAILS</span>
                    {selectedShopify.theme && (
                      <span className="text-[#888]">· {selectedShopify.theme}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-[#F5F5F0] font-heading">
                    {selectedShopify.title}
                  </h2>
                  {selectedShopify.clientName && (
                    <p className="text-xs text-[#888] font-mono">
                      Client: {selectedShopify.clientName}
                    </p>
                  )}
                </div>

                <span className="px-2.5 py-1 rounded-full border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 text-[#7CFF6B] text-xs font-mono">
                  {selectedShopify.status || "Published"}
                </span>
              </div>

              {/* Side-by-side Live Link & Password in Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-[#666] uppercase tracking-wider block mb-1">
                    Live Storefront
                  </span>
                  {selectedShopify.liveUrl ? (
                    <a
                      href={selectedShopify.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#7CFF6B] hover:underline font-medium truncate"
                    >
                      <ExternalLink size={13} className="shrink-0" />
                      <span className="truncate">Visit Store</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[#666]">None</span>
                  )}
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Lock size={10} /> Store Password
                  </span>
                  {selectedShopify.storePassword ? (
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-amber-300 font-bold tracking-wider">
                        {selectedShopify.storePassword}
                      </code>
                      <button
                        onClick={() =>
                          handleCopyPw(
                            selectedShopify.storePassword!,
                            selectedShopify._id
                          )
                        }
                        className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400 transition hover:bg-amber-500/20 active:scale-95"
                      >
                        {copiedPw === selectedShopify._id ? (
                          <>
                            <Check size={10} className="text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={10} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#666]">No password</span>
                  )}
                </div>
              </div>

              {/* Description rendered in rich text */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                  Store Details
                </h4>
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                  <RichContentViewer content={selectedShopify.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DETAIL MODAL: WEB PROJECT (READ-ONLY) ─── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0E0E0E] shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-black/60 backdrop-blur-md text-[#888] hover:text-white transition-colors border border-[#333]"
            >
              <X size={16} />
            </button>

            {selectedProject.image && (
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#161616]">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>WEB PROJECT DETAILS</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#F5F5F0] font-heading">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition shadow-lg shadow-[#7CFF6B]/15"
                  >
                    <span>Visit Live Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-mono text-[#F5F5F0] hover:bg-[#252525] transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View GitHub Source</span>
                  </a>
                )}
              </div>

              {/* Technologies */}
              {selectedProject.technologies && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                    Technologies &amp; Architecture
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#242424] text-xs font-mono text-[#7CFF6B]"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                  Overview &amp; Implementation
                </h4>
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                  <RichContentViewer content={selectedProject.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DETAIL MODAL: ARTICLE (READ-ONLY) ─── */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0E0E0E] shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-black/60 backdrop-blur-md text-[#888] hover:text-white transition-colors border border-[#333]"
            >
              <X size={16} />
            </button>

            {selectedArticle.image && (
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#161616]">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2 pb-4 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PUBLISHED ARTICLE</span>
                  {selectedArticle.category && (
                    <span className="text-[#888]">· {selectedArticle.category}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#F5F5F0] font-heading">
                  {selectedArticle.title}
                </h2>
                {selectedArticle.createdAt && (
                  <p className="text-xs text-[#888] font-mono">
                    Published: {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Full Article Content */}
              <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                <RichContentViewer content={selectedArticle.description} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
