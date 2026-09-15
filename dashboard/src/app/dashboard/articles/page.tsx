"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { getArticlesApi, deleteArticleApi } from "@/lib/api";
import { Article } from "@/types";
import { toast } from "sonner";
import { getRichTextExcerpt } from "@/lib/richText";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticlesApi();
      setArticles(data);
    } catch (e) {
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
    } else {
      toast.error("Failed to delete article.", { id: toastId });
    }
    setDeletingId(null);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description &&
        a.description.toLowerCase().includes(searchTerm.toLowerCase())),
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
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B]"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/articles/new"
            className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search articles by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#121212] border border-[#222222] text-xs font-mono text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B]"
          />
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-xl bg-[#121212] border border-[#222222] overflow-hidden shadow-2xl font-mono text-xs">
        {loading ? (
          <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#7CFF6B]" />
            <span>Loading articles...</span>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#222222] text-[#888] text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Article Title</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredArticles.map((a) => (
                  <tr
                    key={a._id}
                    className="hover:bg-[#161616]/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-[#F5F5F0]">
                      <div className="font-bold text-sm text-[#F5F5F0]">
                        {a.title}
                      </div>
                      <p className="text-[11px] text-[#777] font-sans line-clamp-1 mt-0.5">
                        {getRichTextExcerpt(a.description, 140)}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-[10px] text-[#7CFF6B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B]"></span>
                        <span>Published</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
        ) : (
          <div className="p-12 text-center space-y-3 font-sans">
            <p className="text-[#888] text-sm">No articles published yet.</p>
            <Link
              href="/dashboard/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#7CFF6B] text-black font-mono font-semibold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Write First Article</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121212] border border-[#262626] rounded-xl max-w-md w-full p-6 space-y-4 font-sans">
            <div className="flex items-center gap-3 text-[#FF5F56]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                Confirm Delete
              </h3>
            </div>
            <p className="text-xs text-[#A1A1A1] leading-relaxed font-sans">
              Are you sure you want to delete this article? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#A1A1A1]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded bg-[#FF5F56] text-black font-semibold hover:bg-[#e0524a]"
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
