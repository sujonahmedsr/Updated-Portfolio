"use client";

import { Compass, Palette, Code, Gauge, Rocket } from "lucide-react";

const processSteps = [
  {
    num: "01",
    title: "DISCOVER",
    icon: <Compass className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Understand the requirements, business goals, target users, existing setup, and technical constraints before development begins.",
  },
  {
    num: "02",
    title: "PLAN",
    icon: <Palette className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Define the structure, user experience, functionality, and technical approach needed to solve the problem clearly.",
  },
  {
    num: "03",
    title: "BUILD",
    icon: <Code className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Turn the plan into clean, responsive, and maintainable code with a focus on usability, reliability, and scalability.",
  },
  {
    num: "04",
    title: "TEST & REFINE",
    icon: <Gauge className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Test functionality, responsiveness, usability, performance, and cross-device behavior, then refine where needed.",
  },
  {
    num: "05",
    title: "DELIVER",
    icon: <Rocket className="w-5 h-5 text-[#7CFF6B]" />,
    description:
      "Prepare the final solution for launch, verify the implementation, and provide support for necessary post-launch improvements.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#A1A1A1]">
            <span className="w-2 h-2 rounded-full bg-[#7CFF6B]" />
            <span>METHODOLOGY</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            HOW I WORK
          </h2>

          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            A simple, structured workflow focused on understanding the problem,
            building the right solution, and delivering reliable results.
          </p>
        </div>

        {/* 5-Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Number + Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-[#7CFF6B]">
                    {step.num}
                  </span>

                  <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom Accent */}
              <div className="w-full h-0.5 bg-[#1F1F1F] group-hover:bg-[#7CFF6B]/40 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
