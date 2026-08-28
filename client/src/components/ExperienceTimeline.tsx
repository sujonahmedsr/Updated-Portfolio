"use client";

import { Briefcase, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>BACKGROUND &amp; TIMELINE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            EXPERIENCE &amp; EDUCATION
          </h2>
          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            Approximately 1.5+ years of practical development experience creating custom Shopify storefronts and modern full-stack web applications.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Development Experience */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3 text-sm font-mono text-[#7CFF6B]">
              <Briefcase className="w-4 h-4" />
              <span className="uppercase tracking-wider font-bold">DEVELOPMENT EXPERIENCE (1.5+ YEARS)</span>
            </div>

            <div className="relative pl-6 border-l border-[#222222] space-y-8">
              
              {/* Experience Item */}
              <div className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#7CFF6B] border-4 border-[#0A0A0A]"></div>

                <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-[#F5F5F0]">
                        SHOPIFY DEVELOPER &amp; FULL-STACK DEVELOPER
                      </h3>
                      <p className="text-xs font-mono text-[#7CFF6B]">Freelance &amp; Client Projects</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#161616] border border-[#262626] text-xs font-mono text-[#A1A1A1]">
                      <Calendar className="w-3.5 h-3.5 text-[#7CFF6B]" />
                      <span>2024 — PRESENT</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                    Delivering end-to-end Shopify theme customization, Liquid section engineering, performance optimization, and custom web applications for client storefronts.
                  </p>

                  <ul className="space-y-2 text-xs font-mono text-[#D4D4D4] pt-2 border-t border-[#1E1E1E]">
                    {[
                      "Built custom Shopify Liquid theme sections and JSON templates.",
                      "Engineered AJAX slide-out cart drawers with free shipping threshold calculation.",
                      "Optimized storefront Core Web Vitals to achieve sub-1.5s page load speeds.",
                      "Configured Shopify Markets, Metafields, multi-currency, and localization.",
                      "Developed full-stack web applications using React, Next.js, Node.js, and MongoDB."
                    ].map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFF6B] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Academic Qualifications */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3 text-sm font-mono text-[#7CFF6B]">
              <GraduationCap className="w-4 h-4" />
              <span className="uppercase tracking-wider font-bold">EDUCATIONAL QUALIFICATION</span>
            </div>

            <div className="space-y-6">
              
              {/* Diploma Card */}
              <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                  <span>DIPLOMA IN COMPUTER TECHNOLOGY</span>
                  <span className="text-[#7CFF6B]">2020 — 2024</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                  Sirajganj Polytechnic Institute
                </h3>
                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  Four-year comprehensive diploma program covering computer systems, hardware, networking, database management, and software development fundamentals.
                </p>
              </div>

              {/* S.S.C Card */}
              <div className="p-6 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                  <span>SECONDARY SCHOOL CERTIFICATE (S.S.C)</span>
                  <span className="text-[#7CFF6B]">2019 — 2020</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
                  Mallika Sanaullah Ansary High School
                </h3>
                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  Completed Secondary School Certificate in Science discipline with focus on Mathematics and Physics.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
