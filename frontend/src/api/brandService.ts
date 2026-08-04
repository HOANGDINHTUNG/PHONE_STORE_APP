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
  apple: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="80" height="80"><path fill="%23111111" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.9.13-9.64-1.92-14.23-6.16-3.32-2.92-7.14-7.53-11.46-13.82-7.46-10.84-13.1-22.75-16.92-35.73-3.83-12.98-5.74-25.26-5.74-36.84 0-14.73 3.66-26.96 10.97-36.68 7.31-9.73 16.59-14.71 27.84-14.95 4.89 0 10.08 1.18 15.58 3.54 5.5 2.36 9.38 3.54 11.64 3.54 2.01 0 5.92-1.22 11.73-3.66 5.8-2.44 10.74-3.58 14.82-3.42 10.55.51 19.34 4.54 26.36 12.09-17.72 10.74-16.48 29.56 3.72 40.59 1.15.61 2.37 1.25 3.66 1.93-3.4 9.87-8.06 19.53-13.98 28.98zM119.22 31.05c0-7.23 2.6-14.15 7.8-20.76 5.21-6.62 11.75-10.29 19.63-11 1.06 7.42-1.39 14.48-7.34 21.19-5.96 6.71-12.63 10.42-20.09 10.57z"/></svg>`,
  samsung: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="140" height="40"><text x="50%25" y="65%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="%231428A0" letter-spacing="4">SAMSUNG</text></svg>`,
  xiaomi: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="45" height="45"><rect width="100" height="100" rx="22" fill="%23FF6900"/><path fill="%23FFFFFF" d="M22 26h56v48H64V38H52v36H40V38H22V26z"/></svg>`,
  oppo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="130" height="40"><text x="50%25" y="65%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="48" fill="%23056839" letter-spacing="6">OPPO</text></svg>`,
};

const createWordmarkLogo = (brandName: string): string => {
  const safeName = brandName.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100"><rect width="320" height="100" rx="16" fill="%23ffffff"/><text x="160" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="%23c2185b" letter-spacing="1">${safeName}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
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
        // Avoid blank cards when remote image hosts reject hotlinked logo requests.
        const logo = BRAND_SVGS[slug] || createWordmarkLogo(b.name);
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
