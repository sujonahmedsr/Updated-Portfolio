"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import CaseStudyModal, { ProjectDetails } from "./CaseStudyModal";
import { getProjects } from "@/actions/revalidateData";

const fallbackProjects: ProjectDetails[] = [
  {
    _id: "revance-shopify",
    title: "RÊVANCE STOREFRONT",
    category: "LUXURY E-COMMERCE / SHOPIFY DEVELOPMENT",
    description:
      "Bespoke Shopify storefront created for a luxury e-commerce brand. Developed custom Liquid sections, interactive cart drawer, dynamic localization, and performance enhancements.",
    technologies: ["Shopify", "Liquid", "JavaScript", "Metafields", "Performance"],
    liveLink: "https://github.com/sujonahmedsr",
    githubLink: "https://github.com/sujonahmedsr",
    challenge:
      "The client required an ultra-clean visual presentation while delivering instant page transitions and multi-currency support for international customers.",
    approach:
      "Engineered modular Shopify Liquid 2.0 sections, dynamic metafield binding, custom AJAX slide-out cart drawer, and image WebP conversion.",
    whatIBuilt: [
      "Custom Shopify Liquid theme sections and JSON templates.",
      "AJAX slide-out cart drawer with free shipping progress threshold.",
      "Metafield-driven product specs and color swatch selectors.",
      "LCP speed optimization reducing initial load to ~1.2s."
    ]
  },
  {
    _id: "luxe-apparel",
    title: "LUXE APPAREL THEME",
    category: "SHOPIFY CUSTOM THEME & UX",
    description:
      "Tailored Shopify theme with dynamic product filtering, custom collection page layouts, responsive checkout funnel, and performance optimization.",
    technologies: ["Shopify", "Liquid", "JavaScript", "Tailwind CSS", "SEO"],
    liveLink: "https://github.com/sujonahmedsr",
    githubLink: "https://github.com/sujonahmedsr",
    challenge:
      "Existing theme had high CLS (layout shift) and clunky mobile filter dropdowns causing drop-offs during collection browsing.",
    approach:
      "Built a seamless mobile filter drawer with instant JavaScript DOM updates and zero page reloads.",
    whatIBuilt: [
      "Instant collection filter drawer without page refresh.",
      "Custom product gallery slider with image zoom.",
      "Zero layout shift implementation for Google Core Web Vitals.",
      "Structured JSON-LD schema integration for enhanced organic SEO."
    ]
  },
  {
    _id: "nexus-fullstack",
    title: "NEXUS WEB PLATFORM",
    category: "FULL-STACK WEB APPLICATION",
    description:
      "Modern full-stack web app built with Next.js 15, TypeScript, Node.js REST API, and MongoDB database for high-concurrency client management.",
    technologies: ["Next.js 15", "TypeScript", "Node.js", "Express", "MongoDB"],
    liveLink: "https://github.com/sujonahmedsr",
    githubLink: "https://github.com/sujonahmedsr",
    challenge:
      "Client needed a real-time data management dashboard with secure user authentication and fast data fetching.",
    approach:
      "Designed RESTful API endpoints in Express with JWT authentication and consumed them via RTK Query caching in Next.js.",
    whatIBuilt: [
      "Full-stack Next.js App Router & Node.js Express API architecture.",
      "JWT-authenticated dashboard and user session management.",
      "MongoDB Mongoose data modeling and aggregation pipeline.",
      "Responsive dark-mode user interface with Sonner toast feedback."
    ]
  }
];

export default function SelectedWork() {
  const [projects, setProjects] = useState<ProjectDetails[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const apiData = await getProjects();
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const mapped: ProjectDetails[] = apiData.map(
            (item: {
              _id?: string;
              title?: string;
              category?: string;
              description?: string;
              image?: string;
              liveLink?: string;
              githubLink?: string;
              technologies?: string | string[];
              challenge?: string;
              approach?: string;
              whatIBuilt?: string[];
            }) => ({
              _id: item._id,
              title: item.title || "UNTITLED PROJECT",
              category: item.category || "FULL-STACK / SHOPIFY DEVELOPMENT",
              description: item.description || "",
              image: item.image,
              liveLink: item.liveLink,
              githubLink: item.githubLink,
              technologies: typeof item.technologies === "string" 
                ? item.technologies.split(",").map((t: string) => t.trim()) 
                : item.technologies || ["Shopify", "React", "Node.js"],
              challenge: item.challenge,
              approach: item.approach,
              whatIBuilt: item.whatIBuilt,
            })
          );
          setProjects(mapped.slice(0, 4));
        }
      } catch (err) {
        console.error("Using static fallback projects", err);
      }
    };

    fetchProjectsData();
  }, []);


  return (
    <section id="work" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#1A1A1A] pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#7CFF6B] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>PORTFOLIO SELECTION</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
              SELECTED WORK
            </h2>
          </div>
          <p className="text-sm text-[#A1A1A1] max-w-md font-sans leading-relaxed">
            A curated selection of Shopify stores and modern web applications built with performance, usability, and clean architecture.
          </p>
        </div>

        {/* Projects Cards Grid */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <div
              key={project._id || index}
              className="group rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/50 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8"
            >
              {/* Left Side: Visual / Code Mockup */}
              <div className="lg:col-span-6 rounded-lg bg-[#181818] border border-[#262626] p-6 flex flex-col justify-between relative overflow-hidden min-h-[260px] group-hover:border-[#333]">
                <div className="flex items-center justify-between text-xs font-mono text-[#666] mb-4">
                  <span>PROJECT 0{index + 1}</span>
                  <span className="text-[#7CFF6B]">{project.category}</span>
                </div>

                <div className="space-y-3 my-auto py-4">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                    {project.title}
                  </h3>
                  <div className="w-12 h-1 bg-[#7CFF6B]/40 rounded group-hover:w-20 transition-all"></div>
                </div>

                <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#888]">
                  <span>FEATURED CASE STUDY</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#7CFF6B]">DETAILS ↗</span>
                </div>
              </div>

              {/* Right Side: Details & Storytelling */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider block mb-2">
                    {project.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F5F0] mb-3">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#A1A1A1] leading-relaxed mb-6 font-sans">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] text-xs font-mono text-[#D4D4D4]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="pt-4 border-t border-[#1E1E1E] flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-5 py-2.5 rounded bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded bg-[#181818] border border-[#262626] text-[#F5F5F0] font-mono text-xs hover:border-[#7CFF6B] transition-all flex items-center gap-2"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal Overlay */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
