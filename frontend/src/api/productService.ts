import { apiClient } from "./client";
import { Product } from "../types";
import { products as mockProducts } from "../mock/products";
import { resolveProductStock, withResolvedStock } from "../utils/stock";

export interface BackendProductImage {
  id?: string;
  imageUrl: string;
  isPrimary?: boolean;
  altText?: string;
}

export interface BackendProductVariant {
  id: string;
  sku: string;
  price?: number;
  listPrice?: number;
  salePrice?: number;
  colorName?: string;
  color?: string;
  storageGb?: number;
  ramGb?: number;
  mainImageUrl?: string;
  images?: BackendProductImage[];
  availableQuantity?: number;
  warehouseStocks?: Array<{
    warehouseId: string;
    warehouseName: string;
    availableQuantity: number;
  }>;
  /** Legacy stock fields */
  stock?: number;
  availableQuantity?: number;
  stockQuantity?: number;
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
  /** Optional stock fields if API ever exposes them */
  stock?: number;
  availableQuantity?: number;
  stockQuantity?: number;
  outOfStock?: boolean;
  isAvailable?: boolean;
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

export const getDefaultProductImage = (brandName?: string, slug?: string, name?: string): string => {
  const brand = (brandName || "").toLowerCase();
  const s = ((slug || "") + " " + (name || "")).toLowerCase();

  if (s.includes("16 pro max") || s.includes("pro-max")) {
    return "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-titan-den.png";
  }
  if (s.includes("16 pro")) {
    return "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-tu-nhien.png";
  }
  if (brand.includes("apple") || s.includes("iphone")) return "/images/prod_iphone15.png";
  if (
    brand.includes("samsung") ||
    s.includes("samsung") ||
    s.includes("galaxy") ||
    s.includes("s24") ||
    s.includes("z-fold") ||
    s.includes("z-flip") ||
    s.includes("a55")
  ) {
    return "/images/prod_s24.png";
  }
  if (brand.includes("xiaomi") || s.includes("xiaomi") || s.includes("redmi")) {
    return "/images/prod_xiaomi14.png";
  }
  if (brand.includes("oppo") || s.includes("oppo") || s.includes("find") || s.includes("reno")) {
    return "/images/prod_oppofind.png";
  }
  if (brand.includes("realme") || s.includes("realme")) return "/images/prod_realmegt.png";

  return "/images/prod_iphone15.png";
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
    mainImage = getDefaultProductImage(bp.brandName, bp.slug);
  }

  const mappedVariants = (bp.variants || []).map((v) => {
    let img = v.mainImageUrl;
    if (!img && v.images && v.images.length > 0) {
      const primaryImg = v.images.find((i) => i.isPrimary);
      img = primaryImg ? primaryImg.imageUrl : v.images[0].imageUrl;
    }
    if (!img) img = mainImage;

    const listP = v.listPrice ?? v.price ?? 0;
    const saleP = v.salePrice && v.salePrice > 0 ? v.salePrice : listP;
    const variantStock = resolveProductStock({
      id: v.id,
      name: v.sku || bp.name,
      stock: v.stock,
      availableQuantity: v.availableQuantity,
      stockQuantity: v.stockQuantity,
    });

    return {
      id: v.id,
      sku: v.sku,
      name: v.colorName || v.color || bp.name,
      color: v.colorName || v.color,
      storageGb: v.storageGb,
      ramGb: v.ramGb,
      price: formatCurrency(saleP),
      newPrice: formatCurrency(saleP),
      oldPrice: listP > saleP ? formatCurrency(listP) : undefined,
      image: img,
      stock: variantStock,
      warehouseStocks: v.warehouseStocks,
    };
  });

  // Prefer product-level stock; else sum of variant stocks; else stable demo stock
  const productLevelStock =
    bp.stock ?? bp.availableQuantity ?? bp.stockQuantity;
  let stock: number;
  if (productLevelStock !== undefined && productLevelStock !== null) {
    stock = resolveProductStock({
      id: bp.id,
      name: bp.name,
      stock: productLevelStock,
      outOfStock: bp.outOfStock,
      isAvailable: bp.isAvailable,
    });
  } else if (mappedVariants.length > 0) {
    stock = mappedVariants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  } else {
    stock = resolveProductStock({
      id: bp.id,
      name: bp.name,
      outOfStock: bp.outOfStock,
      isAvailable: bp.isAvailable,
    });
  }

  return {
    id: bp.id,
    name: bp.name,
    brand: bp.brandName || "PinkPhone",
    category: (bp.categoryName || "iphone").toLowerCase(),
    image: mainImage,
    newPrice: formatCurrency(minP),
    oldPrice: maxP > minP ? formatCurrency(maxP) : undefined,
    badge: (maxP > minP && maxP > 0) ? `GIẢM ${Math.round(((maxP - minP) / maxP) * 100)}%` : "GIẢM 20%",
    badgeType: "sale",
    gift: "Tặng kèm phụ kiện chính hãng",
    rating: 5,
    reviewsCount: 12,
    slug: bp.slug,
    description: bp.description,
    variants: mappedVariants,
    stock,
    availableQuantity: stock,
    outOfStock: stock <= 0,
  };
};

export const fetchProducts = async (
  keyword?: string,
  categoryId?: string,
  brandId?: string
): Promise<Product[]> => {
  if (USE_MOCK) {
    return (mockProducts as Product[]).map((p) => withResolvedStock(p));
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
      (p) =>
        p.slug === slug ||
        p.name.toLowerCase().includes(slug.toLowerCase()) ||
        p.id.toString() === slug
    );
    return foundMock ? withResolvedStock(foundMock as Product) : null;
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

/** Related products for PDP recommendations (uses existing public endpoint). */
export const fetchRelatedProducts = async (slug: string): Promise<Product[]> => {
  if (USE_MOCK) {
    return (mockProducts as Product[])
      .filter((p) => p.slug !== slug)
      .slice(0, 4)
      .map((p) => withResolvedStock(p));
  }
  try {
    const response = await apiClient.get<
      Array<{
        id: string;
        name: string;
        slug: string;
        brandName?: string;
        categoryName?: string;
        primaryImageUrl?: string;
        effectiveMinPrice?: number;
        effectiveMaxPrice?: number;
        isAvailable?: boolean;
        saleableVariantCount?: number;
        availableQuantity?: number;
        stock?: number;
        availableQuantity?: number;
      }>
    >(`/products/${slug}/related-products`);

    const items = Array.isArray(response.data) ? response.data : [];
    if (items.length === 0) {
      // Fallback: top products excluding current
      const all = await fetchProducts();
      return all.filter((p) => p.slug !== slug).slice(0, 4);
    }

    return items.map((card) => {
      const stock = resolveProductStock({
        id: card.id,
        name: card.name,
        stock: card.availableQuantity ?? card.stock,
        availableQuantity: card.availableQuantity,
        isAvailable: card.isAvailable,
      });
      const minP = card.effectiveMinPrice;
      const maxP = card.effectiveMaxPrice;
      return {
        id: card.id,
        name: card.name,
        brand: card.brandName || "PinkPhone",
        category: (card.categoryName || "").toLowerCase(),
        image:
          card.primaryImageUrl ||
          getDefaultProductImage(card.brandName, card.slug, card.name),
        newPrice: formatCurrency(minP),
        oldPrice: maxP && minP && maxP > minP ? formatCurrency(maxP) : undefined,
        slug: card.slug,
        stock,
        outOfStock: stock <= 0,
        rating: 5,
        reviewsCount: 0,
      } as Product;
    });
  } catch (error) {
    console.warn("Related products unavailable, using catalog fallback:", error);
    try {
      const all = await fetchProducts();
      return all.filter((p) => p.slug !== slug).slice(0, 4);
    } catch {
      return [];
    }
  }
};
