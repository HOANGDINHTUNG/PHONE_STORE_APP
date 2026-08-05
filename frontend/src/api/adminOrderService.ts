import { apiClient } from "./client";

export type AdminOrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED" | "PARTIALLY_RETURNED" | "RETURNED";

export interface AdminOrderItem {
  id: string;
  productName: string;
  variantName?: string;
  sku?: string;
  color?: string;
  storage?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  discountAmount?: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  sourceChannel?: string;
  couponCode?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  shippingDetailAddress?: string;
  shippingWardName?: string;
  shippingDistrictName?: string;
  shippingProvinceName?: string;
  currency?: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  grandTotalAmount: number;
  status: AdminOrderStatus;
  note?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  items: AdminOrderItem[];
}

interface PagedOrders { items: AdminOrder[]; page: { number: number; size: number; totalElements: number; totalPages: number } }

export const adminOrderService = {
  getOrders: (page = 1, size = 100) => apiClient.get<PagedOrders>("/admin/orders", { params: { page, size } }).then((response) => response.data),
  getOrder: (id: string) => apiClient.get<AdminOrder>(`/admin/orders/${id}`).then((response) => response.data),
  confirm: (id: string) => apiClient.post(`/admin/orders/${id}/confirm`).then((response) => response.data),
  startProcessing: (id: string) => apiClient.post<AdminOrder>(`/admin/orders/${id}/start-processing`).then((response) => response.data),
  cancel: (id: string, reason: string) => apiClient.post<AdminOrder>(`/admin/orders/${id}/cancel`, undefined, { params: { reason } }).then((response) => response.data),
};
