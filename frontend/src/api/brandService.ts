import { apiClient } from "./client";
import { Brand } from "../types";
import { brands as mockBrands } from "../mock/brands";
import appleLogo from "../assets/phone-brand-logos/apple.svg";
import asusLogo from "../assets/phone-brand-logos/asus.svg";
import googlePixelLogo from "../assets/phone-brand-logos/google-pixel.svg";
import onePlusLogo from "../assets/phone-brand-logos/oneplus.svg";
import oppoLogo from "../assets/phone-brand-logos/oppo.svg";
import realmeLogo from "../assets/phone-brand-logos/realme.svg";
import samsungLogo from "../assets/phone-brand-logos/samsung.svg";
import sonyLogo from "../assets/phone-brand-logos/sony.svg";
import vivoLogo from "../assets/phone-brand-logos/vivo.svg";
import xiaomiLogo from "../assets/phone-brand-logos/xiaomi.svg";

export interface BackendBrandResponse {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  status?: string;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const BRAND_LOGOS: Record<string, string> = {
  apple: appleLogo,
  asus: asusLogo,
  "google-pixel": googlePixelLogo,
  oneplus: onePlusLogo,
  oppo: oppoLogo,
  realme: realmeLogo,
  samsung: samsungLogo,
  sony: sonyLogo,
  vivo: vivoLogo,
  xiaomi: xiaomiLogo,
};

const createWordmarkLogo = (brandName: string): string => {
  const safeName = brandName.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100"><rect width="320" height="100" rx="16" fill="%23ffffff"/><text x="160" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="%23c2185b" letter-spacing="1">${safeName}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
};

const withLocalLogo = (brand: Brand): Brand => ({
  ...brand,
  logo: BRAND_LOGOS[brand.slug.toLowerCase()] || createWordmarkLogo(brand.name),
});

export const fetchBrands = async (): Promise<Brand[]> => {
  if (USE_MOCK) {
    return (mockBrands as Brand[]).map(withLocalLogo);
  }
  try {
    const response = await apiClient.get<BackendBrandResponse[]>("/brands");
    if (Array.isArray(response.data)) {
      return response.data.map((b) => {
        return withLocalLogo({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logo: b.logoUrl || "",
        });
      });
    }
    return [];
  } catch (error) {
    console.error("API error fetching brands from backend SQL API:", error);
    throw error;
  }
};
