export interface ShopifyProject {
  _id?: string;
  title: string;
  clientName?: string;
  fullPageScreenshot?: string;
  thumbnail?: string;
  category?: string;
  theme?: string;
  description?: string;
  liveUrl: string;
  storePassword?: string;
  features?: string[];
  status?: "Published" | "In Development" | "Completed" | string;
  completionDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
