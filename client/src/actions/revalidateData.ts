"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function revalidateProjects() {
  revalidateTag("projects", "projects");
}

export async function revalidateBlogs() {
  revalidateTag("blogs", "blogs");
}

// API কলের জন্য আলাদা async function
export async function getProjects() {
  try {
    const res = await axios.get(`${NEXT_PUBLIC_API_URL}/projects`);

    return res.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getBlogs() {
  try {
    const res = await axios.get(`${NEXT_PUBLIC_API_URL}/blogs`);

    return res.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}
