"use client";

import {
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Code2,
} from "lucide-react";

export default function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>BACKGROUND &amp; TIMELINE</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            EXPERIENCE &amp; EDUCATION
          </h2>

          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            Professional experience in Shopify and e-commerce development,
            backed by a technical education and an ongoing transition into
            full-stack development.
          </p>
        </div>

        {/* Experience + Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Professional Experience */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-sm font-mono text-[#7CFF6B]">
              <Briefcase className="w-4 h-4" />

              <span className="uppercase tracking-wider font-bold">
                PROFESSIONAL EXPERIENCE
              </span>
            </div>

            <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-5">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#F5F5F0]">
                      SHOPIFY &amp; E-COMMERCE DEVELOPER
                    </h3>

                    <p className="text-xs font-mono text-[#7CFF6B] mt-1">
                      Freelance &amp; Client Projects
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#161616] border border-[#262626] text-xs font-mono text-[#A1A1A1]">
                    <Calendar className="w-3.5 h-3.5 text-[#7CFF6B]" />
                    <span>2024 — PRESENT</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                Hands-on experience building and customizing Shopify stores for
                real client requirements, covering theme development, Liquid,
                custom functionality, integrations, and storefront optimization.
              </p>

              {/* Project Count */}
              <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-[#161616] border border-[#222222]">
                <span className="text-2xl font-bold text-[#7CFF6B] font-mono">
                  120+
                </span>

                <div>
                  <span className="block text-xs font-mono text-[#F5F5F0]">
                    SHOPIFY PROJECTS
                  </span>

                  <span className="block text-[10px] font-mono text-[#666] mt-0.5">
                    Across different e-commerce requirements
                  </span>
                </div>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-2 text-xs font-mono text-[#D4D4D4] pt-4 border-t border-[#1E1E1E]">
                {[
                  "Built and customized Shopify storefronts using Liquid, sections, snippets, and theme templates.",
                  "Developed custom e-commerce functionality based on client and business requirements.",
                  "Worked with products, cart functionality, metafields, localization, markets, and third-party integrations.",
                  "Improved storefront usability, responsiveness, and performance across desktop and mobile.",
                  "Troubleshot Shopify theme, checkout, payment, shipping, and integration-related issues.",
                ].map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFF6B] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-sm font-mono text-[#7CFF6B]">
              <GraduationCap className="w-4 h-4" />

              <span className="uppercase tracking-wider font-bold">
                EDUCATION
              </span>
            </div>

            <div className="space-y-5">
              {/* Diploma */}
              <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#888]">
                  <span className="break-words">
                    DIPLOMA IN COMPUTER TECHNOLOGY
                  </span>

                  <span className="shrink-0 text-[#7CFF6B]">2020 — 2024</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                  Sirajganj Polytechnic Institute
                </h3>

                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  Four-year diploma program in computer technology with
                  foundations in programming, databases, networking, and
                  software development.
                </p>
              </div>

              {/* SSC */}
              <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#888]">
                  <span>SECONDARY SCHOOL CERTIFICATE (S.S.C)</span>

                  <span className="shrink-0 text-[#7CFF6B]">2019 — 2020</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                  Mallika Sanaullah Ansary High School
                </h3>

                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  Completed Secondary School Certificate with a foundation in
                  Science, Mathematics, and Physics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Currently Expanding */}
        <div className="mt-8 lg:mt-10">
          <div className="p-6 sm:p-8 rounded-xl bg-[#121212] border border-[#222222] relative overflow-hidden">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#171717] border border-[#292929]">
                  <Code2 className="w-4 h-4 text-[#7CFF6B]" />
                </div>

                <div>
                  <p className="text-xs font-mono text-[#7CFF6B] uppercase tracking-wider font-bold">
                    CURRENTLY EXPANDING
                  </p>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F5F0]">
                    Full-Stack Development
                  </h3>
                </div>
              </div>

              <span className="w-fit px-3 py-1 rounded bg-[#161616] border border-[#262626] text-[10px] font-mono text-[#888]">
                LEARNING &amp; BUILDING
              </span>
            </div>

            <p className="max-w-3xl text-xs sm:text-sm text-[#A1A1A1] font-sans leading-relaxed mb-6">
              Alongside my professional Shopify work, I&apos;m expanding into
              full-stack development by learning and building applications with
              modern frontend, backend, and database technologies.
            </p>

            {/* Learning Stack */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Tailwind CSS",
                "Node.js",
                "Express",
                "MongoDB",
                "Mongoose",
              ].map((tech) => (
                <div
                  key={tech}
                  className="px-3 py-3 rounded-lg bg-[#161616] border border-[#222222] text-center text-[10px] sm:text-xs font-mono text-[#D4D4D4] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-colors"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
