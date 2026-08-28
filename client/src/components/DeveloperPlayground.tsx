"use client";

import { useState } from "react";
import { Terminal, Filter, Code2, Zap, Play, Search, Check, RefreshCw } from "lucide-react";

// Mock Products for Filter Demo
const demoProducts = [
  { id: 1, name: "Silk Sleepwear Set", category: "Sleepwear", price: 189, tag: "Best Seller" },
  { id: 2, name: "Minimalist Linen Robe", category: "Sleepwear", price: 145, tag: "New Arrival" },
  { id: 3, name: "Organic Cotton Tee", category: "Apparel", price: 65, tag: "Essentials" },
  { id: 4, name: "Cashmere Eye Mask", category: "Accessories", price: 48, tag: "Gift Idea" },
  { id: 5, name: "Tailored Lounge Pants", category: "Apparel", price: 120, tag: "Popular" },
  { id: 6, name: "Satin Pillowcase Set", category: "Accessories", price: 75, tag: "Top Rated" },
];

export default function DeveloperPlayground() {
  const [activeTab, setActiveTab] = useState<"filter" | "api" | "component" | "vitals">("filter");

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"low" | "high" | "featured">("featured");

  // API Explorer State
  const [apiMethod, setApiMethod] = useState<"GET" | "POST">("GET");
  const [apiEndpoint, setApiEndpoint] = useState("/api/v1/products?limit=3");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);

  // Component Inspector State
  const [columnsCount, setColumnsCount] = useState<2 | 3>(3);
  const [showBadge, setShowBadge] = useState(true);

  // Filter Logic
  const filteredProducts = demoProducts
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "low") return a.price - b.price;
      if (sortBy === "high") return b.price - a.price;
      return 0;
    });

  // Handle API Request Test
  const handleTestApi = () => {
    setApiLoading(true);
    setApiResult(null);

    setTimeout(() => {
      setApiLoading(false);
      if (apiMethod === "GET") {
        setApiResult(
          JSON.stringify(
            {
              status: 200,
              success: true,
              responseTime: "16ms",
              data: {
                totalProducts: 6,
                page: 1,
                items: [
                  { id: "sp_01", title: "Silk Sleepwear Set", price: "$189.00", currency: "USD", available: true },
                  { id: "sp_02", title: "Minimalist Linen Robe", price: "$145.00", currency: "USD", available: true }
                ]
              }
            },
            null,
            2
          )
        );
      } else {
        setApiResult(
          JSON.stringify(
            {
              status: 201,
              success: true,
              responseTime: "24ms",
              message: "Item added to Shopify cart session",
              cart: { itemCount: 1, total: "$189.00" }
            },
            null,
            2
          )
        );
      }
    }, 400);
  };

  return (
    <section id="playground" className="py-24 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#222222] text-xs font-mono text-[#7CFF6B]">
            <Code2 className="w-3.5 h-3.5" />
            <span>INTERACTIVE DEMONSTRATIONS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            DEVELOPER PLAYGROUND
          </h2>
          <p className="text-base text-[#A1A1A1] font-sans leading-relaxed">
            Don&apos;t just take my word for it. Interact with live UI components, API explorers, and storefront modules built directly into this portfolio.
          </p>
        </div>

        {/* Playground Shell */}
        <div className="rounded-xl bg-[#121212] border border-[#222222] shadow-2xl overflow-hidden font-mono">
          
          {/* Header Bar */}
          <div className="bg-[#161616] px-6 py-4 border-b border-[#222222] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>
              <span className="ml-2 text-xs text-[#888]">developer-playground.tsx</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setActiveTab("filter")}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === "filter"
                    ? "bg-[#7CFF6B] text-black font-semibold"
                    : "bg-[#1C1C1C] text-[#A1A1A1] hover:text-[#F5F5F0]"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Product Filter</span>
              </button>

              <button
                onClick={() => setActiveTab("api")}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === "api"
                    ? "bg-[#7CFF6B] text-black font-semibold"
                    : "bg-[#1C1C1C] text-[#A1A1A1] hover:text-[#F5F5F0]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>API Explorer</span>
              </button>

              <button
                onClick={() => setActiveTab("component")}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === "component"
                    ? "bg-[#7CFF6B] text-black font-semibold"
                    : "bg-[#1C1C1C] text-[#A1A1A1] hover:text-[#F5F5F0]"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Theme Configurator</span>
              </button>

              <button
                onClick={() => setActiveTab("vitals")}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  activeTab === "vitals"
                    ? "bg-[#7CFF6B] text-black font-semibold"
                    : "bg-[#1C1C1C] text-[#A1A1A1] hover:text-[#F5F5F0]"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Live Vitals</span>
              </button>
            </div>
          </div>

          {/* Playground Body */}
          <div className="p-6 min-h-[380px] bg-[#0E0E0E]">
            
            {/* Demo 1: Interactive Product Filter */}
            {activeTab === "filter" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search product title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#161616] border border-[#262626] text-xs text-[#F5F5F0] placeholder-[#555] focus:outline-none focus:border-[#7CFF6B]"
                    />
                  </div>

                  {/* Category Buttons */}
                  <div className="flex items-center gap-1.5">
                    {["All", "Sleepwear", "Apparel", "Accessories"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                          selectedCategory === cat
                            ? "bg-[#7CFF6B]/15 border border-[#7CFF6B] text-[#7CFF6B]"
                            : "bg-[#161616] border border-[#262626] text-[#888] hover:text-[#F5F5F0]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "low" | "high" | "featured")}
                    className="px-3 py-2 rounded bg-[#161616] border border-[#262626] text-xs text-[#A1A1A1] focus:outline-none focus:border-[#7CFF6B]"
                  >
                    <option value="featured">Featured Sort</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>

                {/* Filter Results Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-lg bg-[#141414] border border-[#222222] hover:border-[#7CFF6B]/40 transition-all font-sans"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#888] mb-2">
                          <span>{product.category}</span>
                          <span className="text-[#7CFF6B] px-1.5 py-0.5 rounded bg-[#7CFF6B]/10 border border-[#7CFF6B]/20">
                            {product.tag}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#F5F5F0] mb-1">{product.name}</h4>
                        <div className="text-xs font-mono text-[#7CFF6B] font-bold">${product.price}.00 USD</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-xs text-[#666]">
                      No products match your filter parameters. Try clearing your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Demo 2: API Explorer */}
            {activeTab === "api" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-[#141414] border border-[#222222]">
                  <select
                    value={apiMethod}
                    onChange={(e) => {
                      const m = e.target.value as "GET" | "POST";
                      setApiMethod(m);
                      setApiEndpoint(m === "GET" ? "/api/v1/products?limit=3" : "/api/v1/cart/add");
                    }}
                    className="px-3 py-1.5 rounded bg-[#1C1C1C] border border-[#2A2A2A] text-xs font-bold text-[#7CFF6B] focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>

                  <input
                    type="text"
                    readOnly
                    value={apiEndpoint}
                    className="flex-1 px-3 py-1.5 rounded bg-[#0E0E0E] border border-[#262626] text-xs text-[#D4D4D4] focus:outline-none"
                  />

                  <button
                    onClick={handleTestApi}
                    disabled={apiLoading}
                    className="px-4 py-1.5 rounded bg-[#7CFF6B] text-black font-semibold text-xs hover:bg-[#68e057] transition-all flex items-center gap-1.5"
                  >
                    {apiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>Send Request</span>
                  </button>
                </div>

                {/* API Response Preview */}
                <div className="p-4 rounded-lg bg-[#0E0E0E] border border-[#222222] min-h-[220px]">
                  <div className="flex items-center justify-between text-[11px] text-[#666] mb-2 pb-2 border-b border-[#1A1A1A]">
                    <span>RESPONSE PREVIEW</span>
                    {apiResult && <span className="text-[#7CFF6B]">200 OK — 16ms</span>}
                  </div>

                  {apiLoading ? (
                    <div className="flex items-center justify-center py-12 text-xs text-[#7CFF6B] gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing API endpoint query...</span>
                    </div>
                  ) : apiResult ? (
                    <pre className="text-xs text-[#7CFF6B] overflow-x-auto leading-relaxed">
                      {apiResult}
                    </pre>
                  ) : (
                    <div className="text-xs text-[#555] py-8 text-center">
                      Click &quot;Send Request&quot; above to simulate an asynchronous REST API call.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Demo 3: Live Theme Component Configurator */}
            {activeTab === "component" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-[#141414] border border-[#222222] text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-[#888]">GRID COLUMNS:</span>
                    <button
                      onClick={() => setColumnsCount(2)}
                      className={`px-3 py-1 rounded transition-colors ${
                        columnsCount === 2 ? "bg-[#7CFF6B] text-black font-bold" : "bg-[#1E1E1E] text-[#888]"
                      }`}
                    >
                      2 Columns
                    </button>
                    <button
                      onClick={() => setColumnsCount(3)}
                      className={`px-3 py-1 rounded transition-colors ${
                        columnsCount === 3 ? "bg-[#7CFF6B] text-black font-bold" : "bg-[#1E1E1E] text-[#888]"
                      }`}
                    >
                      3 Columns
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="badgeToggle"
                      checked={showBadge}
                      onChange={(e) => setShowBadge(e.target.checked)}
                      className="accent-[#7CFF6B]"
                    />
                    <label htmlFor="badgeToggle" className="text-[#D4D4D4] cursor-pointer">
                      Show Promotional Badge
                    </label>
                  </div>
                </div>

                {/* Live Section Rendering */}
                <div className={`grid grid-cols-1 ${columnsCount === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-4`}>
                  {[1, 2, 3].slice(0, columnsCount).map((idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-[#161616] border border-[#262626] font-sans space-y-2">
                      <div className="w-full h-24 rounded bg-[#222222] flex items-center justify-center text-xs font-mono text-[#666]">
                        Liquid Block #{idx}
                      </div>
                      {showBadge && (
                        <span className="inline-block text-[10px] font-mono text-[#7CFF6B] bg-[#7CFF6B]/10 px-2 py-0.5 rounded border border-[#7CFF6B]/20">
                          PROMO TAG
                        </span>
                      )}
                      <h4 className="text-xs font-semibold text-[#F5F5F0]">Liquid Section Component #{idx}</h4>
                      <p className="text-[11px] text-[#888]">Configurable via Shopify Schema</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demo 4: Live Vitals Monitor */}
            {activeTab === "vitals" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#888] block">FIRST CONTENTFUL PAINT</span>
                    <span className="text-xl font-bold text-[#7CFF6B]">0.7s</span>
                    <span className="text-[10px] text-[#555] block">Fast (Target &lt; 1.8s)</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#888] block">LARGEST CONTENTFUL PAINT</span>
                    <span className="text-xl font-bold text-[#7CFF6B]">1.1s</span>
                    <span className="text-[10px] text-[#555] block">Optimal (&lt; 2.5s)</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#888] block">CUMULATIVE LAYOUT SHIFT</span>
                    <span className="text-xl font-bold text-[#7CFF6B]">0.00</span>
                    <span className="text-[10px] text-[#555] block">Zero Layout Shift</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#888] block">INTERACTION TO NEXT PAINT</span>
                    <span className="text-xl font-bold text-[#7CFF6B]">38ms</span>
                    <span className="text-[10px] text-[#555] block">Ultra Smooth</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-between text-xs text-[#A1A1A1]">
                  <span>System Performance Status:</span>
                  <div className="flex items-center gap-2 text-[#7CFF6B]">
                    <Check className="w-4 h-4" />
                    <span>All Core Web Vitals Passing Google Benchmark</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
