"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Mail,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Activity,
  ExternalLink,
} from "lucide-react";
import { getProjectsApi, getArticlesApi, getMessagesApi } from "@/lib/api";
import { Project, Article, Message } from "@/types";

export default function DashboardOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

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
      const [projData, artData, msgData] = await Promise.all([
        getProjectsApi(),
        getArticlesApi(),
        getMessagesApi(),
      ]);
      setProjects(projData);
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

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E1E]">
        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-[#F5F5F0]">
            {greeting}, Shofiqul.
          </h1>
          <p className="text-sm text-[#A1A1A1] mt-1 font-sans">
            Here&apos;s a quick overview of your portfolio content, projects,
            and incoming client messages.
          </p>
          <span className="inline-flex items-center gap-2 mt-3 text-[11px] text-[#7CFF6B] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse" />
            Local time {formattedTime}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#A1A1A1] hover:text-[#7CFF6B] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/projects/new"
            className="px-4 py-2.5 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        {/* Total Projects */}
        <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888]">TOTAL PROJECTS</span>
            <FolderKanban className="w-5 h-5 text-[#7CFF6B]" />
          </div>
          <div className="text-3xl font-bold text-[#F5F5F0]">
            {loading ? "..." : projects.length}
          </div>
          <div className="text-[11px] text-[#666] flex items-center gap-1">
            <span className="text-[#7CFF6B]">● Active</span> on public portfolio
          </div>
        </div>

        {/* Total Articles */}
        <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888]">ARTICLES / BLOGS</span>
            <FileText className="w-5 h-5 text-[#7CFF6B]" />
          </div>
          <div className="text-3xl font-bold text-[#F5F5F0]">
            {loading ? "..." : articles.length}
          </div>
          <div className="text-[11px] text-[#666] flex items-center gap-1">
            <span className="text-[#7CFF6B]">● Published</span> posts
          </div>
        </div>

        {/* Total Messages */}
        <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888]">MESSAGES RECEIVED</span>
            <Mail className="w-5 h-5 text-[#7CFF6B]" />
          </div>
          <div className="text-3xl font-bold text-[#F5F5F0]">
            {loading ? "..." : messages.length}
          </div>
          <div className="text-[11px] text-[#666] flex items-center gap-1">
            <span className="text-[#7CFF6B]">● Submissions</span> from contact
            form
          </div>
        </div>

        {/* System API Status */}
        <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#888]">SYSTEM HEALTH</span>
            <Activity className="w-5 h-5 text-[#7CFF6B]" />
          </div>
          <div className="text-xl font-bold text-[#7CFF6B] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
            <span>ONLINE</span>
          </div>
          <div className="text-[11px] text-[#666]">
            Server API &amp; DB operational
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Projects & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Projects */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
              Recent Projects
            </h3>
            <Link
              href="/dashboard/projects"
              className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {loading ? (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                Loading projects data...
              </div>
            ) : projects.length > 0 ? (
              projects.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-lg bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/30 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#F5F5F0] text-sm">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-[#888] text-[11px] font-sans line-clamp-1">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#666]">
                      <span>{p.technologies}</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/projects/${p._id}`}
                    className="px-3 py-1.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#7CFF6B] hover:bg-[#7CFF6B]/10 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                No projects found. Add your first project.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Messages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
            <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
              Recent Submissions
            </h3>
            <Link
              href="/dashboard/messages"
              className="text-xs font-mono text-[#7CFF6B] hover:underline flex items-center gap-1"
            >
              <span>Inbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {loading ? (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                Loading messages...
              </div>
            ) : messages.length > 0 ? (
              messages.slice(0, 4).map((m) => (
                <div
                  key={m._id}
                  className="p-4 rounded-lg bg-[#121212] border border-[#222222] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#F5F5F0]">
                      {m.fullName}
                    </span>
                    <span className="text-[#666]">{m.email}</span>
                  </div>
                  <div className="text-[#7CFF6B] text-[11px] font-semibold">
                    {m.subject}
                  </div>
                  <p className="text-[#A1A1A1] text-xs font-sans line-clamp-2">
                    {m.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#666] bg-[#121212] rounded-xl border border-[#222]">
                No message submissions yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
