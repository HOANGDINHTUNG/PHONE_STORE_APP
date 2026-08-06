import { apiClient } from "./client";
import { Product } from "../types";
import { getDefaultProductImage } from "./productService";
import { resolveProductStock } from "../utils/stock";

export interface WishlistItemResponse {
  id: string;
  product: {
    id: string;
    slug?: string;
    name: string;
    sku?: string;
    price?: number;
    effectiveMinPrice?: number;
    compareAtPrice?: number;
    thumbnailUrl?: string;
    primaryImageUrl?: string;
    status?: string;
    isFeatured?: boolean;
    avgRating?: number;
    reviewCount?: number;
    brandName?: string;
    categoryName?: string;
  };
  addedAt?: string;
}

export const formatPriceVND = (price?: number): string => {
  if (price === undefined || price === null || isNaN(price)) return "";
  return price.toLocaleString("vi-VN") + "₫";
};

export const mapWishlistItemToProduct = (item: WishlistItemResponse): Product => {
  const p = (item && item.product) ? item.product : (item as any);

  let imageUrl = p.primaryImageUrl || p.thumbnailUrl;
  if (!imageUrl || imageUrl.trim() === "" || imageUrl.includes("placeholder.png")) {
    imageUrl = getDefaultProductImage(p.brandName, p.slug || p.name, p.name);
  }

  const rawPrice = p.effectiveMinPrice ?? p.price ?? (p as any).minPrice;
  const rawCompare = p.compareAtPrice ?? (p as any).maxPrice;

  const formattedPrice = rawPrice ? formatPriceVND(rawPrice) : "Liên hệ";
  const stock = resolveProductStock({
    id: p.id,
    name: p.name,
    stock: (p as any).stock ?? (p as any).availableQuantity,
    isAvailable: (p as any).isAvailable ?? (p.status ? p.status === "ACTIVE" : undefined),
    outOfStock: (p as any).outOfStock,
  });

  return {
    id: p.id,
    name: p.name || "Sản phẩm",
    brand: p.brandName,
    category: p.categoryName,
    image: imageUrl,
    price: formattedPrice,
    newPrice: formattedPrice,
    oldPrice: rawCompare ? formatPriceVND(rawCompare) : undefined,
    rating: p.avgRating ?? 5.0,
    reviewsCount: p.reviewCount ?? 0,
    slug: p.slug,
    stock,
    availableQuantity: stock,
    outOfStock: stock <= 0,
  };
};

export const fetchWishlist = async (page = 1, size = 50): Promise<Product[]> => {
  try {
    const response = await apiClient.get("/me/wishlist-items", {
      params: { page, size },
    });
    if (response.data) {
      const rawItems: WishlistItemResponse[] = Array.isArray(response.data.items)
        ? response.data.items
        : Array.isArray(response.data)
          ? response.data
          : [];
      return rawItems.map(mapWishlistItemToProduct);
    }
  } catch (error) {
    console.warn("Error fetching wishlist from DB:", error);
  }
  return [];
};

export const addToWishlistApi = async (productId: string | number): Promise<boolean> => {
  try {
    await apiClient.post("/me/wishlist-items", { productId });
    return true;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return false;
  }
};

export const removeFromWishlistApi = async (productId: string | number): Promise<boolean> => {
  try {
    await apiClient.delete(`/me/wishlist-items/${productId}`);
    return true;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return false;
  }
};

export const clearWishlistApi = async (): Promise<boolean> => {
  try {
    await apiClient.delete("/me/wishlist-items");
    return true;
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return false;
  }
};
