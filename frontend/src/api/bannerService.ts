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
  productId?: string;
  productName?: string;
  productPrice?: string;
  productOldPrice?: string;
  productBrand?: string;
  productSlug?: string;
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

const getBannerLinkUrl = (title: string, rawLink?: string): string => {
  if (rawLink && rawLink.trim()) return rawLink;
  const t = (title || "").toLowerCase();
  if (t.includes("iphone")) return "/product/iphone-15-pro-max";
  if (t.includes("ultra")) return "/product/samsung-galaxy-s24-ultra";
  return "/#products";
};

const getBannerProductImage = (title: string, rawImage?: string): string => {
  const t = (title || "").toLowerCase();
  if (t.includes("iphone")) return "/images/prod_iphone15.png";
  if (t.includes("ultra") || t.includes("s24") || t.includes("samsung")) return "/images/prod_s24.png";
  if (rawImage && !rawImage.includes("banner")) return rawImage;
  return "/images/prod_iphone15.png";
};

export const fetchBanners = async (): Promise<Banner[]> => {
  if (USE_MOCK) {
    return mockBanners as Banner[];
  }
  try {
    const response = await apiClient.get<BackendBannerResponse[]>("/banners");
    if (Array.isArray(response.data)) {
      return response.data.map((b) => {
        const isIphone = b.title.toLowerCase().includes("iphone");
        return {
          id: b.id,
          label: b.label || "",
          title: b.title,
          subtitle: b.subtitle || "",
          image: getBannerProductImage(b.title, b.image),
          bgColor: b.bgColor || "linear-gradient(135deg, #A8868A 0%, #D7B4B9 100%)",
          textColor: b.textColor || "#ffffff",
          linkUrl: getBannerLinkUrl(b.title, b.linkUrl),
          productId: isIphone ? "33333333-3333-3333-3333-333333333331" : "33333333-3333-3333-3333-333333333332",
          productName: isIphone ? "iPhone 15 Pro Max" : "Samsung Galaxy S24 Ultra",
          productPrice: isIphone ? "29.490.000đ" : "26.990.000đ",
          productOldPrice: isIphone ? "34.990.000đ" : "33.990.000đ",
          productBrand: isIphone ? "Apple" : "Samsung",
          productSlug: isIphone ? "iphone-15-pro-max" : "samsung-galaxy-s24-ultra",
        };
      });
    }
    return [];
  } catch (error) {
    console.error("API error fetching banners from backend SQL API:", error);
    throw error;
  }
};
