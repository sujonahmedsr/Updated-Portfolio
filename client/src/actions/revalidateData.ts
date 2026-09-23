"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shofiqul81severdb.vercel.app/api";

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
  revalidateTag("projects", "projects");
}

export async function revalidateBlogs() {
  revalidateTag("blogs", "blogs");
}

// API কলের জন্য আলাদা async function
export async function getProjects() {
  try {
    const res = await axios.get(`${API_URL}/projects`);

    return res.data?.data?.result || [];
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
    const res = await axios.get(`${API_URL}/settings`, { timeout: 8000 });
    return { ...fallback, ...(res.data?.data || {}) };
  } catch (error) {
    console.error("Error fetching portfolio settings:", error);
    return fallback;
  }
}

export async function getBlogs() {
  try {
    const res = await axios.get(`${API_URL}/blogs`);

    return res.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
