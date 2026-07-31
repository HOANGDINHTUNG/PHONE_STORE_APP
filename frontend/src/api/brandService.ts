import { apiClient } from "./client";
import { Brand } from "../types";
import { brands as mockBrands } from "../mock/brands";

export interface BackendBrandResponse {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  status?: string;
}

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get<BackendBrandResponse[]>("/brands");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logo: b.logoUrl || `/images/brand_${b.slug}.png`,
      }));
    }
  } catch (error) {
    console.warn("Could not fetch brands from backend SQL API, using mock fallback:", error);
  }
  return mockBrands as Brand[];
};
