"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";
import { ShopifyProject } from "@/types/shopify";

// Cleanly resolve API_URL from either NEXT_PUBLIC_API_URL or API_URL, ensuring /api without trailing slash
const rawBase =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "https://shofiqul81severdb.vercel.app/api";

const cleanBase = rawBase.trim().replace(/\/+$/, "");
const API_URL = cleanBase.endsWith("/api") ? cleanBase : `${cleanBase}/api`;

const noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export type PortfolioSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  githubUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  availability: string;
};

export async function revalidateProjects() {
  try {
    revalidateTag("projects", "projects");
  } catch {}
}

export async function revalidateShopifyProjects() {
  try {
    revalidateTag("shopify-projects", "shopify-projects");
  } catch {}
}

export async function revalidateBlogs() {
  try {
    revalidateTag("blogs", "blogs");
  } catch {}
}

// Fallback high quality Shopify projects in case API is empty or down
const FALLBACK_SHOPIFY_PROJECTS: ShopifyProject[] = [
  {
    _id: "demo-shopify-1",
    title: "Aura Minimalist Fashion",
    clientName: "Aura Studio — USA",
    category: "Fashion & Apparel",
    theme: "Custom Liquid / Dawn 2.0",
    description:
      "A bespoke minimalist e-commerce storefront engineered for high conversion rates. Features custom Liquid product layouts, interactive color swatches, AJAX slide-out cart, and blazing fast page loads.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://demo-store-aura.myshopify.com",
    storePassword: "aura",
    features: [
      "Custom Liquid Sections",
      "AJAX Drawer Cart",
      "Color Swatches",
      "Dynamic Size Guide",
      "Mobile-First UX",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-2",
    title: "Kronos Luxury Timepieces",
    clientName: "Kronos Horology — UK",
    category: "Jewelry & Luxury",
    theme: "Prestige Theme Customized",
    description:
      "Premium luxury watch e-commerce experience with high-definition media zooms, custom technical specification tables, multi-currency localization via Shopify Markets, and VIP concierge integration.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://kronos-watches.myshopify.com",
    features: [
      "Prestige Architecture",
      "Ultra-HD Image Zoom",
      "Multi-Currency Markets",
      "Metafields Specs",
      "White-Glove Inquiries",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-3",
    title: "Vanguard Streetwear Co.",
    clientName: "Vanguard Brand — Canada",
    category: "Streetwear & Apparel",
    theme: "Shrine Pro 2.0",
    description:
      "High-energy drop storefront built for flash sales and limited releases. Engineered with countdown drops, sticky quick-buy, automated volume tiers, and TikTok/Instagram video feeds.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://vanguard-streetwear.myshopify.com",
    storePassword: "drop",
    features: [
      "Flash Drop System",
      "Sticky Add to Cart",
      "Volume Tier Discounts",
      "Video Reels Section",
      "High-Traffic Scaling",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-4",
    title: "Glow Rituals Skincare",
    clientName: "Glow Organics — Australia",
    category: "Beauty & Cosmetics",
    theme: "Impulse Theme Customized",
    description:
      "Clean, conversion-optimized beauty brand store. Includes custom skin diagnosis quiz, subscription delivery via Recharge, before/after visual sliders, and verified customer review carousels.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://glow-rituals-beauty.myshopify.com",
    features: [
      "Recharge Subscriptions",
      "Skin Diagnostic Quiz",
      "Before/After Sliders",
      "Judge.me Integration",
      "Speed 90+ Score",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-5",
    title: "Apex Audio & Acoustics",
    clientName: "Apex Gear — Germany",
    category: "Electronics & Tech",
    theme: "Warehouse Theme Custom",
    description:
      "Electronics storefront built for extensive catalogs. Features deep multi-level faceted filtering, side-by-side product comparison, interactive 3D model viewer, and instant search autocomplete.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://apex-audio-tech.myshopify.com",
    storePassword: "apex",
    features: [
      "Catalog Filtering",
      "Product Comparison",
      "Instant Predictive Search",
      "Technical Specs Tabs",
      "SEO Schema Structure",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-6",
    title: "Nordic Living & Home",
    clientName: "Scandi Interior — Norway",
    category: "Home & Furniture",
    theme: "Focal Theme Customized",
    description:
      "Scandinavian interior and furniture e-commerce experience. Implements interactive 'Shop the Look' room hotspots, fabric swatch previews, lead-time delivery calculators, and Klaviyo email capture.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://nordic-living-demo.myshopify.com",
    features: [
      "Shop the Room Hotspots",
      "Fabric Material Selector",
      "Delivery Date Picker",
      "Klaviyo Automation",
      "Zero Layout Shift",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-7",
    title: "Verde Organic Superfoods",
    clientName: "Verde Living — USA",
    category: "Food & Nutrition",
    theme: "Dawn 2.0 Custom",
    description:
      "DTC functional food brand store featuring flexible monthly bundle builder, ingredient spotlight drawers, recurring order savings, and custom nutrition facts popups.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://verde-organics.myshopify.com",
    storePassword: "verde",
    features: [
      "Custom Bundle Builder",
      "Nutritional Facts Drawer",
      "Subscribe & Save",
      "Wholesale Quick Order",
      "Micro-animations",
    ],
    status: "Published",
    completionDate: "2024",
  },
  {
    _id: "demo-shopify-8",
    title: "Velox Pro Athletics",
    clientName: "Velox Sportswear — UK",
    category: "Sports & Fitness",
    theme: "Custom Liquid Engine",
    description:
      "Engineered for performance athletes with dynamic variant previews, custom size recommendation algorithm, multi-currency checkout, and ultra-smooth infinite collection scrolling.",
    fullPageScreenshot:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    liveUrl: "https://velox-athletics.myshopify.com",
    features: [
      "Size Recommendation",
      "Dynamic Variant Switching",
      "Infinite Collection Scroll",
      "Multi-Currency Checkout",
      "Sub-second Page Load",
    ],
    status: "Published",
    completionDate: "2024",
  },
];

export async function getShopifyProjects(limit = 100): Promise<ShopifyProject[]> {
  try {
    const res = await axios.get(`${API_URL}/shopify-projects`, {
      params: { limit, _t: Date.now() },
      headers: noCacheHeaders,
      timeout: 8000,
    });

    const list = res.data?.data?.result || res.data?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    return FALLBACK_SHOPIFY_PROJECTS;
  } catch (error) {
    console.warn("Could not fetch shopify projects from API, using fallback:", error);
    return FALLBACK_SHOPIFY_PROJECTS;
  }
}

// API কলের জন্য আলাদা async function (no-cache enabled)
export async function getProjects() {
  try {
    const res = await axios.get(`${API_URL}/projects`, {
      params: { _t: Date.now() },
      headers: noCacheHeaders,
      timeout: 8000,
    });

    const list = res.data?.data?.result || res.data?.data || [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getSettings(): Promise<PortfolioSettings> {
  const fallback: PortfolioSettings = {
    siteName: "Shofiqul Islam Sujon",
    tagline: "Shopify Developer & E-Commerce Specialist",
    contactEmail: "",
    githubUrl: "",
    facebookUrl: "",
    linkedinUrl: "",
    resumeUrl: "/resume.pdf",
    availability: "Open for Freelance & Shopify Projects",
  };

  try {
    const res = await axios.get(`${API_URL}/settings`, {
      params: { _t: Date.now() },
      headers: noCacheHeaders,
      timeout: 8000,
    });
    return { ...fallback, ...(res.data?.data || {}) };
  } catch (error) {
    console.error("Error fetching portfolio settings:", error);
    return fallback;
  }
}

export async function getBlogs() {
  try {
    const res = await axios.get(`${API_URL}/blogs`, {
      params: { _t: Date.now() },
      headers: noCacheHeaders,
      timeout: 8000,
    });

    const list = res.data?.data?.result || res.data?.data || [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
