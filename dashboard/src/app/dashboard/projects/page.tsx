"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { getProjectsApi, deleteProjectApi } from "@/lib/api";
import { Project } from "@/types";
import { toast } from "sonner";
import { getRichTextExcerpt } from "@/lib/richText";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjectsApi();
      setProjects(data);
    } catch (e) {
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
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B]"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects by title or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#121212] border border-[#222222] text-xs font-mono text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B]"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl bg-[#121212] border border-[#222222] overflow-hidden shadow-2xl font-mono text-xs">
        {loading ? (
          <div className="p-12 text-center text-[#666] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#7CFF6B]" />
            <span>Loading projects from server...</span>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161616] border-b border-[#222222] text-[#888] text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Project Name</th>
                  <th className="py-3.5 px-4 font-semibold">Technologies</th>
                  <th className="py-3.5 px-4 font-semibold">Links</th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredProjects.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-[#161616]/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-[#F5F5F0]">
                      <div className="font-bold text-sm text-[#F5F5F0]">
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

                    <td className="py-4 px-4 text-[#A1A1A1]">
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

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
        ) : (
          <div className="p-12 text-center space-y-3 font-sans">
            <p className="text-[#888] text-sm">No projects found.</p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#7CFF6B] text-black font-mono font-semibold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Project</span>
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
              Are you sure you want to delete this project? This action cannot
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
