"use client";

import { Compass, Palette, Code, Gauge, Rocket } from "lucide-react";

const processSteps = [
  {
    num: "01",
    title: "DISCOVER",
    icon: <Compass className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Understand the business requirements, target audience, brand identity, and technical constraints before writing code.",
  },
  {
    num: "02",
    title: "DESIGN",
    icon: <Palette className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Translate product specifications into clear, intuitive user flows, responsive layouts, and modern visual interfaces.",
  },
  {
    num: "03",
    title: "BUILD",
    icon: <Code className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Develop clean, maintainable, and modular code using Shopify Liquid, React, Next.js, and TypeScript best practices.",
  },
  {
    num: "04",
    title: "OPTIMIZE",
    icon: <Gauge className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Rigorously audit site speed, Core Web Vitals, mobile responsiveness, accessibility, and organic SEO metadata.",
  },
  {
    num: "05",
    title: "LAUNCH",
    icon: <Rocket className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Deploy to production, perform cross-browser testing, establish tracking, and provide ongoing technical support.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#A1A1A1]">
            <span className="w-2 h-2 rounded-full bg-[#7CFF6B]"></span>
            <span>METHODOLOGY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            HOW I WORK
          </h2>
          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            A structured, transparent problem-solving workflow engineered to
            convert business objectives into high-performing digital products.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-[#7CFF6B]">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="w-full h-0.5 bg-[#1F1F1F] group-hover:bg-[#7CFF6B]/40 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
