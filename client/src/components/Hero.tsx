"use client";

import { useState } from "react";
import { ArrowUpRight, Terminal, Zap, Check, Layers3 } from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<
    "nextjs" | "liquid" | "performance"
  >("nextjs");

  return (
    <section className="relative min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden bg-grid-pattern bg-radial-gradient flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Brand & Hero Copy */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 min-w-0">
            {/* Live Status Badge */}
            {/* <div className="inline-flex max-w-full flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#222222] text-[10px] sm:text-xs font-mono text-[#A1A1A1]">
              <span className="w-2 h-2 rounded-full bg-[#7CFF6B] animate-pulse"></span>
              <span className="text-[#F5F5F0]">STATUS:</span>
              <span className="text-[#7CFF6B]">
                AVAILABLE FOR NEXT.JS &amp; SHOPIFY PROJECTS
              </span>
            </div> */}

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-heading text-[clamp(2.25rem,8vw,3.5rem)] font-bold tracking-tight text-[#F5F5F0] leading-[1.05] break-words [text-wrap:balance]">
                SHOPIFY DEVELOPER
                <span className="block text-[#7CFF6B] font-mono text-[clamp(1.55rem,5.5vw,2.75rem)] mt-2 font-semibold break-words">
                  &amp; FULL-STACK DEVELOPER
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A1A1A1] max-w-2xl leading-relaxed font-sans font-light">
              I specialize in building lightning-fast{" "}
              <span className="text-[#F5F5F0] font-medium">
                Next.js Web Applications
              </span>{" "}
              and premium{" "}
              <span className="text-[#F5F5F0] font-medium">
                Headless Shopify Storefronts
              </span>{" "}
              with extreme focus on performance, scalability, and modern UI/UX.
            </p>

            {/* CTA System */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="px-6 py-3.5 rounded-md bg-[#7CFF6B] text-black font-mono font-semibold text-sm hover:bg-[#68e057] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#7CFF6B]/15 inline-flex items-center gap-2"
              >
                <span>View My Projects</span>
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
                <span className="block text-[#7CFF6B] font-bold text-sm">
                  NEXT.JS 15 &amp; REACT
                </span>
                <span className="text-[#666]">Primary Tech Stack</span>
              </div>
              <div>
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  HEADLESS SHOPIFY
                </span>
                <span className="text-[#666]">Storefront API &amp; Liquid</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[#F5F5F0] font-bold text-sm">
                  NODE.JS &amp; TAILWIND
                </span>
                <span className="text-[#666]">Full-Stack Ecosystem</span>
              </div>
            </div>
          </div>

          {/* Right Column: Digital Workshop Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#121212] border border-[#222222] shadow-2xl overflow-hidden font-mono">
              {/* Workshop Window Header */}
              <div className="bg-[#161616] px-4 py-3 border-b border-[#222222] flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>
                  <span className="ml-2 min-w-0 truncate text-xs text-[#666]">
                    nextjs-app-router.v15
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#7CFF6B] bg-[#7CFF6B]/10 px-2 py-0.5 rounded border border-[#7CFF6B]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CFF6B] animate-pulse"></span>
                  <span>LIVE DEMO</span>
                </div>
              </div>

              {/* Workspace Navigation Tabs (UPDATED ONLY HERE) */}
              <div className="grid grid-cols-3 border-b border-[#222222] bg-[#0E0E0E] text-[11px] sm:text-xs">
                <button
                  onClick={() => setActiveTab("nextjs")}
                  className={`min-w-0 py-2.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border-r border-[#222222] ${
                    activeTab === "nextjs"
                      ? "bg-[#121212] text-[#7CFF6B] font-medium border-b-2 border-b-[#7CFF6B]"
                      : "text-[#888] hover:text-[#F5F5F0]"
                  }`}
                >
                  <Layers3 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Next.js</span>
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
                  <span className="truncate">Performance Lab</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="h-[430px] sm:h-[450px] p-4 sm:p-5 flex flex-col justify-between bg-[#121212] overflow-hidden">
                {/* Tab 1: Primary Next.js Stack Preview */}
                {activeTab === "nextjs" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex min-w-0 items-center justify-between gap-3 text-[#888] text-[11px]">
                      <span className="truncate">app/api/shopify/route.ts</span>
                      <span className="shrink-0 text-[#7CFF6B]">
                        Next.js 15 App Router
                      </span>
                    </div>
                    <div className="h-[270px] rounded-lg bg-[#0E0E0E] border border-[#222222] overflow-auto p-4 text-[#D4D4D4] font-mono text-xs leading-relaxed shadow-inner">
                      <p className="text-[#6A9955] font-italic">
                        {"// Next.js Server Component (DB / REST API)"}
                      </p>

                      <p className="mt-2">
                        <span className="text-[#569CD6]">
                          export default async function
                        </span>{" "}
                        <span className="text-[#DCDCAA]">ProductsPage</span>()
                        &#123;
                      </p>

                      {/* Backend API Fetch */}
                      <p className="pl-4 mt-1">
                        <span className="text-[#569CD6]">const</span>{" "}
                        <span className="text-[#9CDCFE]">res</span> ={" "}
                        <span className="text-[#C586C0]">await</span>{" "}
                        <span className="text-[#DCDCAA]">fetch</span>(
                        <span className="text-[#CE9178]">
                          &apos;https://api.example.com/products&apos;
                        </span>
                        , &#123;
                      </p>
                      <p className="pl-8">
                        <span className="text-[#9CDCFE]">next</span>: &#123;{" "}
                        <span className="text-[#9CDCFE]">revalidate</span>:{" "}
                        <span className="text-[#B5CEA8]">3600</span> &#125;{" "}
                        <span className="text-[#6A9955]">{"// ISR Cache"}</span>
                      </p>
                      <p className="pl-4">&#125;);</p>

                      <p className="pl-4 mt-1">
                        <span className="text-[#569CD6]">const</span>{" "}
                        <span className="text-[#9CDCFE]">products</span> ={" "}
                        <span className="text-[#C586C0]">await</span>{" "}
                        <span className="text-[#9CDCFE]">res</span>.
                        <span className="text-[#DCDCAA]">json</span>();
                      </p>

                      {/* JSX Render */}
                      <p className="pl-4 mt-3">
                        <span className="text-[#C586C0]">return</span> (
                      </p>

                      <p className="pl-8 text-[#808080]">
                        &lt;<span className="text-[#4EC9B0]">div</span>{" "}
                        className=
                        <span className="text-[#CE9178]">
                          &quot;grid grid-cols-3 gap-4&quot;
                        </span>
                        &gt;
                      </p>

                      <p className="pl-12 text-[#808080]">
                        &#123;<span className="text-[#9CDCFE]">products</span>.
                        <span className="text-[#DCDCAA]">map</span>((
                        <span className="text-[#9CDCFE]">item</span>) =&gt; (
                      </p>

                      <p className="pl-16 text-[#808080]">
                        &lt;<span className="text-[#4EC9B0]">ProductCard</span>{" "}
                        key=&#123;<span className="text-[#9CDCFE]">item</span>.
                        <span className="text-[#9CDCFE]">id</span>&#125;
                        product=&#123;
                        <span className="text-[#9CDCFE]">item</span>&#125; /&gt;
                      </p>

                      <p className="pl-12 text-[#808080]">))&#125;</p>

                      <p className="pl-8 text-[#808080]">
                        &lt;/<span className="text-[#4EC9B0]">div</span>&gt;
                      </p>

                      <p className="pl-4">);</p>

                      <p>&#125;</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          REACT SERVER COMPONENTS
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Zero-bundle-size rendering
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#7CFF6B] block font-bold">
                          HEADLESS SHOPIFY
                        </span>
                        <span className="text-[#666] text-[10px]">
                          Storefront API &amp; GraphQL
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Shopify Liquid Systems */}
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
                        &lt;/<span className="text-[#4EC9B0]">article</span>&gt;
                      </p>
                      <p className="pt-2 text-[#7CFF6B]">
                        &#123;% <span className="text-[#F5F5F0]">schema</span>{" "}
                        %&#125; product picker + theme settings &#123;%{" "}
                        <span className="text-[#F5F5F0]">endschema</span>{" "}
                        %&#125;
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Performance Lab */}
                {activeTab === "performance" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between gap-3 text-[#888]">
                      <span>LIGHTHOUSE / CORE WEB VITALS</span>
                      <span className="text-[#7CFF6B] font-bold">
                        100 / 100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          LCP (Largest Contentful Paint)
                        </span>
                        <span className="text-[#7CFF6B] text-lg font-bold">
                          0.8s
                        </span>
                        <span className="text-[#444] text-[10px] block">
                          Blazing Fast Next.js SSR
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          CLS (Cumulative Layout Shift)
                        </span>
                        <span className="text-[#7CFF6B] text-lg font-bold">
                          0.00
                        </span>
                        <span className="text-[#444] text-[10px] block">
                          Zero Layout Shift
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          INP (Interaction Speed)
                        </span>
                        <span className="text-[#7CFF6B] text-lg font-bold">
                          28ms
                        </span>
                        <span className="text-[#444] text-[10px] block">
                          Instant Response
                        </span>
                      </div>
                      <div className="p-3 rounded bg-[#161616] border border-[#262626]">
                        <span className="text-[#666] text-[10px] block">
                          SEO &amp; BEST PRACTICES
                        </span>
                        <span className="text-[#7CFF6B] text-lg font-bold">
                          100%
                        </span>
                        <span className="text-[#444] text-[10px] block">
                          Fully Optimized Stack
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Bar Footer */}
                <div className="pt-3 border-t border-[#1E1E1E] flex min-w-0 items-center justify-between gap-3 text-[11px] text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#7CFF6B]" />
                    <span>Next.js 15 App Router + React 19</span>
                  </div>
                  <span className="shrink-0 truncate text-[#A1A1A1]">
                    Headless Shopify &amp; Liquid
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
