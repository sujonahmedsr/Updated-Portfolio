"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  FileText,
  Mail,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Activity,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Eye,
  Key,
  Check,
  Copy,
  Github,
  Calendar,
  Layers,
  Code2,
  X,
  BookOpen,
  Lock,
} from "lucide-react";
import {
  getProjectsApi,
  getShopifyProjectsApi,
  getArticlesApi,
  getMessagesApi,
} from "@/lib/api";
import { Project, ShopifyProject, Article, Message } from "@/types";
import { getRichTextExcerpt } from "@/lib/richText";
import RichContentViewer from "@/components/RichContentViewer";
import { toast } from "sonner";

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [shopifyProjects, setShopifyProjects] = useState<ShopifyProject[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Detail Popups
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedShopify, setSelectedShopify] = useState<ShopifyProject | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copiedPw, setCopiedPw] = useState<string | null>(null);

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = currentTime?.getHours() ?? 12;
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projData, shopifyData, artData, msgData] = await Promise.all([
        getProjectsApi(),
        getShopifyProjectsApi(),
        getArticlesApi(),
        getMessagesApi(),
      ]);
      setProjects(projData);
      setShopifyProjects(shopifyData);
      setArticles(artData);
      setMessages(msgData);
    } catch (e) {
      console.error("Error fetching overview data:", e);
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
    toast.success("Store password copied!");
    setTimeout(() => setCopiedPw(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* ─── Header Banner ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE COMMAND CENTER</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-[#F5F5F0]">
            {greeting}, Shofiqul.
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-sans">
            Real-time status of your web portfolio, Shopify storefronts, articles,
            and client messages.
          </p>
          <span className="inline-flex items-center gap-2 mt-2.5 text-[11px] text-[#7CFF6B] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse" />
            Local system time: {formattedTime}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/shopify-projects"
            className="px-3.5 py-2 rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-[#7CFF6B] font-mono text-xs hover:bg-[#7CFF6B]/20 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Shopify Store</span>
          </Link>

          <Link
            href="/dashboard/projects/new"
            className="px-3.5 py-2 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-1.5 shadow-lg shadow-[#7CFF6B]/15"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Web Project</span>
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        {/* Shopify Stores */}
        <Link
          href="/dashboard/shopify-projects"
          className="p-5 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 hover:shadow-lg hover:shadow-[#7CFF6B]/5 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              SHOPIFY STORES
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : shopifyProjects.length}
            </div>
            <div className="text-[11px] text-[#777] flex items-center gap-1 mt-1">
              <span className="text-[#7CFF6B] font-semibold">● Stores</span> in portfolio
            </div>
          </div>
        </Link>

        {/* Web Projects */}
        <Link
          href="/dashboard/projects"
          className="p-5 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 hover:shadow-lg hover:shadow-[#7CFF6B]/5 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              WEB PROJECTS
            </span>
            <div className="p-2 rounded-lg bg-[#7CFF6B]/10 text-[#7CFF6B] group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : projects.length}
            </div>
            <div className="text-[11px] text-[#777] flex items-center gap-1 mt-1">
              <span className="text-[#7CFF6B]">● Active</span> full-stack apps
            </div>
          </div>
        </Link>

        {/* Articles / Blogs */}
        <Link
          href="/dashboard/articles"
          className="p-5 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              ARTICLES / BLOG
            </span>
            <div className="p-2 rounded-lg bg-[#181818] text-[#DDD] group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : articles.length}
            </div>
            <div className="text-[11px] text-[#777] flex items-center gap-1 mt-1">
              <span className="text-[#DDD]">● Published</span> articles
            </div>
          </div>
        </Link>

        {/* Client Messages */}
        <Link
          href="/dashboard/messages"
          className="p-5 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              INBOX MESSAGES
            </span>
            <div className="p-2 rounded-lg bg-[#181818] text-[#7CFF6B] group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
              {loading ? "..." : messages.length}
            </div>
            <div className="text-[11px] text-[#777] flex items-center gap-1 mt-1">
              <span className="text-[#7CFF6B]">● Inquiries</span> received
            </div>
          </div>
        </Link>

        {/* System Health */}
        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#888] tracking-wider">
              SYSTEM STATUS
            </span>
            <Activity className="w-4 h-4 text-[#7CFF6B]" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-[#7CFF6B] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span>OPERATIONAL</span>
            </div>
            <div className="text-[11px] text-[#666] mt-1">
              API &amp; DB connected
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: SHOPIFY STORES SHOWCASE ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#7CFF6B]" />
            <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
              Shopify Projects &amp; Stores
            </h2>
            <span className="text-xs font-mono text-[#777]">
              ({shopifyProjects.length} total)
            </span>
          </div>

          <Link
            href="/dashboard/shopify-projects"
            className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
          >
            <span>Manage All Stores</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden"
              >
                <div className="h-44 bg-[#181818]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#222] rounded w-2/3" />
                  <div className="h-3 bg-[#1A1A1A] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : shopifyProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shopifyProjects.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="group relative rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#7CFF6B]/40 hover:shadow-xl hover:shadow-[#7CFF6B]/5 flex flex-col justify-between"
              >
                <div>
                  {/* Browser Window Header */}
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#161616] border-b border-[#222] text-[10px] font-mono text-[#666]">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2 h-2 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2 h-2 rounded-full bg-[#27C93F]/80" />
                    </div>
                    <span className="text-[9px] text-[#7CFF6B] uppercase font-bold truncate max-w-[100px]">
                      {item.theme || "Shopify"}
                    </span>
                  </div>

                  {/* Screenshot Preview with auto-scroll */}
                  <div
                    className="relative h-64 sm:h-72 w-full bg-[#161616] overflow-hidden cursor-pointer group/screen shopify-screen-container"
                    onClick={() => setSelectedShopify(item)}
                  >
                    {item.fullPageScreenshot ? (
                      <Image
                        src={item.fullPageScreenshot}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="shopify-screen-img object-cover object-top "
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#151515] text-[#333]">
                        <ShoppingBag size={36} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

                    <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover/screen:opacity-100 transition-opacity">
                      <span className="rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] text-white flex items-center gap-1 border border-[#333]">
                        <Eye size={11} className="text-[#7CFF6B]" /> Click for details
                      </span>
                    </div>

                    <div className="absolute top-2 left-2 pointer-events-none transition-opacity duration-300 group-hover/screen:opacity-0">
                      <span className="rounded bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono text-[#AAA]">
                        ↕ Hover scroll
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div
                      onClick={() => setSelectedShopify(item)}
                      className="cursor-pointer group/title"
                    >
                      <h3 className="font-heading text-base font-bold text-[#F5F5F0] group-hover/title:text-[#7CFF6B] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.clientName && (
                        <p className="text-[11px] text-[#777] font-mono mt-0.5">
                          Client: {item.clientName}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-[#888] font-sans line-clamp-2 leading-relaxed">
                        {getRichTextExcerpt(item.description, 110)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Side-by-side Live Link and Password */}
                <div className="px-4 pb-4 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1C1C1C]">
                    {item.liveUrl ? (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-2.5 py-1.5 text-xs font-mono text-[#7CFF6B] transition hover:bg-[#7CFF6B] hover:text-black truncate"
                        title="Open Shopify store"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="truncate">Live Store</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-lg border border-[#222] bg-[#161616] px-2.5 py-1.5 text-[10px] font-mono text-[#555]">
                        No Link
                      </div>
                    )}

                    {item.storePassword ? (
                      <button
                        onClick={() =>
                          handleCopyPw(item.storePassword!, item._id)
                        }
                        className="flex items-center justify-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs font-mono text-amber-300 transition hover:bg-amber-500/20 active:scale-95 truncate"
                        title={`Copy password: ${item.storePassword}`}
                      >
                        {copiedPw === item._id ? (
                          <>
                            <Check size={11} className="text-emerald-400 shrink-0" />
                            <span className="text-emerald-400 font-bold truncate">Copied</span>
                          </>
                        ) : (
                          <>
                            <Key size={11} className="text-amber-400 shrink-0" />
                            <span className="truncate text-[11px] font-mono">
                              {item.storePassword}
                            </span>
                            <Copy size={9} className="text-amber-400/60 shrink-0 ml-0.5" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center rounded-lg border border-[#222] bg-[#161616] px-2 py-1.5 text-[10px] font-mono text-[#555]">
                        No Pass
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#121212] rounded-2xl border border-[#222] space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#333] mx-auto" />
            <p className="text-xs text-[#888]">No Shopify projects added yet.</p>
            <Link
              href="/dashboard/shopify-projects"
              className="inline-block mt-2 text-xs font-mono text-[#7CFF6B] hover:underline"
            >
              + Add first Shopify project
            </Link>
          </div>
        )}
      </section>

      {/* ─── SECTION 2: TWO COLUMN HUB - WEB PROJECTS & ARTICLES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Web Projects */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#7CFF6B]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Web Engineering Projects
              </h2>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#121212] border border-[#222] animate-pulse space-y-2"
                  >
                    <div className="h-4 bg-[#1E1E1E] rounded w-1/3" />
                    <div className="h-3 bg-[#181818] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              projects.slice(0, 3).map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all flex items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {p.image ? (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#1A1A1A]">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center shrink-0 text-[#444]">
                        <FolderKanban size={20} />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="font-heading font-bold text-sm text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors truncate">
                        {p.title}
                      </div>
                      <p className="text-[#888] text-[11px] font-sans line-clamp-1">
                        {getRichTextExcerpt(p.description, 90)}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {p.technologies?.split(",").slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded bg-[#181818] text-[9px] text-[#7CFF6B] border border-[#262626]"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#CCC] hover:text-[#7CFF6B] transition text-[10px]"
                    >
                      View
                    </button>
                    <Link
                      href={`/dashboard/projects/${p._id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition text-[10px]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                No web projects found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Articles / Blogs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#DDD]" />
              <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Articles &amp; Blogs
              </h2>
            </div>
            <Link
              href="/dashboard/articles"
              className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
            >
              <span>All Posts ({articles.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#121212] border border-[#222] animate-pulse space-y-2"
                  >
                    <div className="h-4 bg-[#1E1E1E] rounded w-1/2" />
                    <div className="h-3 bg-[#181818] rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              articles.slice(0, 3).map((a) => (
                <div
                  key={a._id}
                  className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => setSelectedArticle(a)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {a.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#1A1A1A]">
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center shrink-0 text-[#444]">
                        <BookOpen size={18} />
                      </div>
                    )}

                    <div className="space-y-0.5 min-w-0">
                      <div className="font-heading font-bold text-sm text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors truncate">
                        {a.title}
                      </div>
                      <p className="text-[#888] text-[11px] font-sans line-clamp-1">
                        {getRichTextExcerpt(a.description, 80)}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#666]">
                        {a.category && (
                          <span className="text-[#7CFF6B]">{a.category}</span>
                        )}
                        {a.createdAt && (
                          <span>· {new Date(a.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(a);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-[#CCC] hover:text-[#7CFF6B] transition text-[10px] shrink-0"
                  >
                    Read
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                No articles published yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: RECENT INCOMING MESSAGES ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#7CFF6B]" />
            <h2 className="font-heading text-lg font-bold text-[#F5F5F0]">
              Recent Contact Form Inquiries
            </h2>
            <span className="text-xs font-mono text-[#777]">
              ({messages.length} total)
            </span>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
          >
            <span>Open Messages Inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#121212] border border-[#222] animate-pulse space-y-2"
              >
                <div className="h-4 bg-[#1E1E1E] rounded w-1/2" />
                <div className="h-3 bg-[#181818] rounded w-full" />
              </div>
            ))
          ) : messages.length > 0 ? (
            messages.slice(0, 3).map((m) => (
              <div
                key={m._id}
                className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-2 hover:border-[#7CFF6B]/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#F5F5F0] truncate">
                      {m.fullName}
                    </span>
                    <span className="text-[#666] text-[10px] truncate ml-2">
                      {m.email}
                    </span>
                  </div>
                  <div className="text-[#7CFF6B] text-[11px] font-semibold truncate">
                    {m.subject}
                  </div>
                  <p className="text-[#A1A1A1] text-xs font-sans line-clamp-3 leading-relaxed">
                    {m.message}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-[10px] text-[#666]">
                  {m.createdAt && (
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  )}
                  <Link
                    href="/dashboard/messages"
                    className="text-[#7CFF6B] hover:underline"
                  >
                    Reply in Inbox →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
              No message submissions yet.
            </div>
          )}
        </div>
      </section>

      {/* ─── POPUP MODAL: WEB PROJECT PREVIEW ─── */}
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

                <Link
                  href={`/dashboard/projects/${selectedProject._id}`}
                  className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-mono text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition-colors"
                >
                  Edit Project
                </Link>
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
                    <span>Live Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs hover:border-[#7CFF6B] transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>

              {/* Tech stack */}
              {selectedProject.technologies && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs font-mono text-[#7CFF6B]"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Text Description */}
              <div className="space-y-2 pt-2">
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

      {/* ─── POPUP MODAL: SHOPIFY PROJECT PREVIEW ─── */}
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

      {/* ─── POPUP MODAL: ARTICLE PREVIEW ─── */}
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
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#1E1E1E]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>BLOG ARTICLE</span>
                  {selectedArticle.category && (
                    <span className="text-[#888]">· {selectedArticle.category}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#F5F5F0] font-heading">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Rich text article content */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                  Article Content
                </h4>
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                  <RichContentViewer content={selectedArticle.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
