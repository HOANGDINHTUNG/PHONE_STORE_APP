import { describe, expect, it } from "vitest";
import {
  getActiveHomeBanner,
  getBestSellingPhones,
  getProductDetailBySlug,
} from "./catalogSelectors";
import { catalogMockData } from "../data/catalogMockData";

describe("catalog selectors", () => {
  it("chỉ ánh xạ điện thoại đang hoạt động và sắp xếp theo lượt bán", () => {
    const phones = getBestSellingPhones();
    expect(phones).toHaveLength(15);
    expect(phones[0].slug).toBe("pinkphone-ultra-x-2024");
    expect(phones.every((phone) => phone.price.endsWith("đ"))).toBe(true);
  });

  it("tính giá, tồn kho và review đã duyệt theo variant", () => {
    const detail = getProductDetailBySlug("pinkphone-ultra-x-2024", "1003");
    expect(detail?.effectivePrice).toBe("32990000");
    expect(detail?.availableQuantity).toBe(0);
    expect(detail?.reviewCount).toBe(8);
    expect(detail?.rating).toBe(4.6);
  });

  it("đổi màu sẽ trả về đúng gallery của variant", () => {
    const pink = getProductDetailBySlug("pinkphone-ultra-x-2024", "1001");
    const black = getProductDetailBySlug("pinkphone-ultra-x-2024", "1004");
    expect(pink?.images).toHaveLength(2);
    expect(black?.images).toHaveLength(2);
    expect(pink?.images[0].image_url).not.toBe(black?.images[0].image_url);
    expect(black?.selectedVariant.color).toBe("Đen titan");
  });

  it("Ultra X có đủ tổ hợp màu, bộ nhớ, ảnh và thông số chi tiết", () => {
    const detail = getProductDetailBySlug("pinkphone-ultra-x-2024");
    expect(detail?.variants).toHaveLength(12);
    expect(new Set(detail?.variants.map((variant) => variant.color)).size).toBe(4);
    expect(new Set(detail?.variants.map((variant) => variant.storage)).size).toBe(3);
    expect(detail?.specifications.length).toBeGreaterThanOrEqual(20);
    const ultraVariantIds = new Set(detail?.variants.map((variant) => variant.id));
    expect(catalogMockData.productImages.filter((image) => ultraVariantIds.has(image.product_variant_id))).toHaveLength(24);
  });

  it("lọc banner theo thời gian hoạt động", () => {
    expect(getActiveHomeBanner(new Date("2026-07-31T00:00:00+07:00"))?.position).toBe("HOME_HERO");
  });
});
