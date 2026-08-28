"use client";

import { useState } from "react";
import { ArrowUpRight, ShoppingBag, Terminal, Zap, Check } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"storefront" | "code" | "performance">("storefront");
  const [cartCount, setCartCount] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("Dark Emerald");
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-grid-pattern bg-radial-gradient flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand & Hero Copy */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#A1A1A1]">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span className="text-[#F5F5F0]">STATUS:</span>
              <span className="text-[#7CFF6B]">AVAILABLE FOR PROJECTS</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F5F0] leading-[1.05]">
                SHOPIFY DEVELOPER
                <span className="block text-[#7CFF6B] font-mono text-3xl sm:text-5xl lg:text-6xl mt-2 font-semibold">
                  &amp; FULL-STACK DEVELOPER
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A1A1A1] max-w-2xl leading-relaxed font-sans font-light">
              I build premium Shopify storefronts and modern web applications with a focus on performance, usability, and clean development.
            </p>

            {/* CTA System */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="px-6 py-3.5 rounded-md bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#7CFF6B]/15 inline-flex items-center gap-2"
              >
                <span>View Selected Work</span>
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-md bg-[#121212] border border-[#262626] text-[#F5F5F0] font-mono font-medium text-sm hover:border-[#7CFF6B] hover:text-[#7CFF6B] transition-all inline-flex items-center gap-2"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Credibility Metadata Bar */}
            <div className="pt-6 border-t border-[#1A1A1A] grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs text-[#A1A1A1]">
              <div>
                <span className="block text-[#7CFF6B] font-bold text-sm">1.5+ YEARS</span>
                <span className="text-[#666]">Development Experience</span>
              </div>
              <div>
                <span className="block text-[#F5F5F0] font-bold text-sm">SHOPIFY &amp; REACT</span>
                <span className="text-[#666]">Primary Specializations</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[#F5F5F0] font-bold text-sm">NEXT.JS &amp; NODE.JS</span>
                <span className="text-[#666]">Full-Stack Ecosystem</span>
              </div>
            </div>

          </div>

          {/* Right Column: Digital Workshop Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#121212] border border-[#222222] shadow-2xl overflow-hidden font-mono">
              
              {/* Workshop Window Header */}
              <div className="bg-[#161616] px-4 py-3 border-b border-[#222222] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>
                  <span className="ml-2 text-xs text-[#666]">digital-workspace.v1.0</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#7CFF6B] bg-[#7CFF6B]/10 px-2 py-0.5 rounded border border-[#7CFF6B]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                  <span>LIVE DEMO</span>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex border-b border-[#222222] bg-[#0E0E0E] text-xs">
                <button
                  onClick={() => setActiveTab("storefront")}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 transition-colors border-r border-[#222222] ${
                    activeTab === "storefront"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Storefront</span>
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 transition-colors border-r border-[#222222] ${
                    activeTab === "code"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Liquid Code</span>
                </button>
                <button
                  onClick={() => setActiveTab("performance")}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 transition-colors ${
                    activeTab === "performance"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Vitals</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="p-5 min-h-[320px] flex flex-col justify-between bg-[#121212]">
                
                {/* Tab 1: Interactive Storefront Preview */}
                {activeTab === "storefront" && (
                  <div className="space-y-4 font-sans">
                    <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                      <span>SHOPIFY STOREFRONT DEMO</span>
                      <div className="flex items-center gap-1.5 text-[#7CFF6B]">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Cart: {cartCount} items</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] space-y-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-md bg-[#222222] border border-[#333333] flex items-center justify-center text-[#7CFF6B] font-mono text-xs font-bold shadow-inner">
                          SHPFY
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-semibold text-[#F5F5F0]">Custom Liquid Theme Section</h4>
                          <p className="text-xs text-[#888]">Dynamic Variant Selector &amp; Cart Drawer</p>
                          <div className="text-xs font-mono text-[#7CFF6B] font-semibold">$149.00 USD</div>
                        </div>
                      </div>

                      {/* Variant Selector */}
                      <div className="pt-2">
                        <label className="text-[11px] font-mono text-[#888] block mb-1.5">COLOR VARIANT:</label>
                        <div className="flex gap-2">
                          {["Dark Emerald", "Obsidian", "Matte Gray"].map((variant) => (
                            <button
                              key={variant}
                              onClick={() => setSelectedVariant(variant)}
                              className={`text-xs font-mono px-2.5 py-1 rounded border transition-all ${
                                selectedVariant === variant
                                  ? "bg-[#7CFF6B]/10 border-[#7CFF6B] text-[#7CFF6B]"
                                  : "bg-[#121212] border-[#2A2A2A] text-[#888] hover:text-[#F5F5F0]"
                              }`}
                            >
                              {variant}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-2.5 rounded bg-[#7CFF6B] text-black font-mono font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center justify-center gap-2 mt-3"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart ({selectedVariant})</span>
                      </button>

                      {addedToast && (
                        <div className="text-[11px] font-mono text-center text-[#7CFF6B] bg-[#7CFF6B]/10 py-1 rounded border border-[#7CFF6B]/20 animate-in fade-in">
                          ✓ Item added to AJAX Cart Drawer!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Liquid Code Editor Preview */}
                {activeTab === "code" && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#888] text-[11px]">
                      <span>sections/featured-product.liquid</span>
                      <span className="text-[#7CFF6B]">Shopify Liquid</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0E0E0E] border border-[#222222] overflow-x-auto text-[#D4D4D4] leading-relaxed">
                      <p className="text-[#6A9955]">{"// Shopify Liquid Section Schema"}</p>
                      <p><span className="text-[#569CD6]">schema</span> {"{"}</p>
                      <p className="pl-4"><span className="text-[#9CDCFE]">&quot;name&quot;</span>: <span className="text-[#CE9178]">&quot;Custom Product Showcase&quot;</span>,</p>
                      <p className="pl-4"><span className="text-[#9CDCFE]">&quot;settings&quot;</span>: [</p>
                      <p className="pl-8">{"{"} <span className="text-[#9CDCFE]">&quot;id&quot;</span>: <span className="text-[#CE9178]">&quot;accent_color&quot;</span>, <span className="text-[#9CDCFE]">&quot;type&quot;</span>: <span className="text-[#CE9178]">&quot;color&quot;</span> {"}"}</p>
                      <p className="pl-4">]</p>
                      <p>{"}"} <span className="text-[#569CD6]">endschema</span></p>
                      <div className="pt-2 text-[#7CFF6B]">
                        {"{% "} <span className="text-[#F5F5F0]">render &apos;cart-drawer-item&apos;, product: product</span> {" %}"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Performance Vitals Preview */}
                {activeTab === "performance" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#888]">
                      <span>LIGHTHOUSE STOREFRONT AUDIT</span>
                      <span className="text-[#7CFF6B] font-bold">100 / 100</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">LCP (LCP Time)</span>
                        <span className="text-[#7CFF6B] text-lg font-bold">1.1s</span>
                        <span className="text-[#444] text-[10px] block">Optimal (&lt; 2.5s)</span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">CLS (Layout Shift)</span>
                        <span className="text-[#7CFF6B] text-lg font-bold">0.00</span>
                        <span className="text-[#444] text-[10px] block">Zero Layout Shift</span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">INP (Interaction)</span>
                        <span className="text-[#7CFF6B] text-lg font-bold">42ms</span>
                        <span className="text-[#444] text-[10px] block">Ultra Responsive</span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">SEO &amp; BEST PRACTICES</span>
                        <span className="text-[#7CFF6B] text-lg font-bold">100%</span>
                        <span className="text-[#444] text-[10px] block">Fully Optimized</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Bar Footer */}
                <div className="pt-3 border-t border-[#1E1E1E] flex items-center justify-between text-[11px] text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />
                    <span>Shopify Theme Architecture 2.0</span>
                  </div>
                  <span className="text-[#A1A1A1]">Next.js 15 App Router</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
