import { apiClient } from "./client";
import { news as mockNews } from "../mock/news";

export interface NewsItem {
  id: string | number;
  tag: string;
  title: string;
  description: string;
  date: string;
  image: string;
  content?: string;
}

export interface BackendNewsResponse {
  id: string;
  tag: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  image: string;
  viewsCount?: number;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const fetchNews = async (): Promise<NewsItem[]> => {
  if (USE_MOCK) {
    return mockNews as NewsItem[];
  }
  try {
    const response = await apiClient.get<BackendNewsResponse[]>("/news");
    if (Array.isArray(response.data)) {
      return response.data.map((n) => ({
        id: n.id,
        tag: n.tag,
        title: n.title,
        description: n.description,
        date: n.date,
        image: n.image,
        content: n.content,
      }));
    }
    return [];
  } catch (error) {
    console.error("API error fetching news from backend SQL API:", error);
    throw error;
  }
};
