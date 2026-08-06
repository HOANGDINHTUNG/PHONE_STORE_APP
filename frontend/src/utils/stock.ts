/** Low-stock threshold used across storefront stock UI. */
export const LOW_STOCK_THRESHOLD = 5;

export type StockTone = "ok" | "low" | "out" | "unknown";

export type StockSource = {
  id?: string | number | null;
  name?: string | null;
  stock?: number | null;
  outOfStock?: boolean | null;
  availableQuantity?: number | null;
  stockQuantity?: number | null;
  isAvailable?: boolean | null;
};

function toNonNegInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  }
  return null;
}

/**
 * Stable pseudo-stock when the public product API omits quantity.
 * Keeps UI consistent without requiring backend changes.
 */
function demoStockFromKey(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // Prefer in-stock range 3..48 for demo UX
  return ((hash >>> 0) % 46) + 3;
}

/**
 * Resolve display stock for a product/variant.
 * Priority: stock → availableQuantity → stockQuantity → outOfStock/isAvailable flags → demo fallback.
 */
export function resolveProductStock(source: StockSource | null | undefined): number {
  if (!source) return 0;

  const explicit =
    toNonNegInt(source.availableQuantity) ??
    toNonNegInt(source.stock) ??
    toNonNegInt(source.stockQuantity);

  if (explicit !== null) return explicit;
  if (source.outOfStock === true || source.isAvailable === false) return 0;

  return 0;
}

export function isOutOfStock(stock?: number | null, outOfStock?: boolean): boolean {
  if (outOfStock === true) return true;
  if (stock === undefined || stock === null) return false;
  return stock <= 0;
}

export function isLowStock(stock?: number | null): boolean {
  if (stock === undefined || stock === null) return false;
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

export function getStockTone(stock?: number | null, outOfStock?: boolean): StockTone {
  if (stock === undefined || stock === null) {
    return outOfStock ? "out" : "unknown";
  }
  if (stock <= 0 || outOfStock) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}

/** Short label for cards / badges: "Còn 12", "Sắp hết · 3", "Hết hàng" */
export function getStockShortLabel(stock?: number | null, outOfStock?: boolean): string {
  const tone = getStockTone(stock, outOfStock);
  if (tone === "out") return "Hết hàng";
  if (tone === "unknown") return "Liên hệ tồn";
  if (tone === "low") return `Sắp hết · ${stock}`;
  return `Còn ${stock}`;
}

/** Longer label for PDP / cart / checkout */
export function getStockDetailLabel(stock?: number | null, outOfStock?: boolean): string {
  const tone = getStockTone(stock, outOfStock);
  if (tone === "out") return "Hết hàng — tạm thời không thể đặt";
  if (tone === "unknown") return "Liên hệ để kiểm tra tồn kho";
  if (tone === "low") return `Chỉ còn ${stock} sản phẩm trong kho`;
  return `Còn ${stock} sản phẩm trong kho`;
}

/** Ensure product-like objects always carry stock + outOfStock for UI. */
export function withResolvedStock<T extends StockSource>(product: T): T & {
  stock: number;
  outOfStock: boolean;
} {
  const stock = resolveProductStock(product);
  return {
    ...product,
    stock,
    outOfStock: stock <= 0,
  };
}
