"use client";

import { User, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
              <User className="w-3.5 h-3.5" />
              <span>ABOUT THE DEVELOPER</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F0] leading-tight">
              A developer who enjoys turning complex requirements into simple digital experiences.
            </h2>

            <div className="space-y-4 text-base text-[#A1A1A1] font-sans leading-relaxed font-light">
              <p>
                My primary focus is <strong className="text-[#F5F5F0] font-semibold">Shopify Development</strong>, where I craft custom Liquid storefronts, reusable theme section architecture, and speed-optimized e-commerce experiences.
              </p>
              <p>
                Alongside my Shopify specialization, I possess solid <strong className="text-[#F5F5F0] font-semibold">Full-Stack Development</strong> skills using React, Next.js, Node.js, and database systems to construct modern web applications.
              </p>
              <p>
                I prioritize clean architecture, responsive layout precision, Core Web Vitals performance, and clear developer-to-client communication.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs text-[#D4D4D4]">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Performance-First Approach</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Clean &amp; Reusable Code</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#222222]">
                <CheckCircle2 className="w-4 h-4 text-[#7CFF6B]" />
                <span>Client &amp; UX Mindset</span>
              </div>
            </div>

          </div>

          {/* Right Column: Digital Metadata Card */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-xl bg-[#121212] border border-[#222222] font-mono space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                <span className="text-xs text-[#888]">DEVELOPER_IDENTITY.JSON</span>
                <span className="text-xs text-[#7CFF6B]">● ACTIVE</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#666] block">FULL NAME</span>
                  <span className="text-[#F5F5F0] font-bold text-sm">Shofiqul Islam Sujon</span>
                </div>
                <div>
                  <span className="text-[#666] block">PRIMARY ROLE</span>
                  <span className="text-[#7CFF6B] font-bold">Shopify Developer</span>
                </div>
                <div>
                  <span className="text-[#666] block">SECONDARY ROLE</span>
                  <span className="text-[#F5F5F0]">Full-Stack Developer</span>
                </div>
                <div>
                  <span className="text-[#666] block">EXPERIENCE</span>
                  <span className="text-[#F5F5F0]">~1.5+ Years</span>
                </div>
                <div>
                  <span className="text-[#666] block">CORE ENGINE</span>
                  <span className="text-[#D4D4D4]">Shopify Liquid • Next.js • React • Node.js</span>
                </div>
                <div>
                  <span className="text-[#666] block">AVAILABILITY</span>
                  <span className="text-[#7CFF6B]">Open for Freelance &amp; Contract Work</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E1E1E]">
                <a
                  href="/resume.pdf"
                  download="Shofiqul_Islam_Resume.pdf"
                  className="w-full py-2.5 rounded bg-[#1C1C1C] border border-[#2A2A2A] text-[#F5F5F0] hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <span>Download Resume (PDF)</span>
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
