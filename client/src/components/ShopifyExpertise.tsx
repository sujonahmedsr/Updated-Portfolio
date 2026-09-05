"use client";

import { ShoppingBag, Code, Gauge, Globe, CheckCircle2 } from "lucide-react";

const shopifyCapabilities = [
  {
    icon: <Code className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Custom Theme Development",
    description:
      "Architecting bespoke Shopify themes using Liquid 2.0, JSON templates, reusable section blocks, and native Metafields.",
    features: [
      "Shopify Liquid 2.0 Architecture",
      "Modular Sections & Blocks",
      "JSON Page Templates",
      "Metafields & Metaobjects Integration",
      "Dynamic Data Sources",
      "Theme Customization & Upgrades",
    ],
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Storefront UX & Conversion",
    description:
      "Designing intuitive, high-converting e-commerce experiences engineered specifically for desktop and mobile shoppers.",
    features: [
      "Custom Product Detail Pages (PDP)",
      "Slide-out AJAX Cart Drawers",
      "Instant Collection Filters",
      "Color Swatches & Option Selectors",
      "Mobile-First Responsive Layouts",
      "Conversion-Driven Micro UX",
    ],
  },
  {
    icon: <Gauge className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Performance Optimization",
    description:
      "Optimizing theme assets and liquid code to achieve sub-1.5 second page load times and top Core Web Vitals scores.",
    features: [
      "LCP (Largest Contentful Paint) Reduction",
      "CLS (Layout Shift) Zeroing",
      "Image WebP / AVIF Optimization",
      "Script Deferral & App Cleanups",
      "Lazy Loading Assets",
      "Lighthouse Storefront Audits",
    ],
  },
  {
    icon: <Globe className="w-6 h-6 text-[#7CFF6B]" />,
    title: "Store Configuration & Markets",
    description:
      "Setting up global e-commerce infrastructures with multi-currency support, international markets, and technical SEO.",
    features: [
      "Shopify Markets & Multi-Currency",
      "Multi-language Localization",
      "Shipping & Payment Setup",
      "Custom Domain & DNS Configuration",
      "Structured JSON-LD Data for SEO",
      "Third-Party App Integrations",
    ],
  },
];

export default function ShopifyExpertise() {
  return (
    <section
      id="shopify"
      className="py-6 sm:py-12 bg-[#0A0A0A] border-b border-[#1A1A1A] relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7CFF6B]/5 rounded-full blur-3xl pointer-events-none"></div>

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
            I specialize in crafting high-end custom Shopify storefronts that
            combine rich aesthetics with fast loading speeds, seamless mobile
            usability, and clean Liquid architecture.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {shopifyCapabilities.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all duration-300 space-y-6 group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center group-hover:border-[#7CFF6B]/50 transition-colors">
                {item.icon}
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold text-[#F5F5F0] group-hover:text-[#7CFF6B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A1A1A1] font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-4 border-t border-[#1E1E1E]">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#D4D4D4]">
                  {item.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7CFF6B] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
