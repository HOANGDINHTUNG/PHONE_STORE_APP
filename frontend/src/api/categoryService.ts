import { apiClient } from "./client";
import { Category } from "../types";
import { categories as mockCategories } from "../mock/categories";

export interface BackendCategoryResponse {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  status?: string;
  sortOrder?: number;
  subCategories?: BackendCategoryResponse[];
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const getCategoryIcon = (slug: string, name?: string): string => {
  const s = `${slug || ""} ${name || ""}`.toLowerCase();
  if (s.includes("dien-thoai") || s.includes("phone") || s.includes("mobile")) return "MobileOutlined";
  if (s.includes("tablet") || s.includes("pad")) return "TabletOutlined";
  if (s.includes("laptop") || s.includes("macbook") || s.includes("may-tinh")) return "LaptopOutlined";
  if (s.includes("smartwatch") || s.includes("dong-ho") || s.includes("watch")) return "ClockCircleOutlined";
  if (s.includes("tai-nghe") || s.includes("audio") || s.includes("headphone")) return "CustomerServiceOutlined";
  if (s.includes("phu-kien") || s.includes("accessory")) return "AppstoreOutlined";
  if (s.includes("apple") || s.includes("iphone")) return "AppleOutlined";
  if (s.includes("samsung")) return "AndroidOutlined";
  return "AppstoreOutlined";
};

export const fetchCategories = async (): Promise<Category[]> => {
  if (USE_MOCK) {
    return mockCategories as Category[];
  }
  try {
    const response = await apiClient.get<BackendCategoryResponse[]>("/categories/tree");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        iconName: getCategoryIcon(cat.slug, cat.name),
        description: cat.description,
      }));
    }
    return [];
  } catch (error) {
    console.error("API error fetching categories from backend SQL API:", error);
    throw error;
  }
};
