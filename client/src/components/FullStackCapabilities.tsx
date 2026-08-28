"use client";

import { Layout, Server, Database } from "lucide-react";

const fullStackCategories = [
  {
    icon: <Layout className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Frontend Engineering",
    description: "Building responsive, modern, and interactive user interfaces with React and Next.js.",
    techs: [
      "React.js",
      "Next.js 15 (App Router)",
      "TypeScript",
      "JavaScript (ES6+)",
      "Redux Toolkit & RTK Query",
      "Tailwind CSS",
      "HTML5 & Semantic Web",
      "CSS3 & Responsive Layouts"
    ]
  },
  {
    icon: <Server className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Backend Development",
    description: "Designing scalable server-side applications, REST APIs, and authentication mechanisms.",
    techs: [
      "Node.js",
      "Express.js Framework",
      "RESTful API Design",
      "GraphQL APIs",
      "JWT Authentication & Middleware",
      "API Architecture & Validation"
    ]
  },
  {
    icon: <Database className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Database & ORM",
    description: "Modeling data structures and managing reliable database persistence layer.",
    techs: [
      "MongoDB NoSQL Database",
      "Mongoose ODM",
      "PostgreSQL Relational DB",
      "Prisma ORM",
      "Data Indexing & Aggregations"
    ]
  }
];

export default function FullStackCapabilities() {
  return (
    <section id="fullstack" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#A1A1A1]">
            <span className="w-2 h-2 rounded-full bg-[#7CFF6B]"></span>
            <span>SECONDARY SPECIALIZATION</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            BEYOND THE STOREFRONT
          </h2>
          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            In addition to custom Shopify development, I possess robust full-stack development capabilities to build custom web applications, APIs, and dashboard systems.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {fullStackCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#A1A1A1] font-sans leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Technologies List */}
              <div className="pt-4 border-t border-[#1E1E1E]">
                <span className="text-[11px] font-mono text-[#666] uppercase tracking-wider block mb-3">
                  CORE TECHNOLOGIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.techs.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded bg-[#161616] border border-[#262626] text-xs font-mono text-[#D4D4D4] hover:text-[#7CFF6B] hover:border-[#7CFF6B]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
