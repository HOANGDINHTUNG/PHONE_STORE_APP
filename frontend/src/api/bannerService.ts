import { apiClient } from "./client";

export interface BannerItem {
  id: string | number;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  textColor: string;
  productSlug: string;
  featuredProduct: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const fallbackBanners: BannerItem[] = [
  {
    id: 1,
    label: "EXCLUSIVE RELEASE",
    title: "The Ultra X 2024 - Đỉnh Cao Công Nghệ",
    subtitle:
      "Trải nghiệm sức mạnh xử lý vượt trội và camera 200MP chuyên nghiệp thế hệ mới.",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
    bgColor: "linear-gradient(135deg, #A8868A 0%, #D7B4B9 100%)",
    textColor: "#ffffff",
    productSlug: "samsung-galaxy-s24-ultra",
    featuredProduct: {
      id: "33333333-3333-3333-3333-333333333332",
      name: "Samsung Galaxy S24 Ultra",
      price: "26.990.000đ",
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png",
    },
  },
  {
    id: 2,
    label: "NEW ARRIVAL",
    title: "iPhone 15 Pro Max Pink Edition",
    subtitle: "Đẳng cấp titan bền bỉ kết hợp sắc hồng quý phái đầy lôi cuốn.",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    bgColor: "linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%)",
    textColor: "#333333",
    productSlug: "iphone-15-pro-max",
    featuredProduct: {
      id: "33333333-3333-3333-3333-333333333331",
      name: "iPhone 15 Pro Max 256GB",
      price: "29.890.000đ",
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    },
  },
];

export const fetchBanners = async (): Promise<BannerItem[]> => {
  if (USE_MOCK) {
    return fallbackBanners;
  }
  try {
    const response = await apiClient.get<any[]>("/banners");
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((b, index) => ({
        id: b.id || index + 1,
        label: b.label || "HOT PROMOTION",
        title: b.title,
        subtitle: b.subtitle || "",
        image:
          b.imageUrl && b.imageUrl.startsWith("http")
            ? b.imageUrl
            : fallbackBanners[index % fallbackBanners.length].image,
        bgColor: b.bgColor || fallbackBanners[index % fallbackBanners.length].bgColor,
        textColor: b.textColor || "#ffffff",
        productSlug: index === 0 ? "samsung-galaxy-s24-ultra" : "iphone-15-pro-max",
        featuredProduct: fallbackBanners[index % fallbackBanners.length].featuredProduct,
      }));
    }
  } catch (error) {
    console.warn("Could not fetch banners from backend API:", error);
  }
  return fallbackBanners;
};
