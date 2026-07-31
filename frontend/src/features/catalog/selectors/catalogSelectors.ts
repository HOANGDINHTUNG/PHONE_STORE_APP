import { catalogMockData } from "../data/catalogMockData";
import type { Banner, ProductVariant } from "../types/catalog";

export type CatalogProductCard = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: string;
  oldPrice: string | null;
  storage: string;
  badge: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  imageAlt: string;
  imageIndex?: number;
  promotion?: string;
  inStock: boolean;
};

export type CatalogProductDetail = {
  product: (typeof catalogMockData.products)[number];
  brand: (typeof catalogMockData.brands)[number];
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  images: typeof catalogMockData.productImages;
  specifications: typeof catalogMockData.productSpecifications;
  attributes: typeof catalogMockData.productAttributes;
  reviews: typeof catalogMockData.reviews;
  relatedProducts: CatalogProductCard[];
  rating: number;
  reviewCount: number;
  availableQuantity: number;
  effectivePrice: string;
  discountPercent: number;
};

export function formatVnd(value: string | number): string {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))}đ`;
}

export function getEffectivePrice(variant: ProductVariant): string {
  return variant.sale_price ?? variant.list_price;
}

export function getAvailableQuantity(variantId: string): number {
  return catalogMockData.warehouseInventories
    .filter((inventory) => inventory.product_variant_id === variantId)
    .reduce((total, inventory) => total + inventory.available_quantity, 0);
}

export function getDiscountPercent(variant: ProductVariant): number {
  if (!variant.sale_price) return 0;
  return Math.round((1 - Number(variant.sale_price) / Number(variant.list_price)) * 100);
}

export function getActiveHomeBanner(now = new Date()): Banner | undefined {
  return catalogMockData.banners
    .filter((banner) => {
      if (banner.status !== "ACTIVE" || banner.position !== "HOME_HERO") return false;
      const starts = banner.starts_at ? new Date(banner.starts_at) : null;
      const ends = banner.ends_at ? new Date(banner.ends_at) : null;
      return (!starts || starts <= now) && (!ends || ends >= now);
    })
    .sort((a, b) => a.sort_order - b.sort_order)[0];
}

export function getActiveBrands() {
  const activeBrandIds = new Set(
    catalogMockData.products
      .filter((product) => product.publication_status === "ACTIVE")
      .map((product) => product.brand_id),
  );
  return catalogMockData.brands.filter(
    (brand) => brand.status === "ACTIVE" && activeBrandIds.has(brand.id),
  );
}

function getApprovedReviews(productId: string) {
  return catalogMockData.reviews.filter(
    (review) => review.product_id === productId && review.status === "APPROVED",
  );
}

function getRating(productId: string) {
  const reviews = getApprovedReviews(productId);
  const rating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;
  return { rating: Number(rating.toFixed(1)), reviewCount: reviews.length };
}

function toProductCard(productId: string): CatalogProductCard | null {
  const product = catalogMockData.products.find(
    (item) => item.id === productId && item.publication_status === "ACTIVE",
  );
  if (!product) return null;
  const brand = catalogMockData.brands.find(
    (item) => item.id === product.brand_id && item.status === "ACTIVE",
  );
  const variants = catalogMockData.productVariants.filter(
    (variant) => variant.product_id === product.id && variant.status === "ACTIVE",
  );
  const variant = variants.find((item) => getAvailableQuantity(item.id) > 0) ?? variants[0];
  if (!brand || !variant) return null;
  const image = catalogMockData.productImages
    .filter((item) => item.product_variant_id === variant.id)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)[0];
  if (!image) return null;
  const { rating, reviewCount } = getRating(product.id);
  const discount = getDiscountPercent(variant);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: brand.name,
    price: formatVnd(getEffectivePrice(variant)),
    oldPrice: variant.sale_price ? formatVnd(variant.list_price) : null,
    storage: `${variant.ram}/${variant.storage}`,
    badge: discount ? `Giảm ${discount}%` : "Chính hãng",
    rating,
    reviewCount,
    imageUrl: image.image_url,
    imageAlt: image.alt_text,
    imageIndex: image.mock_sprite_index,
    promotion: variant.warranty_months >= 18 ? `Bảo hành ${variant.warranty_months} tháng` : undefined,
    inStock: getAvailableQuantity(variant.id) > 0,
  };
}

export function getBestSellingPhones(): CatalogProductCard[] {
  return [...catalogMockData.products]
    .filter((product) => product.publication_status === "ACTIVE")
    .sort((a, b) => b.sold_count - a.sold_count)
    .map((product) => toProductCard(product.id))
    .filter((product): product is CatalogProductCard => Boolean(product));
}

export function getProductDetailBySlug(
  slug: string,
  selectedVariantId?: string,
): CatalogProductDetail | null {
  const product = catalogMockData.products.find(
    (item) => item.slug === slug && item.publication_status === "ACTIVE",
  );
  if (!product) return null;
  const brand = catalogMockData.brands.find(
    (item) => item.id === product.brand_id && item.status === "ACTIVE",
  );
  const variants = catalogMockData.productVariants.filter(
    (variant) => variant.product_id === product.id && variant.status === "ACTIVE",
  );
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  if (!brand || !selectedVariant) return null;
  const relationIds = catalogMockData.relatedProducts
    .filter((relation) => relation.product_id === product.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((relation) => relation.related_product_id);
  const relatedProducts = relationIds
    .map(toProductCard)
    .filter((item): item is CatalogProductCard => Boolean(item));
  const { rating, reviewCount } = getRating(product.id);
  return {
    product,
    brand,
    variants,
    selectedVariant,
    images: catalogMockData.productImages
      .filter((image) => image.product_variant_id === selectedVariant.id)
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order),
    specifications: catalogMockData.productSpecifications
      .filter((specification) => specification.product_id === product.id)
      .sort((a, b) => a.sort_order - b.sort_order),
    attributes: catalogMockData.productAttributes.filter(
      (attribute) => attribute.product_id === product.id,
    ),
    reviews: getApprovedReviews(product.id),
    relatedProducts,
    rating,
    reviewCount,
    availableQuantity: getAvailableQuantity(selectedVariant.id),
    effectivePrice: getEffectivePrice(selectedVariant),
    discountPercent: getDiscountPercent(selectedVariant),
  };
}
