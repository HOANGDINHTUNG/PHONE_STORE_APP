import { apiClient } from "./client";
import { User, Product } from "../types";

export const fetchProfile = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get("/me");
    if (response.data) {
      return {
        id: response.data.id,
        name: response.data.fullName || response.data.username || "Khách Hàng",
        email: response.data.email,
        phone: response.data.phone,
        customerCode: response.data.customerCode,
        avatarUrl: response.data.avatarUrl,
      };
    }
  } catch (error) {
    console.warn("Backend profile error, fallback to mock:", error);
  }

  // Fallback
  return null;
};

export const fetchMyOrders = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get("/me/orders?page=1&size=100");
    if (response.data) {
      if (Array.isArray(response.data.items)) {
        return response.data.items;
      }
      if (Array.isArray(response.data.content)) {
        return response.data.content;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
    }
  } catch (error) {
    console.warn("Backend fetch orders error:", error);
  }

  return [];
};
