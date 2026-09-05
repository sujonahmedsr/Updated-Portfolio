/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ExternalLink, Github, ArrowLeft, Code2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Project Details — Shofiqul Islam",
  description:
    "Detailed overview, architecture, and live links for this project by Shofiqul Islam.",
};

const ProjectDetailsPage = async ({ params }: { params: any }) => {
  const { id } = await params;

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://shofiqul81severdb.vercel.app/api";

  let project = null;
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      next: { tags: ["projects"] },
    });
    const projectRes = await res.json();
    project = projectRes?.data?.result || projectRes?.data;
  } catch (err) {
    console.error("Failed to fetch project:", err);
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-32 px-4 space-y-4">
          <h1 className="font-heading text-2xl font-bold text-[#FF5F56]">
            Project Not Found
          </h1>
          <p className="text-sm font-mono text-[#888]">
            The requested project could not be found or may have been removed.
          </p>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161616] border border-[#262626] text-[#7CFF6B] font-mono text-xs hover:border-[#7CFF6B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Selected Work</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] selection:bg-[#7CFF6B] selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#888] hover:text-[#7CFF6B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO PORTFOLIO</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="space-y-3 pb-6 border-b border-[#1E1E1E]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <Code2 className="w-3.5 h-3.5" />
            <span>CASE STUDY</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            {project.title}
          </h1>
        </div>

        {/* Featured Image */}
        {project.image && (
          <div className="relative rounded-2xl overflow-hidden border border-[#222222] bg-[#121212] aspect-video">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 py-2">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all shadow-lg shadow-[#7CFF6B]/15"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-[#F5F5F0] font-mono text-xs hover:border-[#7CFF6B] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}
        </div>

        {/* Technologies List */}
        {project.technologies && (
          <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3 font-mono">
            <span className="text-xs text-[#888] uppercase tracking-wider block">
              Technologies &amp; Architecture
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies
                .split(",")
                .map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded bg-[#1A1A1A] border border-[#262626] text-xs text-[#7CFF6B]"
                  >
                    {tech.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="p-6 sm:p-8 rounded-xl bg-[#121212] border border-[#222222] space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#F5F5F0]">
            Project Overview
          </h2>
          <div
            className="max-w-full break-words text-[#A1A1A1] text-sm sm:text-base leading-relaxed font-sans space-y-3 [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
            dangerouslySetInnerHTML={{
              __html: project.description?.replace(/\n/g, "<br/>") || "",
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;
