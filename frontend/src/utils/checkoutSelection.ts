import type { CartItem } from "../types";

const CHECKOUT_SELECTED_IDS_KEY = "pinkphone_checkout_selected_ids";

export function saveCheckoutSelectedIds(ids: Array<string | number>): void {
  try {
    sessionStorage.setItem(
      CHECKOUT_SELECTED_IDS_KEY,
      JSON.stringify(ids.map((id) => String(id))),
    );
  } catch {
    // ignore storage errors
  }
}

export function clearCheckoutSelectedIds(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_SELECTED_IDS_KEY);
  } catch {
    // ignore
  }
}

export function getCheckoutSelectedIds(): string[] | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_SELECTED_IDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map(String);
  } catch {
    return null;
  }
}

/** Cart lines to charge/checkout. Falls back to full cart if no selection saved. */
export function getCheckoutCartItems(cart: CartItem[]): CartItem[] {
  const ids = getCheckoutSelectedIds();
  if (!ids) return cart;
  const idSet = new Set(ids);
  // A saved selection is authoritative. Falling back to the full cart when
  // ids do not match can charge unrelated items (notably during "Mua ngay",
  // while the newly-added line is still propagating through state).
  return cart.filter((item) => idSet.has(String(item.id)));
}
