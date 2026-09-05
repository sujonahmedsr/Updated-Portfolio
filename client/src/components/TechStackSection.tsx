"use client";

import {
  Cpu,
  ShoppingBag,
  Layout,
  Server,
  Database,
  Wrench,
} from "lucide-react";

const techCategories = [
  {
    category: "SHOPIFY & E-COMMERCE",
    icon: <ShoppingBag className="w-5 h-5 text-[#7CFF6B]" />,
    skills: [
      "Shopify",
      "Liquid",
      "Online Store 2.0",
      "Theme Development",
      "Metafields",
      "Metaobjects",
      "Shopify APIs",
      "Shopify Markets",
    ],
  },
  {
    category: "FRONTEND",
    icon: <Layout className="w-5 h-5 text-[#7CFF6B]" />,
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Redux Toolkit",
    ],
  },
  {
    category: "BACKEND",
    icon: <Server className="w-5 h-5 text-[#7CFF6B]" />,
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "Authentication",
      "API Integration",
    ],
  },
  {
    category: "DATABASE",
    icon: <Database className="w-5 h-5 text-[#7CFF6B]" />,
    skills: ["MongoDB", "Mongoose", "PostgreSQL", "Prisma"],
  },
  {
    category: "TOOLS & WORKFLOW",
    icon: <Wrench className="w-5 h-5 text-[#7CFF6B]" />,
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "Shopify CLI",
      "Postman",
      "Vercel",
      "npm",
      "pnpm",
    ],
  },
];

export default function TechStackSection() {
  return (
    <section
      id="stack"
      className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL SPECIFICATIONS</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            TECHNOLOGY STACK
          </h2>

          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            A Shopify-focused technology stack supported by modern frontend,
            backend, database, and development tools.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {techCategories.map((cat) => (
            <div
              key={cat.category}
              className="p-6 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 space-y-4 group"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#1E1E1E]">
                <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                  {cat.icon}
                </div>

                <h3 className="font-mono text-xs font-bold text-[#F5F5F0] tracking-wider uppercase group-hover:text-[#7CFF6B] transition-colors">
                  {cat.category}
                </h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded bg-[#161616] border border-[#262626] text-xs font-mono text-[#D4D4D4] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/40 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
