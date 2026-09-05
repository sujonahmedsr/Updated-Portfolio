"use client";

import {
  ShoppingBag,
  Code,
  Gauge,
  Globe,
  Layers3,
  SlidersHorizontal,
} from "lucide-react";

const shopifyCapabilities = [
  {
    icon: <Code className="w-6 h-6 text-[#7CFF6B]" />,
    number: "01",
    title: "Custom Shopify Development",
    description:
      "Custom themes, sections, templates, and storefront experiences built around real business requirements.",
  },
  {
    icon: <Layers3 className="w-6 h-6 text-[#7CFF6B]" />,
    number: "02",
    title: "Theme Customization",
    description:
      "Advanced Liquid, HTML, CSS, and JavaScript customization while keeping the store clean and maintainable.",
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-[#7CFF6B]" />,
    number: "03",
    title: "Product Experience",
    description:
      "Product pages, variants, size guides, tabs, upsells, and conversion-focused shopping experiences.",
  },
  {
    icon: <Globe className="w-6 h-6 text-[#7CFF6B]" />,
    number: "04",
    title: "Integrations & Store Features",
    description:
      "Reviews, subscriptions, analytics, marketing tools, shipping, payments, and third-party store integrations.",
  },
  {
    icon: <Gauge className="w-6 h-6 text-[#7CFF6B]" />,
    number: "05",
    title: "Performance Optimization",
    description:
      "Image optimization, JavaScript, Liquid, lazy loading, and Core Web Vitals improvements for faster storefronts.",
  },
  {
    icon: <SlidersHorizontal className="w-6 h-6 text-[#7CFF6B]" />,
    number: "06",
    title: "Store Optimization",
    description:
      "Navigation, collections, filters, SEO, mobile UX, localization, and practical storefront improvements.",
  },
];

export default function ShopifyExpertise() {
  return (
    <section
      id="shopify"
      className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A] relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7CFF6B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>PRIMARY SPECIALIZATION</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            SHOPIFY DEVELOPMENT
          </h2>

          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            I build and optimize Shopify stores for real-world e-commerce needs,
            with{" "}
            <span className="text-[#F5F5F0] font-medium">120+ projects</span>{" "}
            delivered across custom development, storefront optimization,
            integrations, and conversion-focused experiences.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {shopifyCapabilities.map((item) => (
            <div
              key={item.number}
              className="p-6 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 space-y-5 group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                  {item.icon}
                </div>

                <span className="font-mono text-xs text-[#666]">
                  {item.number}
                </span>
              </div>

              {/* Card Content */}
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#A1A1A1] font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Proof */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-xl bg-[#0F0F0F] border border-[#222222] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-[#666] uppercase tracking-wider">
              Professional Shopify Experience
            </p>

            <p className="mt-1 text-sm sm:text-base text-[#A1A1A1]">
              Hands-on experience across custom stores, client requirements,
              integrations, and storefront optimization.
            </p>
          </div>

          <div className="shrink-0">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-[#7CFF6B]">
              120+
            </span>
            <span className="ml-2 text-xs font-mono text-[#666]">PROJECTS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
