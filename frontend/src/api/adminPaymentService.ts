import { apiClient } from "./client";

export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "REFUNDED" | "CANCELLED" | "EXPIRED";
export type PaymentAttemptStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED";
export type RefundStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface PaymentAttempt {
  id: number;
  attemptNumber: number;
  method: string;
  providerCode: string;
  amount: number;
  status: PaymentAttemptStatus;
  providerTransactionId?: string;
  providerMessage?: string;
  createdAt: string;
}

export interface AdminPayment {
  id: number;
  orderCode: string;
  expectedAmount: number;
  paidAmount: number;
  refundedAmount: number;
  currency: string;
  status: PaymentStatus;
  latestMethod?: string;
  paidAt?: string;
  createdAt: string;
  attempts: PaymentAttempt[];
}

export interface AdminRefund {
  id: number;
  refundCode: string;
  paymentId: number;
  orderCode: string;
  returnCode?: string;
  amount: number;
  method: string;
  requesterName: string;
  status: RefundStatus;
  reason: string;
  createdAt: string;
}

export interface RefundSummary {
  pendingCount: number;
  pendingAmount: number;
  processingCount: number;
  processingAmount: number;
  completedTodayCount: number;
  completedTodayAmount: number;
  failedCount: number;
}

interface PagedResponse<T> {
  items: T[];
  page: { number: number; size: number; totalElements: number; totalPages: number };
}

export const adminPaymentService = {
  getPayments: (page = 1, size = 100) =>
    apiClient.get<PagedResponse<AdminPayment>>("/admin/payments", { params: { page, size } }).then((response) => response.data),
  getPayment: (id: string | number) =>
    apiClient.get<AdminPayment>(`/admin/payments/${id}`).then((response) => response.data),
  getRefunds: (page = 1, size = 100) =>
    apiClient.get<PagedResponse<AdminRefund>>("/admin/refunds", { params: { page, size } }).then((response) => response.data),
  getRefundSummary: () =>
    apiClient.get<RefundSummary>("/admin/refunds/summary").then((response) => response.data),
  approveRefund: (id: number) => apiClient.post(`/admin/refunds/${id}/approve`).then((response) => response.data),
  confirmManualRefund: (id: number) => apiClient.post(`/admin/refunds/${id}/confirm-manual`).then((response) => response.data),
};
