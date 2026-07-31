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

const getCategoryIcon = (slug: string): string => {
  const s = slug.toLowerCase();
  if (s.includes("iphone") || s.includes("apple")) return "AppleOutlined";
  if (s.includes("samsung")) return "AndroidOutlined";
  if (s.includes("xiaomi")) return "MobileOutlined";
  if (s.includes("oppo")) return "ClockCircleOutlined";
  if (s.includes("mobile")) return "CustomerServiceOutlined";
  return "AppstoreOutlined";
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<BackendCategoryResponse[]>("/categories/tree");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        iconName: getCategoryIcon(cat.slug),
        description: cat.description,
      }));
    }
  } catch (error) {
    console.warn("Could not fetch categories from backend SQL API, using mock fallback:", error);
  }
  return mockCategories as Category[];
};
