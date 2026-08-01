import { apiClient } from "./client";
import { banners as mockBanners } from "../mock/banners";

export interface Banner {
  id: string | number;
  label?: string;
  title: string;
  subtitle?: string;
  image: string;
  bgColor?: string;
  textColor?: string;
  linkUrl?: string;
}

export interface BackendBannerResponse {
  id: string;
  title: string;
  label?: string;
  subtitle?: string;
  image: string;
  linkUrl?: string;
  bgColor?: string;
  textColor?: string;
  sortOrder?: number;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const fetchBanners = async (): Promise<Banner[]> => {
  if (USE_MOCK) {
    return mockBanners as Banner[];
  }
  try {
    const response = await apiClient.get<BackendBannerResponse[]>("/banners");
    if (Array.isArray(response.data)) {
      return response.data.map((b) => ({
        id: b.id,
        label: b.label || "",
        title: b.title,
        subtitle: b.subtitle || "",
        image: b.image,
        bgColor: b.bgColor || "linear-gradient(135deg, #A8868A 0%, #D7B4B9 100%)",
        textColor: b.textColor || "#ffffff",
        linkUrl: b.linkUrl,
      }));
    }
    return [];
  } catch (error) {
    console.error("API error fetching banners from backend SQL API:", error);
    throw error;
  }
};
