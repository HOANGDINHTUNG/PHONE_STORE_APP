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

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const BRAND_SVGS: Record<string, string> = {
  apple: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzAgMTcwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiPjxwYXRoIGZpbGw9IiMxMTExMTEiIGQ9Ik0xNTAuMzcgMTMwLjI1Yy0yLjQ1IDUuNjYtNS4zNSAxMC44Ny04Ljc1IDE1LjY2LTQuNTggNi41My04LjMzIDExLjA1LTExLjIyIDEzLjU2LTQuNDggNC4xMi05LjI4IDYuMjMtMTQuNDIgNi4zNS0zLjY5IDAtOC4xNC0xLjA1LTEzLjMyLTMuMTgtNS4xOS0yLjEyLTkuOTctMy4xNy0xNC4zNC0zLjE3LTQuNTggMC05LjQ5IDEuMDUtMTQuNzUgMy4xNy01LjI2IDIuMTMtOS41IDQuMjQtMTIuNzQgNC4zNS00LjkuMTMtOS42NC0xLjkyLTE0LjIzLTYuMTYtMy4zMi0yLjkyLTcuMTQtNy41My0xMS40Ni0xMy44Mi03LjQ2LTEwLjg0LTEzLjEtMjIuNzUtMTYuOTItMzUuNzMtMy44My0xMi45OC01Ljc0LTI1LjI2LTUuNzQtMzYuODQgMC0xNC43MyAzLjY6LTI2Ljk2IDEwLjk3LTM2LjY4IDcuMzEtOS43MyAxNi41OS0xNC43MSAyNy44NC0xNC45NSA0Ljg5IDAgMTAuMDggMS4xOCAxNS41OCAzLjU0IDU4IDIuMzYgOS4zOCAzLjU0IDExLjY0IDMuNTQgMi4wMSAwIDUuOTItMS4yMiAxMS43My0zLjY2IDUuOC0yLjQ0IDEwLjc0LTMuNTggMTQuODItMy40MiAxMC41NS41MSAxOS4zNCA0LjU0IDI2LjM6IDEyLjA5LTE3LjcyIDEwLjc0LTE2LjQ4IDI5LjU2IDMuNzIgNDAuNTkgMS4xNS42MSAyLjM3IDEuMjUgMy42NiAxLjkzLTMuNCA5Ljg3LTguMDYgMTkuNTMtMTMuOTggMjguOTh6TTExOS4yMiAzMS4wNWMwLTcuMjMgMi42LTE0LjE1IDcuOC0yMC43NiA1LjIxLTYuNjIgMTEuNzUtMTAuMjkgMTkuNhMtMTEgMS4wNiA3LjQyLTEuMzkgMTQuNDgtNy4zNCAyMS4xOS01Ljk2IDYuNzEtMTIuNjMgMTAuNDItMjAuMDkgMTAuNTd6Ii8+PC9zdmc+`,
  samsung: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTAwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOS0wIiBmb250LXNpemU9IjQ0IiBmaWxsPSIjMTQyOEEwIiBsZXR0ZXItc3BhY2luZz0iNCI+U0FNU1VORzwvdGV4dD48L3N2Zz4=`,
  xiaomi: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iNDUiIGhlaWdodD0iNDUiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjIiIGZpbGw9IiNGRjY5MDAiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMjIgMjZoNTZ2NDhINjRWMzhINTJ2MzZINDI0MzIyVjI2eiIvPjwvc3ZnPg==`,
  oppo: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTAwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOS0wIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMDU2ODM5IiBsZXR0ZXItc3BhY2luZz0iNiI+T1BQTzwvdGV4dD48L3N2Zz4=`,
};

export const fetchBrands = async (): Promise<Brand[]> => {
  if (USE_MOCK) {
    return mockBrands as Brand[];
  }
  try {
    const response = await apiClient.get<BackendBrandResponse[]>("/brands");
    if (Array.isArray(response.data)) {
      return response.data.map((b) => {
        const slug = b.slug.toLowerCase();
        const logo = BRAND_SVGS[slug] || b.logoUrl || `/images/brand_${slug}.png`;
        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo,
        };
      });
    }
    return [];
  } catch (error) {
    console.error("API error fetching brands from backend SQL API:", error);
    throw error;
  }
};
