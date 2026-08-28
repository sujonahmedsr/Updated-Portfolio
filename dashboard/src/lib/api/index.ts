import axios from "axios";
import { Project, Article, Message } from "@/types";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://my-portfolio-backend-ebon.vercel.app";

const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Projects API
export async function getProjectsApi(): Promise<Project[]> {
  try {
    const res = await apiClient.get("/api/projects");
    return res.data?.data?.result || res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getSingleProjectApi(id: string): Promise<Project | null> {
  try {
    const res = await apiClient.get(`/api/projects/${id}`);
    return res.data?.data?.result || res.data?.data || res.data || null;
  } catch (error) {
    console.error("Error fetching single project:", error);
    return null;
  }
}

export async function createProjectApi(data: Partial<Project>): Promise<Project | null> {
  try {
    const res = await apiClient.post("/api/projects/create", data);
    return res.data?.data?.result || res.data?.data || res.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProjectApi(id: string, data: Partial<Project>): Promise<Project | null> {
  try {
    const res = await apiClient.patch(`/api/projects/${id}`, data);
    return res.data?.data?.result || res.data?.data || res.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProjectApi(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/projects/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

// Articles / Blogs API
export async function getArticlesApi(): Promise<Article[]> {
  try {
    const res = await apiClient.get("/api/blogs");
    return res.data?.data?.result || res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function getSingleArticleApi(id: string): Promise<Article | null> {
  try {
    const res = await apiClient.get(`/api/blogs/${id}`);
    return res.data?.data?.result || res.data?.data || res.data || null;
  } catch (error) {
    console.error("Error fetching single article:", error);
    return null;
  }
}

export async function createArticleApi(data: Partial<Article>): Promise<Article | null> {
  try {
    const res = await apiClient.post("/api/blogs/create", data);
    return res.data?.data?.result || res.data?.data || res.data;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

export async function updateArticleApi(id: string, data: Partial<Article>): Promise<Article | null> {
  try {
    const res = await apiClient.patch(`/api/blogs/${id}`, data);
    return res.data?.data?.result || res.data?.data || res.data;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export async function deleteArticleApi(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/blogs/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    return false;
  }
}

// Messages API
export async function getMessagesApi(): Promise<Message[]> {
  try {
    const res = await apiClient.get("/api/message");
    return res.data?.data?.result || res.data?.data || res.data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function deleteMessageApi(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/message/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}

// Health Check API
export async function checkServerHealthApi(): Promise<boolean> {
  try {
    const res = await apiClient.get("/");
    return res.status === 200 || res.data?.status === true;
  } catch (error) {
    return false;
  }
}
