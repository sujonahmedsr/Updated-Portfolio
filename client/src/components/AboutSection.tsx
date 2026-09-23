"use client";

import { User, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function AboutSection({
  resumeUrl = "/resume.pdf",
  availability = "Open for Freelance & Contract Work",
}: {
  resumeUrl?: string;
  availability?: string;
}) {
  return (
    <section
      id="about"
      className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
              <User className="w-3.5 h-3.5" />
              <span>ABOUT THE DEVELOPER</span>
            </div>

            <h2 className="font-heading text-1.6xl sm:text-2.5xl lg:text-3xl font-bold tracking-tight text-[#F5F5F0] leading-tight">
              Shofiqul Islam Sujon — Building practical, reliable, and
              high-converting Shopify stores.
            </h2>

            <div className="space-y-4 text-base text-[#A1A1A1] font-sans leading-relaxed font-light">
              <p>
                I am{" "}
                <strong className="text-[#F5F5F0] font-medium">
                  Shofiqul Islam Sujon
                </strong>
                , an experienced{" "}
                <strong className="text-[#F5F5F0] font-medium">
                  Shopify Developer
                </strong>
                . My work is centered around understanding business goals first,
                then building custom Liquid solutions that scale seamlessly for
                store owners and deliver smooth shopping journeys for customers.
              </p>

              <p>
                With over 120+ successful projects, I pay close attention to
                every detail of the storefront — responsive behavior, dynamic
                product filtering, checkout optimization, Core Web Vitals
                performance, and clean maintainable code.
              </p>

              <p>
                In addition to Shopify and Liquid engineering, I also build
                modern full-stack web applications using Next.js, React,
                TypeScript, and Node.js, delivering fast, scalable, and modern
                digital products.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs text-[#D4D4D4]">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Clean &amp; Maintainable</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Responsive &amp; User-Focused</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Performance Minded</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-xl bg-[#121212] border border-[#222222] font-mono space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                <span className="text-xs text-[#888]">
                  DEVELOPER_PROFILE.JSON
                </span>
                <span className="text-xs text-[#7CFF6B]">● ACTIVE</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#666] block">NAME</span>
                  <span className="text-[#F5F5F0] font-bold text-sm">
                    Shofiqul Islam Sujon
                  </span>
                </div>

                <div>
                  <span className="text-[#666] block">SPECIALIZATION</span>
                  <span className="text-[#7CFF6B] font-bold">
                    Shopify &amp; E-commerce
                  </span>
                </div>

                <div>
                  <span className="text-[#666] block">APPROACH</span>
                  <span className="text-[#D4D4D4]">
                    Problem-first &bull; Practical &bull; Detail-focused
                  </span>
                </div>

                <div>
                  <span className="text-[#666] block">PRIORITIES</span>
                  <span className="break-words text-[#D4D4D4]">
                    UX • Performance • Reliability • Maintainability
                  </span>
                </div>

                <div>
                  <span className="text-[#666] block">EXPANDING INTO</span>
                  <span className="text-[#F5F5F0]">Full-Stack Development</span>
                </div>

                <div>
                  <span className="text-[#666] block">AVAILABILITY</span>
                  <span className="break-words text-[#7CFF6B]">
                    {availability}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E1E1E]">
                <a
                  href={resumeUrl}
                  download="Shofiqul_Islam_Resume.pdf"
                  className="w-full py-2.5 rounded bg-[#1C1C1C] border border-[#2A2A2A] text-[#F5F5F0] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <span>Download Resume</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
