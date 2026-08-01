import { apiClient } from "./client";
import { Product } from "../types";
import { products as mockProducts } from "../mock/products";

export interface BackendProductImage {
  id?: string;
  imageUrl: string;
  isPrimary?: boolean;
  altText?: string;
}

export interface BackendProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number;
  colorName?: string;
  color?: string;
  storageGb?: number;
  mainImageUrl?: string;
  images?: BackendProductImage[];
}

export interface BackendProductResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  variants?: BackendProductVariant[];
  minPrice?: number;
  maxPrice?: number;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "đ");
};

export const mapBackendProductToUI = (bp: BackendProductResponse): Product => {
  const minP = bp.minPrice || (bp.variants && bp.variants[0]?.price) || 0;
  const maxP = bp.maxPrice || (bp.variants && bp.variants[0]?.salePrice) || minP;
  
  let mainImage = "";
  if (bp.variants && bp.variants.length > 0) {
    for (const v of bp.variants) {
      if (v.mainImageUrl) {
        mainImage = v.mainImageUrl;
        break;
      }
      if (v.images && v.images.length > 0) {
        const primaryImg = v.images.find((img) => img.isPrimary);
        mainImage = primaryImg ? primaryImg.imageUrl : v.images[0].imageUrl;
        if (mainImage) break;
      }
    }
  }

  if (!mainImage) {
    mainImage = `/images/prod_${bp.slug.replace(/-/g, "")}.png`;
  }

  return {
    id: bp.id,
    name: bp.name,
    brand: bp.brandName || "PinkPhone",
    category: (bp.categoryName || "iphone").toLowerCase(),
    image: mainImage,
    newPrice: formatCurrency(minP),
    oldPrice: maxP > minP ? formatCurrency(maxP) : undefined,
    badge: bp.minPrice && bp.maxPrice && bp.maxPrice > bp.minPrice ? "GIẢM SỐC" : "",
    badgeType: "sale",
    gift: "Tặng kèm phụ kiện chính hãng",
    rating: 5,
    reviewsCount: 12,
    slug: bp.slug,
    description: bp.description,
  };
};

export const fetchProducts = async (
  keyword?: string,
  categoryId?: string,
  brandId?: string
): Promise<Product[]> => {
  if (USE_MOCK) {
    return mockProducts as Product[];
  }
  try {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;
    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;

    const response = await apiClient.get<BackendProductResponse[]>("/products", { params });
    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendProductToUI);
    }
    return [];
  } catch (error) {
    console.error("API error fetching products from backend SQL API:", error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  if (USE_MOCK) {
    const foundMock = mockProducts.find(
      (p) => p.name.toLowerCase().includes(slug.toLowerCase()) || p.id.toString() === slug
    );
    return (foundMock as Product) || null;
  }
  try {
    const response = await apiClient.get<BackendProductResponse>(`/products/${slug}`);
    if (response.data) {
      return mapBackendProductToUI(response.data);
    }
    return null;
  } catch (error) {
    console.error(`API error fetching product ${slug} from backend SQL API:`, error);
    throw error;
  }
};
