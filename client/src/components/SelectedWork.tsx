"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import CaseStudyModal, { ProjectDetails } from "./CaseStudyModal";
import { getProjects } from "@/actions/revalidateData";

// Skeleton Component for Project Card
function ProjectSkeleton() {
  return (
    <div className="rounded-xl bg-[#121212] border border-[#222222] p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-pulse">
      {/* Left Skeleton: Image Wrapper */}
      <div className="lg:col-span-6 rounded-lg bg-[#1A1A1A] aspect-video w-full" />
      
      {/* Right Skeleton: Details */}
      <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="h-3 bg-[#1A1A1A] rounded w-1/3" />
          <div className="h-7 bg-[#1A1A1A] rounded w-3/4" />
          <div className="space-y-2 pt-2">
            <div className="h-3.5 bg-[#1A1A1A] rounded w-full" />
            <div className="h-3.5 bg-[#1A1A1A] rounded w-5/6" />
            <div className="h-3.5 bg-[#1A1A1A] rounded w-2/3" />
          </div>
          <div className="flex gap-2 pt-3">
            <div className="h-6 w-16 bg-[#1A1A1A] rounded" />
            <div className="h-6 w-20 bg-[#1A1A1A] rounded" />
            <div className="h-6 w-14 bg-[#1A1A1A] rounded" />
          </div>
        </div>
        <div className="pt-4 border-t border-[#1E1E1E] flex gap-4">
          <div className="h-9 w-32 bg-[#1A1A1A] rounded" />
          <div className="h-9 w-28 bg-[#1A1A1A] rounded" />
        </div>
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setLoading(true);
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
        console.error("Error loading projects data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  return (
    <section id="work" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6 border-b border-[#1A1A1A] pb-8">
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

        {/* Projects Cards Container with Sticky Overlay Effect */}
        <div className="relative space-y-8 sm:space-y-12">
          {loading ? (
            /* Loading Skeleton */
            <>
              <ProjectSkeleton />
            </>
          ) : projects.length === 0 ? (
            /* No projects found state */
            <div className="text-center py-12 text-[#888] font-mono text-sm border border-[#222] rounded-xl bg-[#121212]">
              No projects found.
            </div>
          ) : (
            /* Real Data Mapping with Sticky Logic */
            projects.map((project, index) => (
              <div
                key={project._id || index}
                style={{
                  top: `calc(5rem + ${index * 20}px)`,
                  zIndex: index + 10,
                }}
                className="sticky group rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/50 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-8 shadow-2xl"
              >
                {/* Left Side: Project Image Container */}
                <div 
                  onClick={() => setSelectedProject(project)}
                  className="lg:col-span-6 rounded-lg bg-[#181818] border border-[#262626] relative overflow-hidden group-hover:border-[#333] cursor-pointer flex flex-col justify-between"
                >
                  {project?.image ? (
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay (only on desktop/sm+) */}
                      <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
                      
                      {/* Top Badge Over Image (only on sm+) */}
                      <div className="hidden sm:flex absolute top-4 left-4 right-4 items-center justify-between text-xs font-mono z-10 pointer-events-none">
                        <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[#666] border border-white/10">
                          PROJECT 0{index + 1}
                        </span>
                        <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[#7CFF6B] border border-white/10">
                          {project.category}
                        </span>
                      </div>

                      {/* Bottom Badge Over Image (only on sm+) */}
                      <div className="hidden sm:flex absolute bottom-4 left-4 right-4 items-center justify-between text-xs font-mono text-[#888] z-10 pointer-events-none">
                        <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[#D4D4D4]">
                          FEATURED CASE STUDY
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform text-[#7CFF6B] bg-black/70 backdrop-blur-md px-2 py-1 rounded">
                          DETAILS ↗
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Fallback display if project.image is missing */
                    <div className="p-6 flex flex-col justify-between h-full min-h-[200px]">
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
                  )}
                </div>

                {/* Right Side: Details & Storytelling */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Project Number & Category for Mobile View */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                      <span className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-[#666] sm:hidden">
                        #0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F5F0] mb-3">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#A1A1A1] leading-relaxed mb-6 font-sans line-clamp-2 sm:line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technology Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 max-h-[4.5rem] overflow-hidden line-clamp-2">
  {project.technologies.map((tech, idx) => (
    <span
      key={idx}
      className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] text-xs font-mono text-[#D4D4D4] inline-block"
    >
      {tech}
    </span>
  ))}
</div>
                  </div>

                  {/* Card CTA Actions */}
                  <div className="pt-4 border-t border-[#1E1E1E] flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 sm:flex-initial justify-center px-5 py-2.5 rounded bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-2"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial justify-center px-5 py-2.5 rounded bg-[#181818] border border-[#262626] text-[#F5F5F0] font-mono text-xs hover:border-[#7CFF6B] transition-all flex items-center gap-2"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
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