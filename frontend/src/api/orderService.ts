import { apiClient } from "./client";

export type OrderItemResponse = {
  id: string;
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderResponse = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  status: string;
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
