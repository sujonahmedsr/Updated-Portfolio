export interface Project {
  _id: string;
  title: string;
  image?: string | null;
  description: string;
  technologies: string;
  githubLink: string;
  liveLink: string;
  category?: string;
  status?: "Published" | "Draft";
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  _id: string;
  title: string;
  image?: string | null;
  description: string;
  slug?: string;
  category?: string;
  tags?: string[];
  status?: "Published" | "Draft";
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

export interface AdminStats {
  totalProjects: number;
  publishedProjects: number;
  totalArticles: number;
  totalMessages: number;
  unreadMessages: number;
}
