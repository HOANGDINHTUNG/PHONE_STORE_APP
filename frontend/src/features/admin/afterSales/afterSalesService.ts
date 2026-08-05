import {
  ReviewItem,
  ReturnRequestItem,
  WarrantyClaimItem,
} from "./afterSalesTypes";

// Initial Mock Reviews (Matching Image 1)
const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    productName: "iPhone 15 Pink 128GB",
    sku: "IP15-P-128",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15_3.png",
    customerName: "Nguyễn Văn A",
    customerEmail: "user@email.com",
    rating: 5,
    comment:
      "Màu hồng bên ngoài cực kỳ đẹp, giao hàng siêu nhanh. Đóng gói cẩn thận. Rất hài lòng...",
    createdAt: "24/10/2023 14:30",
    status: "PENDING",
  },
  {
    id: "rev-2",
    productName: "AirPods Pro 2",
    sku: "AP-PRO2",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c.png",
    customerName: "Trần Thị B",
    customerEmail: "tran.b@email.com",
    rating: 1,
    comment: "Hàng lỗi, sạc không vào điện. Shop lừa đảo bán hàng giả!!!",
    createdAt: "23/10/2023 09:15",
    status: "PENDING",
  },
  {
    id: "rev-3",
    productName: "Ốp lưng trong suốt",
    sku: "CASE-CLR-15",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/case-iphone-15.png",
    customerName: "Lê Hữu C",
    customerEmail: "lehuuc@email.com",
    rating: 4,
    comment: "Dùng tạm ổn, đúng với giá tiền.",
    createdAt: "22/10/2023 18:00",
    status: "APPROVED",
    moderatedBy: "Admin1",
  },
];

// Initial Mock Warranty Claims (Matching Image 2)
const INITIAL_WARRANTY_CLAIMS: WarrantyClaimItem[] = [
  {
    id: "wr-1",
    claimCode: "WR-2023-8901",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    serialImei: "IMEI-849302849",
    productName: "iPhone 14 Pro Max 256GB",
    status: "INSPECTING",
    createdAt: "24/10/2023 14:30",
    issueDescription: "Máy bị rè loa thoại khi nghe gọi.",
  },
  {
    id: "wr-2",
    claimCode: "WR-2023-8895",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    serialImei: "SN-998822A",
    productName: "Samsung Galaxy S23 Ultra",
    status: "WAITING_PARTS",
    createdAt: "23/10/2023 09:15",
    issueDescription: "Màn hình chớp tắt, đang chờ linh kiện thay thế.",
  },
  {
    id: "wr-3",
    claimCode: "WR-2023-8870",
    customerName: "Lê Văn C",
    customerPhone: "0912345678",
    serialImei: "IMEI-77665544",
    productName: "AirPods Pro Gen 2",
    status: "COMPLETED",
    createdAt: "20/10/2023 16:45",
    issueDescription: "Pin tai trái chai nhanh. Đã thay mới tai trái.",
  },
  {
    id: "wr-4",
    claimCode: "WR-2023-8865",
    customerName: "Phạm Thị D",
    customerPhone: "0933445566",
    serialImei: "SN-MAC12345",
    productName: 'MacBook Pro M2 14"',
    status: "SUBMITTED",
    createdAt: "19/10/2023 11:20",
    issueDescription: "Bàn phím bị kẹt phím Space.",
  },
  {
    id: "wr-5",
    claimCode: "WR-2023-8850",
    customerName: "Hoàng Văn E",
    customerPhone: "0977889900",
    serialImei: "IMEI-11223344",
    productName: "Oppo Find N3 Flip",
    status: "REJECTED",
    createdAt: "18/10/2023 15:10",
    issueDescription: "Vào nước - Từ chối bảo hành theo quy định.",
  },
];

// Initial Mock Return Requests (Matching Image 3)
const INITIAL_RETURN_REQUESTS: ReturnRequestItem[] = [
  {
    id: "ret-1",
    returnCode: "RET-2023-0891",
    orderCode: "ORD-55219-X",
    requestDate: "15/10/2023 14:30",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyen.vana@email.com",
    productName: "iPhone 14 Pro Max 256GB - Tím",
    quantity: 1,
    serialImei: "356789123456789",
    conditionNote: "Đã khui seal",
    originalPrice: 29990000,
    reasonTitle: "Lỗi kỹ thuật - Màn hình hở sáng",
    reasonDetail:
      "Khách báo máy bị hở sáng viền bên trái khi bật màn hình nền đen trong phòng tối. Có kèm video quay lại.",
    evidenceImages: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80",
    ],
    status: "PENDING",
    technicianNote: "",
  },
  {
    id: "ret-2",
    returnCode: "RET-2023-0890",
    orderCode: "ORD-55102-Y",
    requestDate: "14/10/2023 11:00",
    customerName: "Trần Thị B",
    customerPhone: "0987654321",
    customerEmail: "tran.b@email.com",
    productName: "Samsung Galaxy S23 Ultra (x1)",
    quantity: 1,
    serialImei: "359876543210987",
    conditionNote: "Còn nguyên seal",
    originalPrice: 26500000,
    reasonTitle: "Khách đổi ý muốn đổi màu sắc",
    reasonDetail: "Khách chưa bóc tem seal, muốn đổi sang màu Xám Titan.",
    status: "PENDING",
  },
  {
    id: "ret-3",
    returnCode: "RET-2023-0888",
    orderCode: "ORD-54988-Z",
    requestDate: "12/10/2023 09:30",
    customerName: "Lê Hoàng C",
    customerPhone: "0912345678",
    customerEmail: "lehoangc@email.com",
    productName: "AirPods Pro 2 (x1)",
    quantity: 1,
    serialImei: "SN-AP2-9988",
    conditionNote: "Đã khui seal",
    originalPrice: 5200000,
    reasonTitle: "Sạc không vào điện",
    reasonDetail: "Hộp sạc không nhận dòng điện từ cáp USB-C.",
    status: "APPROVED",
    technicianNote: "Đã kiểm tra xác nhận dock sạc hỏng nguồn.",
  },
];

const REVIEWS_KEY = "pinkphone_admin_aftersales_reviews_v1";
const CLAIMS_KEY = "pinkphone_admin_aftersales_claims_v1";
const RETURNS_KEY = "pinkphone_admin_aftersales_returns_v1";

export const afterSalesService = {
  // Reviews
  getReviews(): ReviewItem[] {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  },

  approveReview(id: string): ReviewItem[] {
    const list = this.getReviews();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = "APPROVED";
      list[idx].moderatedBy = "Admin1";
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
    }
    return list;
  },

  rejectReview(id: string, reason: string): ReviewItem[] {
    const list = this.getReviews();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = "REJECTED";
      list[idx].rejectionReason = reason;
      list[idx].moderatedBy = "Admin1";
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
    }
    return list;
  },

  // Warranty Claims
  getWarrantyClaims(): WarrantyClaimItem[] {
    try {
      const raw = localStorage.getItem(CLAIMS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(INITIAL_WARRANTY_CLAIMS));
    return INITIAL_WARRANTY_CLAIMS;
  },

  createWarrantyClaim(claim: Omit<WarrantyClaimItem, "id" | "claimCode" | "createdAt">): WarrantyClaimItem {
    const list = this.getWarrantyClaims();
    const nextNum = 8902 + list.length;
    const claimCode = `WR-2023-${nextNum}`;
    const newClaim: WarrantyClaimItem = {
      ...claim,
      id: `wr-${Date.now()}`,
      claimCode,
      createdAt: new Date().toLocaleString("vi-VN"),
    };
    list.unshift(newClaim);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(list));
    return newClaim;
  },

  // Return Requests
  getReturnRequests(): ReturnRequestItem[] {
    try {
      const raw = localStorage.getItem(RETURNS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    localStorage.setItem(RETURNS_KEY, JSON.stringify(INITIAL_RETURN_REQUESTS));
    return INITIAL_RETURN_REQUESTS;
  },

  updateReturnRequestStatus(
    id: string,
    status: ReturnRequestItem["status"],
    technicianNote?: string
  ): ReturnRequestItem[] {
    const list = this.getReturnRequests();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (technicianNote !== undefined) {
        list[idx].technicianNote = technicianNote;
      }
      localStorage.setItem(RETURNS_KEY, JSON.stringify(list));
    }
    return list;
  },
};
