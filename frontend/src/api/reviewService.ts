import { apiClient } from "./client";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReviewEligibilityResponse = {
  orderItemId: string;
  productId: string;
  productName: string;
  imageUrl?: string | null;
  orderId: string;
  orderCompletedAt: string;
  hasReview: boolean;
  reviewId: string | null;
  reviewStatus: ReviewStatus | null;
};

export type ReviewResponse = {
  id: string;
  productId: string;
  orderItemId: string;
  productName?: string | null;
  imageUrl?: string | null;
  customerName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: ReviewStatus;
  rejectionReason: string | null;
  createdAt: string;
};

export type ReviewCreateRequest = {
  orderItemId: string;
  rating: number;
  title?: string;
  comment?: string;
};

export const getReviewEligibilitiesApi = async (): Promise<ReviewEligibilityResponse[]> => {
  const response = await apiClient.get<ReviewEligibilityResponse[]>("/me/review-eligibilities");
  return response.data;
};

export const getMyReviewsApi = async (): Promise<ReviewResponse[]> => {
  const response = await apiClient.get<ReviewResponse[]>("/me/reviews");
  return response.data;
};

export const createReviewApi = async (
  productId: string,
  payload: ReviewCreateRequest
): Promise<void> => {
  await apiClient.post(`/products/${productId}/reviews`, payload);
};
