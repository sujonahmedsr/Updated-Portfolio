"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Eye,
  LayoutGrid,
  List as ListIcon,
  X,
  Calendar,
  Tag,
  BookOpen,
  Globe,
} from "lucide-react";
import { getArticlesApi, deleteArticleApi } from "@/lib/api";
import { Article } from "@/types";
import { toast } from "sonner";
import { getRichTextExcerpt } from "@/lib/richText";
import RichContentViewer from "@/components/RichContentViewer";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticlesApi();
      setArticles(data);
    } catch {
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting article...");
    const ok = await deleteArticleApi(id);
    if (ok) {
      toast.success("Article deleted successfully.", { id: toastId });
      setArticles((prev) => prev.filter((a) => a._id !== id));
      if (selectedArticle?._id === id) {
        setSelectedArticle(null);
      }
    } else {
      toast.error("Failed to delete article.", { id: toastId });
    }
    setDeletingId(null);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description &&
        a.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
            <FileText className="w-4 h-4" />
            <span>BLOG CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
            Articles &amp; Blog Management
          </h1>
          <p className="text-xs text-[#888] font-mono mt-1">
            {articles.length} article{articles.length !== 1 ? "s" : ""} published
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-[#262626] bg-[#121212] p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-[#7CFF6B]/15 text-[#7CFF6B]"
                  : "text-[#888] hover:text-[#F5F5F0]"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-[#7CFF6B]/15 text-[#7CFF6B]"
                  : "text-[#888] hover:text-[#F5F5F0]"
              }`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchArticles}
            className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/articles/new"
            className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2 shadow-lg shadow-[#7CFF6B]/10"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search articles by title, keywords, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-[#222222] text-xs font-mono text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B] transition-colors"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden"
              >
                <div className="h-48 bg-[#1A1A1A]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-[#1E1E1E]" />
                  <div className="h-3 w-full rounded bg-[#1A1A1A]" />
                  <div className="h-3 w-1/2 rounded bg-[#1A1A1A]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2 bg-[#121212] border border-[#222222] rounded-xl font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-[#7CFF6B]" />
            <span>Loading articles...</span>
          </div>
        )
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-[#121212] p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-[#333] mx-auto" />
          <p className="text-[#888] text-sm">
            {searchTerm
              ? `No articles matching "${searchTerm}"`
              : "No articles published yet."}
          </p>
          <Link
            href="/dashboard/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Write First Article</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* ─── CARD GRID VIEW ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((a) => (
            <div
              key={a._id}
              className="group relative rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#7CFF6B]/40 hover:shadow-xl hover:shadow-[#7CFF6B]/5 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div
                  className="relative h-48 w-full bg-[#181818] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedArticle(a)}
                >
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#151515] text-[#333]">
                      <BookOpen className="w-12 h-12 text-[#2A2A2A]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

                  {/* Quick Preview Badge */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[11px] text-white flex items-center gap-1.5 border border-[#333]">
                      <Eye size={12} className="text-[#7CFF6B]" /> Click to read
                    </span>
                  </div>

                  {a.category && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-md bg-black/70 backdrop-blur-md border border-[#333] px-2 py-0.5 text-[10px] font-mono text-[#7CFF6B]">
                        {a.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div
                    onClick={() => setSelectedArticle(a)}
                    className="cursor-pointer group/title"
                  >
                    <h3 className="font-heading text-lg font-bold text-[#F5F5F0] group-hover/title:text-[#7CFF6B] transition-colors line-clamp-1">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[#888] font-sans line-clamp-2 mt-1 leading-relaxed">
                      {getRichTextExcerpt(a.description, 130) || "No excerpt."}
                    </p>
                  </div>

                  {/* Tags */}
                  {a.tags && a.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {a.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] font-mono text-[#AAA]"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                      {a.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] font-mono text-[#666]">
                          +{a.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="px-5 py-3.5 border-t border-[#1C1C1C] bg-[#141414]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedArticle(a)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1E1E1E] border border-[#2E2E2E] text-[11px] font-mono text-[#CCC] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={12} />
                    <span>Read</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7CFF6B]/10 border border-[#7CFF6B]/25 text-[10px] font-mono text-[#7CFF6B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
                    <span>{a.status || "Published"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/articles/${a._id}`}
                    className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                    title="Edit article"
                  >
                    <Edit2 size={13} />
                  </Link>
                  <button
                    onClick={() => setDeletingId(a._id)}
                    className="p-1.5 rounded-lg text-[#888] hover:text-[#FF5F56] hover:bg-[#FF5F56]/10 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── TABLE VIEW ─── */
        <div className="rounded-xl bg-[#121212] border border-[#222222] overflow-hidden shadow-2xl font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#222222] text-[#888] text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Article Title</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredArticles.map((a) => (
                  <tr
                    key={a._id}
                    className="hover:bg-[#161616]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedArticle(a)}
                  >
                    <td className="py-4 px-4 font-medium text-[#F5F5F0]">
                      <div className="font-bold text-sm text-[#F5F5F0] hover:text-[#7CFF6B] transition-colors">
                        {a.title}
                      </div>
                      <p className="text-[11px] text-[#777] font-sans line-clamp-1 mt-0.5">
                        {getRichTextExcerpt(a.description, 140)}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-[10px] text-[#7CFF6B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
                        <span>{a.status || "Published"}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedArticle(a)}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
                          title="Read Article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/articles/${a._id}`}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
                          title="Edit article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeletingId(a._id)}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#FF5F56] hover:border-[#FF5F56]/40 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── DETAIL PREVIEW POPUP MODAL (RICHTEXT CONTENT) ─── */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0E0E0E] shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-black/60 backdrop-blur-md text-[#888] hover:text-white transition-colors border border-[#333]"
            >
              <X size={16} />
            </button>

            {/* Article Image Banner */}
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
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>BLOG ARTICLE</span>
                    {selectedArticle.category && (
                      <span className="text-[#888]">· {selectedArticle.category}</span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-heading">
                    {selectedArticle.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/articles/${selectedArticle._id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-mono text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 size={13} />
                    <span>Edit Article</span>
                  </Link>
                </div>
              </div>

              {/* Tags & Meta Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-[10px] font-mono text-[#7CFF6B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
                  <span>{selectedArticle.status || "Published"}</span>
                </span>
                {selectedArticle.category && (
                  <span className="px-2.5 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-[10px] font-mono text-[#DDD]">
                    Category: {selectedArticle.category}
                  </span>
                )}
                {selectedArticle.slug && (
                  <span className="px-2.5 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-[10px] font-mono text-[#888] flex items-center gap-1">
                    <Globe size={11} /> /{selectedArticle.slug}
                  </span>
                )}
              </div>

              {/* Tags chips */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticle.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs font-mono text-[#A1A1A1] flex items-center gap-1"
                    >
                      <Tag size={10} className="text-[#7CFF6B]" />
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Rich Text Article Content */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                  Article Content
                </h4>
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                  <RichContentViewer
                    content={selectedArticle.description}
                    emptyMessage="No article content provided."
                  />
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#666] pt-3 border-t border-[#1C1C1C]">
                {selectedArticle.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Published: {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </span>
                )}
                {selectedArticle.updatedAt && (
                  <span>
                    Updated: {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-md w-full p-6 space-y-4 font-sans shadow-2xl">
            <div className="flex items-center gap-3 text-[#FF5F56]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Confirm Delete
              </h3>
            </div>
            <p className="text-xs text-[#A1A1A1] leading-relaxed font-sans">
              Are you sure you want to delete this article? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-[#FF5F56] text-black font-semibold hover:bg-[#e0524a] transition-colors"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
