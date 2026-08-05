import { apiClient } from "./client";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  badgeText?: string;
  description?: string;
  type: "PERCENT" | "AMOUNT";
  discountValue: number;
  appliesToAll: boolean;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  startTime: string;
  endTime: string;
  perCustomerLimit?: number;
  totalUsageLimit?: number;
  minMembershipTier?: string;
  isStackable?: boolean;
  isFeatured?: boolean;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  usedCount: number;
  brandIds?: string[];
  categoryIds?: string[];
  productIds?: string[];

  // Dynamic context
  isClaimed?: boolean;
  isEligible?: boolean;
  ineligibilityReason?: string;
  estimatedSavings?: number;
  isBestVoucher?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VoucherAnalytics {
  totalVouchersCount: number;
  activeVouchersCount: number;
  totalRedemptionsCount: number;
  totalDiscountAmountIssued: number;
  totalVoucherDrivenRevenue: number;
}

export const voucherService = {
  // Public
  getFeaturedVouchers: async (): Promise<Voucher[]> => {
    try {
      const res = await apiClient.get<Voucher[]>("/vouchers/public/featured");
      return res.data;
    } catch {
      return [];
    }
  },

  getProductVouchers: async (productId: string): Promise<Voucher[]> => {
    try {
      const res = await apiClient.get<Voucher[]>(`/vouchers/public/product/${productId}`);
      return res.data;
    } catch {
      return [];
    }
  },

  // Customer Wallet
  claimVoucher: async (voucherId: string): Promise<Voucher> => {
    const res = await apiClient.post<Voucher>(`/vouchers/${voucherId}/claim`);
    return res.data;
  },

  getMyWalletVouchers: async (status?: string, page = 0, size = 20): Promise<{ content: Voucher[]; totalElements: number }> => {
    try {
      const res = await apiClient.get(`/vouchers/me`, {
        params: { status, page, size }
      });
      return res.data;
    } catch {
      return { content: [], totalElements: 0 };
    }
  },

  // Cart
  applyVoucher: async (code: string): Promise<any> => {
    const res = await apiClient.post(`/vouchers/cart/apply`, null, {
      params: { code }
    });
    return res.data;
  },

  removeVoucher: async (): Promise<any> => {
    const res = await apiClient.delete(`/vouchers/cart/remove`);
    return res.data;
  },

  // Admin
  getAdminVouchers: async (code?: string, status?: string, page = 0, size = 10): Promise<{ content: Voucher[]; totalElements: number }> => {
    const res = await apiClient.get(`/admin/coupons`, {
      params: { code, status, page, size }
    });
    return res.data;
  },

  createVoucher: async (data: any): Promise<Voucher> => {
    const res = await apiClient.post<Voucher>(`/admin/coupons`, data);
    return res.data;
  },

  updateVoucher: async (id: string, data: any): Promise<Voucher> => {
    const res = await apiClient.patch<Voucher>(`/admin/coupons/${id}`, data);
    return res.data;
  },

  updateVoucherStatus: async (id: string, status: string): Promise<Voucher> => {
    const res = await apiClient.patch<Voucher>(`/admin/coupons/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  getAnalytics: async (): Promise<VoucherAnalytics> => {
    try {
      const res = await apiClient.get<VoucherAnalytics>(`/admin/coupons/analytics`);
      return res.data;
    } catch {
      return {
        totalVouchersCount: 0,
        activeVouchersCount: 0,
        totalRedemptionsCount: 0,
        totalDiscountAmountIssued: 0,
        totalVoucherDrivenRevenue: 0
      };
    }
  },

  exportVouchers: async (): Promise<Blob> => {
    const res = await apiClient.get(`/admin/coupons/export`, {
      responseType: "blob"
    });
    return res.data;
  }
};
