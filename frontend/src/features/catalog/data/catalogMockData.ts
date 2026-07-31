import heroImage from "../../../assets/pinkphone-hero.png";
import productStrip from "../../../assets/phone-product-strip.png";
import ultraBlackBack from "../../../assets/products/ultra-x/ultra-x-black-back.png";
import ultraBlackFront from "../../../assets/products/ultra-x/ultra-x-black-front.png";
import ultraBlueBack from "../../../assets/products/ultra-x/ultra-x-blue-back.png";
import ultraBlueFront from "../../../assets/products/ultra-x/ultra-x-blue-front.png";
import ultraPinkBack from "../../../assets/products/ultra-x/ultra-x-pink-back.png";
import ultraPinkFront from "../../../assets/products/ultra-x/ultra-x-pink-front.png";
import ultraWhiteBack from "../../../assets/products/ultra-x/ultra-x-white-back.png";
import ultraWhiteFront from "../../../assets/products/ultra-x/ultra-x-white-front.png";
import type {
  CatalogMockDatabase,
  Product,
  ProductAttribute,
  ProductImage,
  ProductSpecification,
  ProductVariant,
  Review,
} from "../types/catalog";

type ProductSeed = Omit<Product, "category_id" | "publication_status">;

const phoneSeeds: ProductSeed[] = [
  ["101", "1", "PinkPhone Ultra X 2024", "pinkphone-ultra-x-2024", "Flagship với PinkDisplay 120Hz, camera AI 108MP và bốn màu hoàn thiện cao cấp.", "PinkPhone Ultra X kết hợp khung viền kim loại, mặt lưng kính nhám, hiệu năng AI và hệ thống camera chuyên nghiệp trong một thiết kế thanh lịch.", 28410, 1240],
  ["102", "2", "Samsung Galaxy S24 Ultra", "samsung-galaxy-s24-ultra", "Galaxy AI, bút S Pen và camera zoom quang học mạnh mẽ.", "Flagship Samsung dành cho công việc, sáng tạo và nhiếp ảnh di động.", 24120, 980],
  ["103", "3", "Xiaomi 14 Ultra", "xiaomi-14-ultra", "Cụm camera cao cấp và hiệu năng Snapdragon mạnh mẽ.", "Flagship Xiaomi tập trung vào trải nghiệm nhiếp ảnh chuyên nghiệp.", 19640, 830],
  ["104", "4", "OPPO Find X7 Ultra", "oppo-find-x7-ultra", "Thiết kế tinh tế, camera chân dung và sạc nhanh.", "Flagship OPPO cân bằng giữa thiết kế, camera và thời lượng pin.", 15200, 710],
  ["105", "5", "realme GT5 Pro", "realme-gt5-pro", "Hiệu năng cao với mức giá dễ tiếp cận.", "Điện thoại realme dành cho người dùng cần hiệu năng mạnh và pin bền.", 12180, 640],
  ["106", "6", "iPhone 15 Pro Max", "iphone-15-pro-max", "Khung titan, chip A17 Pro và camera telephoto 5x.", "Mẫu iPhone cao cấp với hiệu năng mạnh và hệ sinh thái ổn định.", 32500, 1180],
  ["107", "6", "iPhone 15", "iphone-15", "Dynamic Island, camera 48MP và thiết kế nhôm nhiều màu.", "iPhone cân bằng cho nhu cầu sử dụng hàng ngày và quay chụp.", 27800, 1050],
  ["108", "2", "Samsung Galaxy Z Flip6", "samsung-galaxy-z-flip6", "Thiết kế gập nhỏ gọn với Galaxy AI.", "Điện thoại gập thời trang với màn hình phụ tiện dụng.", 16800, 590],
  ["109", "2", "Samsung Galaxy A55 5G", "samsung-galaxy-a55-5g", "Khung kim loại, màn hình AMOLED và chống nước IP67.", "Smartphone tầm trung bền bỉ cho học tập và giải trí.", 18950, 870],
  ["110", "3", "Redmi Note 13 Pro+ 5G", "redmi-note-13-pro-plus-5g", "Camera 200MP và sạc nhanh 120W.", "Điện thoại tầm trung Xiaomi nổi bật về camera và tốc độ sạc.", 17400, 920],
  ["111", "4", "OPPO Reno12 Pro 5G", "oppo-reno12-pro-5g", "Chân dung AI và thân máy mỏng nhẹ.", "Reno12 Pro hướng tới người dùng yêu thích thiết kế và chụp chân dung.", 14300, 560],
  ["112", "5", "realme 12 Pro+ 5G", "realme-12-pro-plus-5g", "Camera tele tiềm vọng và thiết kế da cao cấp.", "Mẫu realme tầm trung chú trọng zoom quang học và thời lượng pin.", 13240, 510],
  ["113", "7", "Google Pixel 8 Pro", "google-pixel-8-pro", "Camera tính toán và trải nghiệm Android thuần khiết.", "Pixel cao cấp với các tính năng AI xử lý ảnh nổi bật.", 15990, 480],
  ["114", "7", "Google Pixel 8a", "google-pixel-8a", "Chip Tensor, camera Pixel và bảy năm cập nhật.", "Điện thoại nhỏ gọn với trải nghiệm phần mềm lâu dài.", 11800, 430],
  ["115", "1", "PinkPhone Air", "pinkphone-air", "Mỏng nhẹ, nhiều màu trẻ trung và pin dùng cả ngày.", "PinkPhone Air dành cho người dùng cần thiết kế thanh thoát và trải nghiệm mượt mà.", 16720, 760],
].map(([id, brand_id, name, slug, short_description, description, view_count, sold_count]) => ({
  id: String(id), brand_id: String(brand_id), name: String(name), slug: String(slug),
  short_description: String(short_description), description: String(description),
  view_count: Number(view_count), sold_count: Number(sold_count),
}));

const ultraColors = [
  { name: "Hồng cánh sen", code: "PNK" },
  { name: "Đen titan", code: "BLK" },
  { name: "Trắng ngọc trai", code: "WHT" },
  { name: "Xanh băng", code: "BLU" },
];
const ultraStorages = [
  { storage: "128GB", list: "32990000", sale: "28490000" },
  { storage: "256GB", list: "34990000", sale: "29990000" },
  { storage: "512GB", list: "37990000", sale: "32990000" },
];

const ultraVariants: ProductVariant[] = ultraColors.flatMap((color, colorIndex) =>
  ultraStorages.map((capacity, storageIndex) =>
    createVariant({
      id: String(1001 + colorIndex * 3 + storageIndex),
      productId: "101",
      sku: `PPU-X24-12-${capacity.storage.replace("GB", "")}-${color.code}`,
      color: color.name,
      ram: "12GB",
      storage: capacity.storage,
      listPrice: capacity.list,
      salePrice: capacity.sale,
      warrantyMonths: 24,
    }),
  ),
);

const regularVariantSeeds = [
  ["102", "SS-S24U", "Xám titan", "12GB", "256GB", "30990000", "26990000"], ["102", "SS-S24U", "Tím titan", "12GB", "512GB", "34990000", "29990000"],
  ["103", "XM-14U", "Đen", "16GB", "512GB", "29990000", "24490000"], ["103", "XM-14U", "Trắng", "16GB", "1TB", "32990000", "27490000"],
  ["104", "OP-FX7U", "Nâu", "16GB", "512GB", "28000000", "24500000"], ["104", "OP-FX7U", "Xanh biển", "16GB", "1TB", "30990000", "27500000"],
  ["105", "RM-GT5P", "Cam", "12GB", "256GB", "18990000", "15990000"], ["105", "RM-GT5P", "Đen", "16GB", "512GB", "21990000", "18490000"],
  ["106", "APL-15PM", "Titan tự nhiên", "8GB", "256GB", "34990000", "29490000"], ["106", "APL-15PM", "Titan xanh", "8GB", "512GB", "40990000", "35490000"],
  ["107", "APL-15", "Hồng", "6GB", "128GB", "22990000", "19990000"], ["107", "APL-15", "Xanh lá", "6GB", "256GB", "25990000", "22490000"],
  ["108", "SS-ZF6", "Xanh mint", "12GB", "256GB", "28990000", "23990000"], ["108", "SS-ZF6", "Vàng", "12GB", "512GB", "32990000", "26990000"],
  ["109", "SS-A55", "Xanh navy", "8GB", "128GB", "11990000", "9490000"], ["109", "SS-A55", "Lilac", "8GB", "256GB", "12990000", "10490000"],
  ["110", "XM-RN13P", "Đen", "8GB", "256GB", "10990000", "8990000"], ["110", "XM-RN13P", "Tím", "12GB", "512GB", "12990000", "10490000"],
  ["111", "OP-R12P", "Bạc", "12GB", "256GB", "18990000", "15990000"], ["111", "OP-R12P", "Nâu", "12GB", "512GB", "20990000", "17990000"],
  ["112", "RM-12P", "Be", "12GB", "256GB", "14990000", "12490000"], ["112", "RM-12P", "Xanh", "12GB", "512GB", "16990000", "14490000"],
  ["113", "GG-P8P", "Đen obsidian", "12GB", "128GB", "24990000", "21990000"], ["113", "GG-P8P", "Xanh bay", "12GB", "256GB", "27990000", "23990000"],
  ["114", "GG-P8A", "Xanh aloe", "8GB", "128GB", "13990000", "11990000"], ["114", "GG-P8A", "Đen", "8GB", "256GB", "15990000", "13490000"],
  ["115", "PPA", "Hồng phấn", "8GB", "128GB", "17990000", "15490000"], ["115", "PPA", "Trắng", "8GB", "256GB", "19990000", "17490000"],
] as const;

const regularVariants = regularVariantSeeds.map((seed, index) =>
  createVariant({
    id: String(2001 + index), productId: seed[0], sku: `${seed[1]}-${seed[4].replace("GB", "")}-${index + 1}`,
    color: seed[2], ram: seed[3], storage: seed[4], listPrice: seed[5], salePrice: seed[6], warrantyMonths: seed[0] === "106" || seed[0] === "107" ? 12 : 18,
  }),
);

const variants = [...ultraVariants, ...regularVariants];
const ultraGallery: Record<string, [string, string]> = {
  "Hồng cánh sen": [ultraPinkFront, ultraPinkBack],
  "Đen titan": [ultraBlackFront, ultraBlackBack],
  "Trắng ngọc trai": [ultraWhiteFront, ultraWhiteBack],
  "Xanh băng": [ultraBlueFront, ultraBlueBack],
};

const productImages: ProductImage[] = variants.flatMap((variant) => {
  if (variant.product_id === "101") {
    return ultraGallery[variant.color].map((imageUrl, index) => ({
      id: `${variant.id}-img-${index + 1}`, product_variant_id: variant.id, image_url: imageUrl,
      alt_text: `${variant.variant_name} - ${index === 0 ? "mặt trước" : "mặt lưng"}`,
      is_primary: index === 0, sort_order: index + 1,
    }));
  }
  return [{
    id: `${variant.id}-img-1`, product_variant_id: variant.id, image_url: productStrip,
    alt_text: variant.variant_name, is_primary: true, sort_order: 1,
    mock_sprite_index: (Number(variant.product_id) - 102) % 5,
  }];
});

const ultraSpecifications = specificationRows("101", [
  ["Màn hình", "Kích thước", "6.7 inch"], ["Màn hình", "Công nghệ", "PinkDisplay LTPO OLED"],
  ["Màn hình", "Độ phân giải", "2796 × 1290 pixels"], ["Màn hình", "Tần số quét", "1–120Hz thích ứng"],
  ["Màn hình", "Độ sáng tối đa", "2.000 nit"], ["Camera", "Camera sau", "108MP + 12MP góc rộng + 12MP tele"],
  ["Camera", "Camera trước", "32MP tự động lấy nét"], ["Camera", "Quay video", "4K 60fps, chống rung quang học"],
  ["Hiệu năng", "Chipset", "P14 Ultra AI Process"], ["Hiệu năng", "GPU", "PinkCore X8"],
  ["Hiệu năng", "RAM", "12GB LPDDR5X"], ["Hiệu năng", "Hệ điều hành", "PinkOS 4"],
  ["Pin & sạc", "Dung lượng pin", "5.000mAh"], ["Pin & sạc", "Sạc có dây", "45W PinkCharge"],
  ["Pin & sạc", "Sạc không dây", "25W"], ["Kết nối", "Mạng di động", "5G hai SIM, eSIM"],
  ["Kết nối", "Không dây", "Wi-Fi 7, Bluetooth 5.4, NFC"], ["Thiết kế", "Kháng nước", "IP68"],
  ["Thiết kế", "Kích thước", "161,2 × 75,4 × 8,1 mm"], ["Thiết kế", "Khối lượng", "218g"],
]);

const genericSpecifications = phoneSeeds.filter((product) => product.id !== "101").flatMap((product) =>
  specificationRows(product.id, [
    ["Màn hình", "Công nghệ", "AMOLED 120Hz"], ["Camera", "Camera chính", "50MP chống rung quang học"],
    ["Hiệu năng", "Kết nối", "5G, Wi-Fi 6, NFC"], ["Pin & sạc", "Dung lượng pin", "5.000mAh"],
  ]),
);

const ultraAttributes: ProductAttribute[] = [
  "PinkDisplay LTPO 120Hz siêu sáng", "Camera AI 108MP chống rung quang học", "Chip P14 Ultra hiệu năng cao",
  "Pin 5.000mAh và sạc nhanh 45W", "Kháng nước và bụi IP68", "Bốn màu hoàn thiện cao cấp",
].map((value, index) => ({ id: String(index + 1), product_id: "101", attribute_name: "Điểm nổi bật", attribute_value: value }));

const reviews: Review[] = [
  ["1", "501", "Nguyễn Văn An", 5, "Màu sắc rất đẹp", "Máy đẹp, màu hồng sang trọng đúng như hình. Camera chụp đêm tốt và nhân viên tư vấn nhiệt tình.", "APPROVED"],
  ["2", "502", "Trần Minh Anh", 4, "Hiệu năng tốt", "Màn hình sáng, thao tác mượt và pin đủ dùng cả ngày.", "APPROVED"],
  ["3", "503", "Lê Hoàng Minh", 5, "Camera ấn tượng", "Ảnh chân dung tự nhiên, chống rung khi quay video hoạt động rất tốt.", "APPROVED"],
  ["4", "504", "Phạm Thu Hà", 5, "Xanh băng rất tinh tế", "Màu xanh ngoài đời dịu và đẹp, máy cầm chắc tay.", "APPROVED"],
  ["5", "505", "Đỗ Quốc Bảo", 4, "Pin bền", "Dùng hỗn hợp hơn một ngày, sạc nhanh tiện lợi.", "APPROVED"],
  ["6", "506", "Vũ Ngọc Mai", 5, "Màn hình xuất sắc", "Màn hình sáng rõ ngoài trời và cuộn rất mượt.", "APPROVED"],
  ["7", "507", "Bùi Thành Nam", 4, "Máy ổn định", "Chuyển ứng dụng nhanh, loa tốt và không nóng nhiều.", "APPROVED"],
  ["8", "508", "Ngô Thanh Trúc", 5, "Đáng tiền", "Bản 256GB cân bằng tốt giữa dung lượng và giá.", "APPROVED"],
  ["9", "509", "Khách hàng mới", 3, "Đang chờ duyệt", "Review này không được phép tính vào điểm trung bình.", "PENDING"],
  ["10", "510", "Khách ẩn danh", 1, "Đang kiểm duyệt", "Nội dung chờ kiểm duyệt.", "PENDING"],
].map(([id, customerId, customerName, rating, title, comment, status], index) => ({
  id: String(id), customer_id: String(customerId), product_id: "101", order_item_id: `900${index + 1}`,
  customer_name: String(customerName), rating: Number(rating), title: String(title), comment: String(comment),
  status: status as Review["status"], created_at: `2026-07-${String(28 - index).padStart(2, "0")}T08:30:00+07:00`,
}));

const outOfStockVariantIds = new Set(["1003", "1012", "2008", "2027"]);

export const catalogMockData: CatalogMockDatabase = {
  categories: [{ id: "10", parent_id: null, name: "Điện thoại", slug: "dien-thoai", description: "Điện thoại thông minh chính hãng", status: "ACTIVE", sort_order: 1 }],
  brands: [
    ["1", "PinkPhone", "pinkphone", "Công nghệ mang dấu ấn riêng"], ["2", "Samsung", "samsung", "Điện thoại Samsung chính hãng"],
    ["3", "Xiaomi", "xiaomi", "Điện thoại Xiaomi chính hãng"], ["4", "OPPO", "oppo", "Điện thoại OPPO chính hãng"],
    ["5", "realme", "realme", "Điện thoại realme chính hãng"], ["6", "Apple", "apple", "iPhone chính hãng"],
    ["7", "Google Pixel", "google-pixel", "Điện thoại Pixel chính hãng"],
  ].map(([id, name, slug, description]) => ({ id, name, slug, logo_url: null, description, status: "ACTIVE" })),
  products: phoneSeeds.map((product) => ({ ...product, category_id: "10", publication_status: "ACTIVE" })),
  productVariants: variants,
  productImages,
  productSpecifications: [...ultraSpecifications, ...genericSpecifications],
  productAttributes: [
    ...ultraAttributes,
    ...phoneSeeds.filter((product) => product.id !== "101").flatMap((product, productIndex) =>
      ["Màn hình 120Hz", "Camera chống rung", "Pin dùng cả ngày"].map((value, index) => ({ id: `attr-${productIndex}-${index}`, product_id: product.id, attribute_name: "Điểm nổi bật", attribute_value: value })),
    ),
  ],
  warehouseInventories: variants.flatMap((variant, index) => {
    const unavailable = outOfStockVariantIds.has(variant.id);
    return [
      { warehouse_id: "HN01", product_variant_id: variant.id, on_hand_quantity: unavailable ? 0 : 12 + index % 10, reserved_quantity: unavailable ? 0 : 2, available_quantity: unavailable ? 0 : 10 + index % 10 },
      { warehouse_id: "HCM01", product_variant_id: variant.id, on_hand_quantity: unavailable ? 0 : 9 + index % 7, reserved_quantity: unavailable ? 0 : 1, available_quantity: unavailable ? 0 : 8 + index % 7 },
    ];
  }),
  reviews,
  relatedProducts: ["106", "102", "103", "113", "108", "104", "115", "107"].map((relatedId, index) => ({ product_id: "101", related_product_id: relatedId, sort_order: index + 1 })),
  banners: [{ id: "1", title: "Ultra X — sắc màu của công nghệ", image_url: heroImage, link_url: "/san-pham/pinkphone-ultra-x-2024", position: "HOME_HERO", sort_order: 1, starts_at: "2026-01-01T00:00:00+07:00", ends_at: null, status: "ACTIVE" }],
};

function createVariant(input: {
  id: string; productId: string; sku: string; color: string; ram: string; storage: string;
  listPrice: string; salePrice: string | null; warrantyMonths: number;
}): ProductVariant {
  return {
    id: input.id, product_id: input.productId, sku: input.sku,
    variant_name: `${input.ram}/${input.storage} - ${input.color}`, color: input.color,
    ram: input.ram, storage: input.storage, tracking_type: "QUANTITY",
    list_price: input.listPrice, sale_price: input.salePrice,
    warranty_months: input.warrantyMonths, status: "ACTIVE",
  };
}

function specificationRows(productId: string, rows: string[][]): ProductSpecification[] {
  return rows.map(([groupName, specName, specValue], index) => ({
    id: `${productId}-spec-${index + 1}`, product_id: productId,
    group_name: groupName, spec_name: specName, spec_value: specValue, sort_order: index + 1,
  }));
}
