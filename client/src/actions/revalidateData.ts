"use server";
import axios from "axios";
import { revalidateTag } from "next/cache";

export async function revalidateProjects() {
  revalidateTag("projects");
}
export async function revalidateBlogs() {
  revalidateTag("blogs");
}

// ✅ API কলের জন্য আলাদা async function
export async function getProjects() {
  try {
    const res = await axios.get(`${`https://my-portfolio-backend-ebon.vercel.app/api`}/projects`);
    return res.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getBlogs() {
  try {
    const res = await axios.get(`${`https://my-portfolio-backend-ebon.vercel.app/api`}/blogs`);
    return res.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}