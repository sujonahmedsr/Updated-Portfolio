"use client";

import { useState } from "react";
import { ArrowUpRight, Terminal, Zap, Check, ShoppingBag } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<
    "shopify" | "liquid" | "performance"
  >("shopify");

  return (
    <section className="relative min-h-0 lg:min-h-screen pt-28 pb-10 sm:pt-32 sm:pb-14 overflow-hidden bg-grid-pattern bg-radial-gradient flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 min-w-0">
            {/* Availability Badge */}
            <div className="inline-flex max-w-full flex-wrap items-center gap-2.5 rounded-full border border-[#222222] bg-[#121212] px-3.5 py-1.5 text-[10px] font-mono text-[#A1A1A1] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>

              <span className="text-[#F5F5F0]">STATUS:</span>

              <span className="text-[#7CFF6B]">
                AVAILABLE FOR SHOPIFY PROJECTS
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-heading text-[clamp(2.25rem,8vw,3.5rem)] font-bold tracking-tight text-[#F5F5F0] leading-[1.05] break-words [text-wrap:balance]">
                SHOPIFY &amp; E-COMMERCE
                <span className="block text-[#7CFF6B] font-mono text-[clamp(1.55rem,5.5vw,2.75rem)] mt-2 font-semibold break-words">
                  DEVELOPER
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A1A1A1] max-w-2xl leading-relaxed font-sans font-light">
              I build and customize Shopify storefronts with{" "}
              <span className="text-[#F5F5F0] font-medium">
                custom Liquid development
              </span>
              , product experiences, integrations, and performance-focused
              improvements designed around real business requirements.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="px-6 py-3.5 rounded-md bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#7CFF6B]/15 inline-flex items-center gap-2"
              >
                <span>View My Work</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-md bg-[#121212] border border-[#262626] text-[#F5F5F0] font-mono font-medium text-sm hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all inline-flex items-center gap-2"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Credibility Metadata */}
            <div className="pt-6 border-t border-[#1A1A1A] grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs text-[#A1A1A1]">
              <div>
                <span className="block text-[#7CFF6B] font-bold text-sm">
                  120+ PROJECTS
                </span>
                <span className="text-[#666]">Shopify &amp; E-commerce</span>
              </div>

              <div>
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  SHOPIFY &amp; LIQUID
                </span>
                <span className="text-[#666]">
                  Themes, Sections &amp; Features
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  PERFORMANCE &amp; UX
                </span>
                <span className="text-[#666]">
                  Responsive &amp; Optimized Stores
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#121212] border border-[#222222] shadow-2xl overflow-hidden font-mono">
              {/* Workshop Window Header */}
              <div className="bg-[#161616] px-4 py-3 border-b border-[#222222] flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>

                  <span className="ml-2 min-w-0 truncate text-xs text-[#666]">
                    shopify-development.workspace
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#7CFF6B] bg-[#7CFF6B]/10 px-2 py-0.5 rounded border border-[#7CFF6B]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Workspace Tabs */}
              <div className="grid grid-cols-3 border-b border-[#222222] bg-[#0E0E0E] text-[11px] sm:text-xs">
                <button
                  onClick={() => setActiveTab("shopify")}
                  className={`min-w-0 py-2.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border-r border-[#222222] ${
                    activeTab === "shopify"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Shopify</span>
                </button>

                <button
                  onClick={() => setActiveTab("liquid")}
                  className={`min-w-0 py-2.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border-r border-[#222222] ${
                    activeTab === "liquid"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Liquid Systems</span>
                </button>

                <button
                  onClick={() => setActiveTab("performance")}
                  className={`min-w-0 py-2.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors ${
                    activeTab === "performance"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Performance</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="h-[430px] sm:h-[450px] p-4 sm:p-5 flex flex-col justify-between bg-[#121212] overflow-hidden">
                {/* Shopify Tab */}
                {activeTab === "shopify" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex min-w-0 items-center justify-between gap-3 text-[#888] text-[11px]">
                      <span className="truncate">
                        Shopify / Online Store 2.0
                      </span>

                      <span className="shrink-0 text-[#7CFF6B]">
                        Storefront Development
                      </span>
                    </div>

                    <div className="h-[270px] rounded-lg bg-[#0E0E0E] border border-[#222222] overflow-auto p-4 text-[#D4D4D4] leading-relaxed">
                      <p className="text-[#6A9955]">
                        {"// Custom Shopify storefront architecture"}
                      </p>

                      <p className="mt-3">
                        <span className="text-[#569CD6]">section</span>{" "}
                        <span className="text-[#DCDCAA]">
                          featured-products
                        </span>{" "}
                        {"{"}
                      </p>

                      <p className="pl-4">
                        <span className="text-[#569CD6]">settings</span>:
                      </p>

                      <p className="pl-8">
                        <span className="text-[#9CDCFE]">product</span>
                        <span className="text-[#D4D4D4]">
                          {" "}
                          → dynamic picker
                        </span>
                      </p>

                      <p className="pl-8">
                        <span className="text-[#9CDCFE]">heading</span>
                        <span className="text-[#D4D4D4]"> → customizable</span>
                      </p>

                      <p className="pl-8">
                        <span className="text-[#9CDCFE]">layout</span>
                        <span className="text-[#D4D4D4]"> → responsive</span>
                      </p>

                      <p className="mt-3">
                        <span className="text-[#569CD6]">render</span>(
                        <span className="text-[#CE9178]">
                          &quot;product-card&quot;
                        </span>
                        );
                      </p>

                      <p className="mt-3 text-[#7CFF6B]">
                        Reusable • Responsive • Maintainable
                      </p>

                      <p className="mt-3">{"}"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          ONLINE STORE 2.0
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Flexible theme architecture
                        </span>
                      </div>

                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          CUSTOM FEATURES
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Built around business requirements
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liquid Tab */}
                {activeTab === "liquid" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex min-w-0 items-center justify-between gap-3 text-[#888] text-[11px]">
                      <span className="truncate">
                        sections/featured-product.liquid
                      </span>

                      <span className="shrink-0 text-[#7CFF6B]">
                        Shopify Liquid
                      </span>
                    </div>

                    <div className="h-[270px] rounded-lg bg-[#0E0E0E] border border-[#222222] overflow-auto p-3 text-[#D4D4D4] leading-relaxed">
                      <p className="text-[#6A9955]">
                        {
                          "{% comment %} Dynamic product section {% endcomment %}"
                        }
                      </p>

                      <p>
                        &#123;% <span className="text-[#569CD6]">assign</span>{" "}
                        <span className="text-[#9CDCFE]">featured_product</span>{" "}
                        ={" "}
                        <span className="text-[#CE9178]">
                          section.settings.product
                        </span>{" "}
                        %&#125;
                      </p>

                      <p className="pl-4">
                        &lt;<span className="text-[#4EC9B0]">article</span>{" "}
                        className=
                        <span className="text-[#CE9178]">
                          &quot;product-card&quot;
                        </span>
                        &gt;
                      </p>

                      <p className="pl-8 text-[#CE9178]">
                        &lt;<span className="text-[#4EC9B0]">h3</span>
                        &gt;&#123;&#123; featured_product.title
                        &#125;&#125;&lt;/
                        <span className="text-[#4EC9B0]">h3</span>&gt;
                      </p>

                      <p className="pl-8 text-[#CE9178]">
                        &#123;&#123; featured_product.price | money &#125;&#125;
                      </p>

                      <p className="pl-8 text-[#CE9178]">
                        &lt;/
                        <span className="text-[#4EC9B0]">article</span>&gt;
                      </p>

                      <p className="pt-2 text-[#7CFF6B]">
                        &#123;% <span className="text-[#F5F5F0]">schema</span>{" "}
                        %&#125; product picker + theme settings &#123;%{" "}
                        <span className="text-[#F5F5F0]">endschema</span>{" "}
                        %&#125;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          LIQUID
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Dynamic storefront logic
                        </span>
                      </div>

                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          SECTIONS
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Reusable theme components
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between gap-3 text-[#888]">
                      <span>SHOPIFY / STOREFRONT OPTIMIZATION</span>

                      <span className="text-[#7CFF6B] font-bold">
                        OPTIMIZED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          IMAGE DELIVERY
                        </span>

                        <span className="text-[#7CFF6B] text-lg font-bold">
                          WEBP / AVIF
                        </span>

                        <span className="text-[#444] text-[10px] block">
                          Optimized storefront assets
                        </span>
                      </div>

                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          JAVASCRIPT
                        </span>

                        <span className="text-[#7CFF6B] text-lg font-bold">
                          OPTIMIZED
                        </span>

                        <span className="text-[#444] text-[10px] block">
                          Reduce unnecessary execution
                        </span>
                      </div>

                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          LOADING
                        </span>

                        <span className="text-[#7CFF6B] text-lg font-bold">
                          LAZY
                        </span>

                        <span className="text-[#444] text-[10px] block">
                          Smarter resource loading
                        </span>
                      </div>

                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          CORE WEB VITALS
                        </span>

                        <span className="text-[#7CFF6B] text-lg font-bold">
                          FOCUSED
                        </span>

                        <span className="text-[#444] text-[10px] block">
                          Performance-aware development
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Bar */}
                <div className="pt-3 border-t border-[#1E1E1E] flex min-w-0 items-center justify-between gap-3 text-[11px] text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />

                    <span>Shopify • Liquid • Online Store 2.0</span>
                  </div>

                  <span className="shrink-0 truncate text-[#A1A1A1]">
                    Custom &amp; Optimized
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
