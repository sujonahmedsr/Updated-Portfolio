"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  Key,
  Copy,
  Check,
  Tag,
  Layers,
  X,
  Save,
  CheckCircle2,
  Calendar,
  Lock,
} from "lucide-react";
import {
  getShopifyProjectsApi,
  createShopifyProjectApi,
  updateShopifyProjectApi,
  deleteShopifyProjectApi,
} from "@/lib/api";
import { ShopifyProject } from "@/types";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import ImageUploader from "@/components/ImageUploader";
import { getRichTextExcerpt } from "@/lib/richText";
import RichContentViewer from "@/components/RichContentViewer";

/* ─── helpers ─── */
const STATUS_COLORS: Record<string, string> = {
  Published: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "In Development": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Completed: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const EMPTY_FORM = {
  title: "",
  clientName: "",
  fullPageScreenshot: "",
  thumbnail: "",
  category: "E-Commerce",
  theme: "Custom Liquid",
  description: "",
  liveUrl: "",
  storePassword: "",
  features: [] as string[],
  status: "Published" as "Published" | "In Development" | "Completed",
  completionDate: "",
};

/* ================================================================== */
export default function ShopifyProjectsPage() {
  const [projects, setProjects] = useState<ShopifyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  /* modals */
  const [selectedProject, setSelectedProject] =
    useState<ShopifyProject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* form modal */
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<ShopifyProject | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedPw, setCopiedPw] = useState<string | null>(null);

  /* ─── fetch ─── */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getShopifyProjectsApi();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load Shopify projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /* ─── filtering ─── */
  const categories = [
    "all",
    ...Array.from(new Set(projects.map((p) => p.category || "E-Commerce"))),
  ];

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      categoryFilter === "all" || (p.category || "E-Commerce") === categoryFilter;
    return matchSearch && matchCat;
  });

  /* ─── copy password ─── */
  const handleCopyPw = (pw: string, id: string) => {
    navigator.clipboard.writeText(pw);
    setCopiedPw(id);
    toast.success("Password copied!");
    setTimeout(() => setCopiedPw(null), 2000);
  };

  /* ─── open form ─── */
  const openAddForm = () => {
    setEditingProject(null);
    setForm({ ...EMPTY_FORM });
    setFeatureInput("");
    setIsFormOpen(true);
  };

  const openEditForm = (p: ShopifyProject) => {
    setEditingProject(p);
    setForm({
      title: p.title,
      clientName: p.clientName || "",
      fullPageScreenshot: p.fullPageScreenshot || "",
      thumbnail: p.thumbnail || "",
      category: p.category || "E-Commerce",
      theme: p.theme || "Custom Liquid",
      description: p.description || "",
      liveUrl: p.liveUrl || "",
      storePassword: p.storePassword || "",
      features: [...(p.features || [])],
      status: (p.status as "Published" | "In Development" | "Completed") || "Published",
      completionDate: p.completionDate || "",
    });
    setFeatureInput("");
    setIsFormOpen(true);
  };

  /* ─── add feature chip ─── */
  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !form.features.includes(val)) {
      setForm((prev) => ({ ...prev, features: [...prev.features, val] }));
    }
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== idx),
    }));
  };

  /* ─── save ─── */
  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Store title is required.");
    if (!form.liveUrl.trim()) return toast.error("Store live URL is required.");

    // Harmonize screenshot & thumbnail
    const finalForm = {
      ...form,
      fullPageScreenshot: form.fullPageScreenshot.trim() || form.thumbnail.trim(),
      thumbnail: form.thumbnail.trim() || form.fullPageScreenshot.trim(),
    };

    setSaving(true);
    try {
      if (editingProject) {
        const updated = await updateShopifyProjectApi(editingProject._id, finalForm);
        if (updated) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProject._id ? { ...p, ...updated } : p))
          );
          toast.success("Shopify project updated!");
        }
      } else {
        const created = await createShopifyProjectApi(finalForm);
        if (created) {
          setProjects((prev) => [created, ...prev]);
          toast.success("Shopify project created!");
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      console.error("Save error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save project.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ─── delete ─── */
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const ok = await deleteShopifyProjectApi(deletingId);
      if (ok) {
        setProjects((prev) => prev.filter((p) => p._id !== deletingId));
        toast.success("Shopify project deleted!");
      } else {
        toast.error("Failed to delete project.");
      }
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  /* ─── skeleton ─── */
  const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl border border-[#1E1E1E] bg-[#121212] p-0 overflow-hidden">
      <div className="h-52 bg-[#1A1A1A]" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-2/3 rounded bg-[#1E1E1E]" />
        <div className="h-3 w-1/2 rounded bg-[#1A1A1A]" />
        <div className="h-3 w-full rounded bg-[#1A1A1A]" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-full bg-[#1E1E1E]" />
          <div className="h-6 w-16 rounded-full bg-[#1E1E1E]" />
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  return (
    <div className="space-y-8 font-sans">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/25 text-[#7CFF6B]">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F0] font-heading">
              Shopify Projects
            </h1>
            <p className="text-xs text-[#777] font-mono">
              {projects.length} store{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#181818] px-3 py-2.5 text-xs text-[#999] transition hover:bg-[#222] hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-4 py-2.5 text-xs font-semibold text-black shadow-lg shadow-[#7CFF6B]/15 transition hover:bg-[#68e057]"
          >
            <Plus size={14} /> Add Store
          </button>
        </div>
      </div>

      {/* ─── Filters Row ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#121212] py-2.5 pl-9 pr-3 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition ${
                categoryFilter === cat
                  ? "border-[#7CFF6B]/40 bg-[#7CFF6B]/10 text-[#7CFF6B]"
                  : "border-[#2A2A2A] text-[#666] hover:text-white hover:border-[#444]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Grid ─── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={48} className="text-[#333] mb-4" />
          <p className="text-sm text-[#777]">No Shopify stores found.</p>
          <button
            onClick={openAddForm}
            className="mt-4 rounded-xl bg-[#7CFF6B] px-4 py-2.5 text-xs font-semibold text-black hover:bg-[#68e057] transition"
          >
            <Plus size={14} className="inline mr-1" /> Add Your First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project._id}
              className="group relative rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#7CFF6B]/40 hover:shadow-xl hover:shadow-[#7CFF6B]/5 flex flex-col justify-between"
            >
              <div>
                {/* Browser Device Top Bar */}
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
                    {project.theme || "Custom"}
                  </span>
                </div>

                {/* Full-Page Interactive Screenshot Preview */}
                <div
                  className="relative h-64 sm:h-72 overflow-hidden bg-[#0A0A0A] cursor-pointer group/screen shopify-screen-container"
                  onClick={() => setSelectedProject(project)}
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
  <div className="absolute top-2.5 left-2.5 pointer-events-none transition-opacity duration-300 group-hover/screen:opacity-0 z-10">
    <span className="inline-flex items-center gap-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-mono text-[#AAA]">
      ↕ Hover to scroll
    </span>
  </div>

  {/* Status Badge */}
  <div className="absolute top-2.5 right-2.5 z-10">
    <span
      className={`rounded-full border px-2 py-0.5 text-[9px] font-mono ${
        STATUS_COLORS[project.status || "Published"] ||
        STATUS_COLORS.Published
      }`}
    >
      {project.status || "Published"}
    </span>
  </div>

  {/* Hover Inspect Bottom Bar (আগে পুরো স্ক্রিন ঢাকতো, এখন শুধু নিচের দিকে হালকা বার থাকবে যাতে স্ক্রল দেখা যায়) */}
  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover/screen:opacity-100 transition-opacity duration-300 flex items-center justify-between px-3.5 z-10 pointer-events-none">
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

                {/* Card body */}
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
                    {project.features && project.features.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-[#7CFF6B]/20 bg-[#7CFF6B]/5 px-2 py-0.5 text-[10px] font-mono text-[#7CFF6B]">
                        {project.features.length} features
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Rows */}
              <div className="px-5 pb-5 pt-0 space-y-2.5">
                {/* Side-by-side Live Link & Store Password */}
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

                {/* Management Toolbar: Details, Edit, Delete */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C] text-xs font-mono">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#888] hover:text-[#7CFF6B] transition"
                  >
                    <Eye size={12} />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditForm(project)}
                      title="Edit project"
                      className="p-1.5 rounded-lg text-[#666] hover:bg-[#1E1E1E] hover:text-white transition"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeletingId(project._id)}
                      title="Delete project"
                      className="p-1.5 rounded-lg text-[#666] hover:bg-rose-500/10 hover:text-rose-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Detail Preview Modal ─── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 bg-black/50 backdrop-blur-sm text-[#777] hover:text-white transition"
            >
              <X size={16} />
            </button>

            {selectedProject.fullPageScreenshot && (
              <div className="rounded-t-2xl border-b border-[#242424] bg-[#0E0E0E] overflow-hidden">
                {/* Browser Top Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161616] border-b border-[#242424] text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#888] bg-[#0A0A0A] px-3 py-1 rounded-md border border-[#222] max-w-sm truncate">
                    <Lock size={10} className="text-[#7CFF6B]" />
                    <span className="truncate">
                      {selectedProject.liveUrl || "store.myshopify.com"}
                    </span>
                  </div>
                  <a
                    href={selectedProject.fullPageScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#7CFF6B] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Full Raw View</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                {/* Scrollable Full-Page Inspector */}
                <div className="relative w-full max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] bg-[#0A0A0A]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProject.fullPageScreenshot}
                    alt={selectedProject.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#F5F5F0] font-heading">
                    {selectedProject.title}
                  </h2>
                  {selectedProject.clientName && (
                    <p className="text-xs text-[#777] font-mono mt-0.5">
                      Client: {selectedProject.clientName}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-mono shrink-0 ${
                    STATUS_COLORS[selectedProject.status || "Published"] ||
                    STATUS_COLORS.Published
                  }`}
                >
                  {selectedProject.status || "Published"}
                </span>
              </div>

              {/* Side-by-side Live Link and Password in Detail Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Live Store Link Box */}
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-[#666] uppercase tracking-wider block mb-1">
                    Live Storefront
                  </span>
                  {selectedProject.liveUrl ? (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#7CFF6B] hover:underline font-medium truncate"
                    >
                      <ExternalLink size={13} className="shrink-0" />
                      <span className="truncate">Visit Store</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[#666]">None specified</span>
                  )}
                </div>

                {/* Storefront Password Box */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col justify-between">
                  <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Lock size={10} /> Store Password
                  </span>
                  {selectedProject.storePassword ? (
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-amber-300 font-bold tracking-wider">
                        {selectedProject.storePassword}
                      </code>
                      <button
                        onClick={() =>
                          handleCopyPw(
                            selectedProject.storePassword!,
                            selectedProject._id
                          )
                        }
                        className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400 transition hover:bg-amber-500/20 active:scale-95"
                      >
                        {copiedPw === selectedProject._id ? (
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
                    <span className="text-xs text-[#666]">No password protection</span>
                  )}
                </div>
              </div>

              {/* Theme, Category, Date */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {selectedProject.category && (
                  <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-3">
                    <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider mb-1">
                      Category
                    </p>
                    <p className="text-[#CCC] font-mono">{selectedProject.category}</p>
                  </div>
                )}
                {selectedProject.theme && (
                  <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-3">
                    <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider mb-1">
                      Theme
                    </p>
                    <p className="text-[#CCC] font-mono">{selectedProject.theme}</p>
                  </div>
                )}
                {selectedProject.completionDate && (
                  <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-3">
                    <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider mb-1">
                      Completed
                    </p>
                    <p className="text-[#CCC] font-mono flex items-center gap-1">
                      <Calendar size={11} /> {selectedProject.completionDate}
                    </p>
                  </div>
                )}
              </div>

              {selectedProject.features && selectedProject.features.length > 0 && (
                <div>
                  <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider mb-2">
                    Features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.features.map((f: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#7CFF6B]/25 bg-[#7CFF6B]/10 px-2.5 py-1 text-[10px] text-[#7CFF6B]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider mb-2">
                  Description
                </p>
                <RichContentViewer content={selectedProject.description || ""} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Form Modal (Add / Edit) ─── */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => !saving && setIsFormOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#0E0E0E] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !saving && setIsFormOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-[#777] hover:text-white transition"
            >
              <X size={16} />
            </button>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7CFF6B]/10 border border-[#7CFF6B]/30 text-[#7CFF6B]">
                  {editingProject ? <Edit2 size={18} /> : <Plus size={18} />}
                </div>
                <h2 className="text-lg font-bold text-[#F5F5F0] font-heading">
                  {editingProject ? "Edit Shopify Project" : "Add New Shopify Store"}
                </h2>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                  Store Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                  placeholder="e.g. Luxury Fashion Boutique"
                />
              </div>

              {/* Client name + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, clientName: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="e.g. E-Commerce"
                  />
                </div>
              </div>

              {/* Theme + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Shopify Theme
                  </label>
                  <input
                    type="text"
                    value={form.theme}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="e.g. Dawn, Custom Liquid"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as
                          | "Published"
                          | "In Development"
                          | "Completed",
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] focus:border-[#7CFF6B] focus:outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Live URL + Store Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Live URL *
                  </label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, liveUrl: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="https://store.myshopify.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                    Store Password
                  </label>
                  <input
                    type="text"
                    value={form.storePassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        storePassword: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="Optional storefront password"
                  />
                </div>
              </div>

              {/* Completion Date */}
              <div>
                <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={form.completionDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      completionDate: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] focus:border-[#7CFF6B] focus:outline-none"
                />
              </div>

              {/* Screenshot upload */}
              <ImageUploader
                value={form.fullPageScreenshot}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, fullPageScreenshot: url }))
                }
                folder="shopify-projects"
                label="FULL PAGE SCREENSHOT *"
              />

              {/* Description */}
              <div>
                <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                  Description *
                </label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none resize-none"
                  placeholder="Describe the Shopify store project..."
                />
              </div>

              {/* Features */}
              <div>
                <label className="text-[10px] text-[#666] font-mono uppercase tracking-wider">
                  Custom Features
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#121212] px-3 py-2.5 text-xs text-[#F5F5F0] placeholder:text-[#555] focus:border-[#7CFF6B] focus:outline-none"
                    placeholder="e.g. Custom Mega Menu"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-xl border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-3 py-2.5 text-xs text-[#7CFF6B] transition hover:bg-[#7CFF6B]/20"
                  >
                    Add
                  </button>
                </div>
                {form.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.features.map((f: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-[#7CFF6B]/20 bg-[#7CFF6B]/5 px-2.5 py-1 text-[10px] text-[#7CFF6B]"
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="hover:text-rose-400 transition"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1E1E1E]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-[#2A2A2A] bg-[#181818] px-4 py-2.5 text-xs text-[#A1A1A1] transition hover:bg-[#222] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7CFF6B] px-5 py-2.5 text-xs font-semibold text-black shadow-lg shadow-[#7CFF6B]/15 transition hover:bg-[#68e057] active:scale-[0.98] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />{" "}
                      {editingProject ? "Update Project" : "Create Project"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirm Modal ─── */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Shopify Project"
        message="This will permanently remove the Shopify project record. This action cannot be undone."
        itemName={
          projects.find((p) => p._id === deletingId)?.title || "this project"
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
