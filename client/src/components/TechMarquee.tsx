"use client";

const techItems = [
  "SHOPIFY",
  "LIQUID",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "REACT.JS",
  "NEXT.JS",
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "POSTGRESQL",
  "REST APIs",
  "GRAPHQL",
  "TAILWIND CSS",
  "REDEX TOOLKIT",
  "METAFIELDS",
];

export default function TechMarquee() {
  return (
    <section className="py-6 bg-[#0E0E0E] border-y border-[#1F1F1F] overflow-hidden select-none">
      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-xs font-mono font-bold tracking-widest text-[#777]">
          {techItems.concat(techItems).map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-12 hover:text-[#7CFF6B] transition-colors"
            >
              <span>{tech}</span>
              <span className="text-[#7CFF6B] font-normal">●</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
