import { apiClient } from "../../../api/client";
import { ReviewItem, ReturnRequestItem, WarrantyClaimItem } from "./afterSalesTypes";

const REVIEWS_KEY = "pinkphone_admin_aftersales_reviews_v1";
const CLAIMS_KEY = "pinkphone_admin_aftersales_claims_v1";
const RETURNS_KEY = "pinkphone_admin_aftersales_returns_v1";
const read = <T,>(key: string): T[] => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const write = <T,>(key: string, value: T[]) => localStorage.setItem(key, JSON.stringify(value));
const date = (value?: string) => value ? new Date(value).toLocaleString("vi-VN") : "—";

export const afterSalesService = {
  getReviews: () => read<ReviewItem>(REVIEWS_KEY),
  getWarrantyClaims: () => read<WarrantyClaimItem>(CLAIMS_KEY),
  getReturnRequests: () => read<ReturnRequestItem>(RETURNS_KEY),

  async fetchReviewsFromBackend() {
    const response = await apiClient.get<any>("/admin/reviews", { params: { size: 100 } });
    const content = response.data?.content || response.data?.items || [];
    const mapped: ReviewItem[] = content.map((item: any) => ({
      id: String(item.id),
      productName: item.productName || "Sản phẩm không còn tồn tại",
      variantName: item.variantName || undefined,
      sku: item.sku || "Không có SKU",
      image: item.imageUrl || undefined,
      customerName: item.customerName || "Khách hàng",
      customerEmail: item.customerEmail || "—",
      rating: item.rating || 0,
      title: item.title || undefined,
      comment: item.comment || "",
      createdAt: date(item.createdAt),
      status: item.status,
      rejectionReason: item.rejectionReason,
      moderatedBy: item.moderatedBy,
      moderatedAt: item.moderatedAt ? date(item.moderatedAt) : undefined,
    }));
    write(REVIEWS_KEY, mapped);
    return mapped;
  },

  async approveReview(id: string) { await apiClient.post(`/admin/reviews/${id}/approve`); return this.fetchReviewsFromBackend(); },
  async rejectReview(id: string, reason: string) { await apiClient.post(`/admin/reviews/${id}/reject`, { rejectionReason: reason }); return this.fetchReviewsFromBackend(); },

  async fetchWarrantyClaimsFromBackend() {
    const response = await apiClient.get<any[]>("/admin/warranty-claims");
    const mapped: WarrantyClaimItem[] = (Array.isArray(response.data) ? response.data : []).map((item) => ({
      id: String(item.id), claimCode: item.claimCode, customerName: item.customerName || "Khách hàng",
      customerPhone: item.customerPhone || "—", serialImei: item.serialImei || "—", productName: item.productName || "—",
      status: item.status, createdAt: date(item.createdAt), issueDescription: item.issueDescription, resolution: item.resolution,
    }));
    write(CLAIMS_KEY, mapped); return mapped;
  },

  async fetchReturnRequestsFromBackend() {
    const response = await apiClient.get<any[]>("/admin/return-requests");
    const mapped: ReturnRequestItem[] = (Array.isArray(response.data) ? response.data : []).map((item) => ({
      id: String(item.id), returnCode: item.returnCode, orderCode: item.orderCode || "—", requestDate: date(item.createdAt),
      customerName: item.customerName || "Khách hàng", customerPhone: item.customerPhone || "—", customerEmail: item.customerEmail || "—",
      productName: item.productName || "Sản phẩm trong đơn", quantity: item.quantity || 0, conditionNote: "—",
      originalPrice: Number(item.totalRefundAmount || 0), reasonTitle: "Yêu cầu đổi trả", reasonDetail: "—", status: item.status,
    }));
    write(RETURNS_KEY, mapped); return mapped;
  },

  async approveReturnRequest(id: string) { await apiClient.post(`/admin/return-requests/${id}/approve`); return this.fetchReturnRequestsFromBackend(); },
};
