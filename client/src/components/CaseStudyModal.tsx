"use client";

import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Cpu,
  Target,
} from "lucide-react";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";

export type ProjectDetails = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  liveLink?: string;
  githubLink?: string;
  technologies: string[];
  challenge?: string;
  approach?: string;
  whatIBuilt?: string[];
  results?: string[];
};

export default function CaseStudyModal({
  project,
  onClose,
}: {
  project: ProjectDetails | null;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-[#262626] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto font-sans shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-[#161616] px-6 py-4 border-b border-[#222222] flex items-center justify-between z-10">
          <div className="min-w-0 pr-3">
            <span className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider block">
              {project.category}
            </span>
            <h3 className="break-words font-heading text-xl sm:text-2xl font-bold text-[#F5F5F0]">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#222222] text-[#A1A1A1] hover:text-[#F5F5F0] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8 font-sans">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-2">
              PROJECT OVERVIEW
            </h4>
            <div
              className="rich-content text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: sanitizeRichHtml(project.description),
              }}
            />
          </div>

          {/* Key Technologies Tags */}
          <div>
            <h4 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-3">
              TECHNOLOGY STACK
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#7CFF6B]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Case Study Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1F1F1F]">
            {/* Challenge */}
            <div className="p-4 rounded-lg bg-[#161616] border border-[#222222] space-y-2">
              <div className="flex items-center gap-2 text-[#7CFF6B] font-mono text-xs font-semibold">
                <Target className="w-4 h-4" />
                <span>THE CHALLENGE</span>
              </div>
              <p className="text-xs text-[#A1A1A1] leading-relaxed">
                {project.challenge ||
                  "Creating a high-performance storefront solution that balances bespoke visual design with seamless customer user experience."}
              </p>
            </div>

            {/* Approach */}
            <div className="p-4 rounded-lg bg-[#161616] border border-[#222222] space-y-2">
              <div className="flex items-center gap-2 text-[#7CFF6B] font-mono text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>MY APPROACH</span>
              </div>
              <p className="text-xs text-[#A1A1A1] leading-relaxed">
                {project.approach ||
                  "Architected modular code sections, streamlined state handling, and optimized asset delivery for maximum responsiveness."}
              </p>
            </div>
          </div>

          {/* What I Built */}
          <div>
            <h4 className="text-xs font-mono text-[#888] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7CFF6B]" />
              <span>WHAT I BUILT &amp; DELIVERED</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D4D4D4]">
              {(
                project.whatIBuilt || [
                  "Custom liquid theme templates and reusable section blocks.",
                  "AJAX slide-out cart drawer with dynamic product recommendations.",
                  "Responsive mobile-first navigation and filter drawer.",
                  "Comprehensive site speed and Core Web Vitals optimization.",
                ]
              ).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7CFF6B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap gap-3">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded bg-[#7CFF6B] text-black font-semibold hover:bg-[#68e057] transition-all flex items-center gap-2"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded bg-[#1E1E1E] border border-[#2E2E2E] text-[#F5F5F0] hover:border-[#7CFF6B] transition-all flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Repository</span>
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#888] hover:text-[#F5F5F0] transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
