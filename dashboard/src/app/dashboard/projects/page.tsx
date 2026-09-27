"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
  Github,
  RefreshCw,
  Eye,
  LayoutGrid,
  List as ListIcon,
  X,
  Calendar,
  Layers,
  Code2,
} from "lucide-react";
import { getProjectsApi, deleteProjectApi } from "@/lib/api";
import { Project } from "@/types";
import { toast } from "sonner";
import { getRichTextExcerpt } from "@/lib/richText";
import RichContentViewer from "@/components/RichContentViewer";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjectsApi();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting project...");
    const ok = await deleteProjectApi(id);
    if (ok) {
      toast.success("Project deleted successfully.", { id: toastId });
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (selectedProject?._id === id) {
        setSelectedProject(null);
      }
    } else {
      toast.error("Failed to delete project.", { id: toastId });
    }
    setDeletingId(null);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.technologies &&
        p.technologies.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>PORTFOLIO CONTENT</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
            Projects Management
          </h1>
          <p className="text-xs text-[#888] font-mono mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
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
            onClick={fetchProjects}
            className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2 shadow-lg shadow-[#7CFF6B]/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search projects by title or technology..."
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
                  <div className="h-3 w-2/3 rounded bg-[#1A1A1A]" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 rounded bg-[#1E1E1E]" />
                    <div className="h-6 w-16 rounded bg-[#1E1E1E]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2 bg-[#121212] border border-[#222222] rounded-xl font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-[#7CFF6B]" />
            <span>Loading projects...</span>
          </div>
        )
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-[#222222] bg-[#121212] p-12 text-center space-y-4">
          <FolderKanban className="w-12 h-12 text-[#333] mx-auto" />
          <p className="text-[#888] text-sm">
            {searchTerm
              ? `No projects matching "${searchTerm}"`
              : "No projects created yet."}
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* ─── CARD GRID VIEW ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p._id}
              className="group relative rounded-2xl border border-[#1E1E1E] bg-[#121212] overflow-hidden transition-all duration-300 hover:border-[#7CFF6B]/40 hover:shadow-xl hover:shadow-[#7CFF6B]/5 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail image */}
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
                    <div className="flex h-full w-full items-center justify-center bg-[#151515] text-[#333]">
                      <FolderKanban className="w-12 h-12 text-[#2A2A2A]" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

                  {/* Quick Preview Badge */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[11px] text-white flex items-center gap-1.5 border border-[#333]">
                      <Eye size={12} className="text-[#7CFF6B]" /> Click to view details
                    </span>
                  </div>

                  {p.category && (
                    <div className="absolute top-3 right-3">
                      <span className="rounded-md bg-black/70 backdrop-blur-md border border-[#333] px-2 py-0.5 text-[10px] font-mono text-[#AAA]">
                        {p.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div
                    onClick={() => setSelectedProject(p)}
                    className="cursor-pointer group/title"
                  >
                    <h3 className="font-heading text-lg font-bold text-[#F5F5F0] group-hover/title:text-[#7CFF6B] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#888] font-sans line-clamp-2 mt-1 leading-relaxed">
                      {getRichTextExcerpt(p.description, 130) || "No description."}
                    </p>
                  </div>

                  {/* Tech stack tags */}
                  {p.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.split(",").slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] font-mono text-[#7CFF6B]"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {p.technologies.split(",").length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-[10px] font-mono text-[#666]">
                          +{p.technologies.split(",").length - 4}
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
                    onClick={() => setSelectedProject(p)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1E1E1E] border border-[#2E2E2E] text-[11px] font-mono text-[#CCC] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>

                  {p.liveLink && (
                    <a
                      href={p.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition-colors"
                      title="Open Live Preview"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {p.githubLink && (
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#888] hover:text-[#F5F5F0] hover:bg-white/5 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github size={14} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/dashboard/projects/${p._id}`}
                    className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={13} />
                  </Link>
                  <button
                    onClick={() => setDeletingId(p._id)}
                    className="p-1.5 rounded-lg text-[#888] hover:text-[#FF5F56] hover:bg-[#FF5F56]/10 transition-colors"
                    title="Delete project"
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
                  <th className="py-3.5 px-4 font-semibold">Project Name</th>
                  <th className="py-3.5 px-4 font-semibold">Technologies</th>
                  <th className="py-3.5 px-4 font-semibold">Links</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredProjects.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-[#161616]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedProject(p)}
                  >
                    <td className="py-4 px-4 font-medium text-[#F5F5F0]">
                      <div className="font-bold text-sm text-[#F5F5F0] hover:text-[#7CFF6B] transition-colors">
                        {p.title}
                      </div>
                      <p className="text-[11px] text-[#777] font-sans line-clamp-1 mt-0.5">
                        {getRichTextExcerpt(p.description, 140)}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-[#A1A1A1]">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.technologies ? (
                          p.technologies.split(",").map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] text-[10px] text-[#7CFF6B]"
                            >
                              {tech.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#555]">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#A1A1A1]" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        {p.liveLink && (
                          <a
                            href={p.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#7CFF6B] hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {p.githubLink && (
                          <a
                            href={p.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#888] hover:text-[#F5F5F0] flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/projects/${p._id}`}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeletingId(p._id)}
                          className="p-2 rounded bg-[#1A1A1A] border border-[#262626] text-[#A1A1A1] hover:text-[#FF5F56] hover:border-[#FF5F56]/40 transition-colors"
                          title="Delete project"
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

      {/* ─── DETAIL PREVIEW POPUP MODAL (RICHTEXT DESCRIPTION) ─── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#262626] bg-[#0E0E0E] shadow-2xl font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 bg-black/60 backdrop-blur-md text-[#888] hover:text-white transition-colors border border-[#333]"
            >
              <X size={16} />
            </button>

            {/* Project Image Banner */}
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
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1E1E1E]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B]">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>PROJECT DETAILS</span>
                    {selectedProject.category && (
                      <span className="text-[#888]">· {selectedProject.category}</span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F0] font-heading">
                    {selectedProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${selectedProject._id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-mono text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </Link>
                </div>
              </div>

              {/* Action Links Bar */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all shadow-lg shadow-[#7CFF6B]/15"
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F0] font-mono text-xs hover:border-[#7CFF6B] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Code</span>
                  </a>
                )}
              </div>

              {/* Tech Stack Chips */}
              {selectedProject.technologies && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#888]">
                    Technologies &amp; Architecture
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-[#141414] border border-[#262626] text-xs font-mono text-[#7CFF6B]"
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
                  Project Description
                </h4>
                <div className="rounded-xl border border-[#1E1E1E] bg-[#121212] p-5 sm:p-6 overflow-hidden">
                  <RichContentViewer
                    content={selectedProject.description}
                    emptyMessage="No description available for this project."
                  />
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#666] pt-3 border-t border-[#1C1C1C]">
                {selectedProject.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Created: {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </span>
                )}
                {selectedProject.updatedAt && (
                  <span>
                    Updated: {new Date(selectedProject.updatedAt).toLocaleDateString()}
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
              Are you sure you want to delete this project? This action cannot be
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
