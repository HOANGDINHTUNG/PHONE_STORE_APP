import { apiClient } from "./client";

export type CouponType = "PERCENT" | "AMOUNT";
export type CouponStatus = "ACTIVE" | "INACTIVE";

export interface AdminCoupon {
  id: string;
  code: string;
  name?: string;
  description?: string;
  type: CouponType;
  discountValue: number;
  appliesToAll: boolean;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  startTime: string;
  endTime: string;
  perCustomerLimit?: number;
  totalUsageLimit?: number;
  status: CouponStatus;
  usedCount: number;
}

export interface CouponUsage {
  id: string;
  orderCode: string;
  customerName: string;
  discountAmount: number;
  status: "RESERVED" | "CONSUMED" | "RELEASED";
  usedAt: string;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export type CouponPayload = Omit<AdminCoupon, "id" | "status" | "usedCount">;

export const adminCouponService = {
  getCoupons: (params?: Record<string, string | number>) => apiClient.get<SpringPage<AdminCoupon>>("/admin/coupons", { params }).then((response) => response.data),
  getCoupon: (id: string) => apiClient.get<AdminCoupon>(`/admin/coupons/${id}`).then((response) => response.data),
  createCoupon: (payload: CouponPayload) => apiClient.post<AdminCoupon>("/admin/coupons", payload).then((response) => response.data),
  updateCoupon: (id: string, payload: CouponPayload) => apiClient.patch<AdminCoupon>(`/admin/coupons/${id}`, payload).then((response) => response.data),
  updateStatus: (id: string, status: CouponStatus) => apiClient.patch<AdminCoupon>(`/admin/coupons/${id}/status`, undefined, { params: { status } }).then((response) => response.data),
  getUsages: (id: string, page = 0) => apiClient.get<SpringPage<CouponUsage>>(`/admin/coupons/${id}/usages`, { params: { page, size: 10, sort: "createdAt,desc" } }).then((response) => response.data),
};
