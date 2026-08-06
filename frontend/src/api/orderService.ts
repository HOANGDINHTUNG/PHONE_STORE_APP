import { apiClient } from "./client";

export type OrderItemResponse = {
  id: string;
  productId?: string;
  productVariantId?: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  color?: string;
  ram?: string;
  storage?: string;
  imageUrl?: string;
  warrantyMonths?: number;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
  totalPrice?: number;
  discountAmount?: number;
};

export type OrderResponse = {
  id: string;
  orderCode: string;
  customerId?: string;
  sourceChannel?: string;
  couponCode?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  customerName?: string;
  customerPhone?: string;
  shippingDetailAddress?: string;
  shippingWardName?: string;
  shippingDistrictName?: string;
  shippingProvinceName?: string;
  currency?: string;
  subtotalAmount?: number;
  subtotal?: number;
  shippingFee: number;
  discountAmount?: number;
  discountTotal?: number;
  grandTotalAmount?: number;
  total?: number;
  status: string;
  note?: string;
  createdAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  items: OrderItemResponse[];
};

export type CheckoutItemRequest = {
  productVariantId: string;
  quantity: number;
};

export type CheckoutRequest = {
  idempotencyKey: string;
  couponCode?: string;
  shippingAddressId?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  guestProvinceCode?: string;
  guestProvinceName?: string;
  guestDistrictCode?: string;
  guestDistrictName?: string;
  guestWardCode?: string;
  guestWardName?: string;
  guestDetailAddress?: string;
  note?: string;
  items?: CheckoutItemRequest[];
};

export type PaymentAttemptRequest = {
  method: "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";
};

export type PaymentAttemptResponse = {
  attemptId: string;
  method: string;
  redirectUrl: string;
};

export const checkoutApi = async (
  payload: CheckoutRequest,
): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>(
    "/orders/checkout",
    payload,
    {
      // If the user isn't logged in, they might have a guest cart token in localStorage
      headers: {
        "X-Guest-Cart-Token": localStorage.getItem("guestCartToken") || "",
      },
    },
  );
  return response.data;
};

export const createPaymentAttemptApi = async (
  orderCode: string,
  idempotencyKey: string,
  payload: PaymentAttemptRequest,
): Promise<PaymentAttemptResponse> => {
  const response = await apiClient.post<PaymentAttemptResponse>(
    `/orders/${orderCode}/payment-attempts`,
    payload,
    {
      headers: {
        "X-Idempotency-Key": idempotencyKey,
      },
    },
  );
  return response.data;
};

export type PagedResponse<T> = {
  items: T[];
  content?: T[];  // fallback alias
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export const getMyOrdersApi = async (
  page: number = 1,
  size: number = 10,
): Promise<PagedResponse<OrderResponse>> => {
  const response = await apiClient.get<PagedResponse<OrderResponse>>(
    `/me/orders?page=${page}&size=${size}`
  );
  return response.data;
};

export const getMyOrderApi = async (orderCode: string): Promise<OrderResponse> => {
  const response = await apiClient.get<OrderResponse>(`/me/orders/${orderCode}`);
  return response.data;
};

export const cancelMyOrderApi = async (
  orderId: string,
  reason: string,
): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>(
    `/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}`
  );
  return response.data;
};
