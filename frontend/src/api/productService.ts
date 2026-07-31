import { apiClient } from "./client";
import { Product } from "../types";
import { products as mockProducts } from "../mock/products";

export interface BackendProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number;
  colorName?: string;
  storageGb?: number;
  mainImageUrl?: string;
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
  
  const mainImage =
    bp.variants && bp.variants.find((v) => v.mainImageUrl)?.mainImageUrl
      ? bp.variants.find((v) => v.mainImageUrl)!.mainImageUrl!
      : `/images/prod_${bp.slug.replace(/-/g, "")}.png`;

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
  try {
    const params: Record<string, string> = {};
    if (keyword) params.keyword = keyword;
    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;

    const response = await apiClient.get<BackendProductResponse[]>("/products", { params });
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(mapBackendProductToUI);
    }
  } catch (error) {
    console.warn("Could not fetch products from backend SQL API, using mock fallback:", error);
  }
  return mockProducts as Product[];
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<BackendProductResponse>(`/products/${slug}`);
    if (response.data) {
      return mapBackendProductToUI(response.data);
    }
  } catch (error) {
    console.warn(`Could not fetch product ${slug} from backend SQL API, using mock fallback:`, error);
  }
  
  const foundMock = mockProducts.find(
    (p) => p.name.toLowerCase().includes(slug.toLowerCase()) || p.id.toString() === slug
  );
  return (foundMock as Product) || null;
};
