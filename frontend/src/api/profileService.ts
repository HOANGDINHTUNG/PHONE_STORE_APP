import { apiClient } from "./client";
import { User, Product } from "../types";

export const fetchProfile = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get("/me");
    if (response.data) {
      return {
        id: response.data.id,
        name: response.data.fullName,
        email: response.data.email,
        phone: response.data.phone,
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
    const response = await apiClient.get("/me/orders");
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn("Backend fetch orders error, fallback to mock:", error);
  }

  // Fallback mock orders
  return [
    {
      orderCode: "#ORD-MOCK-1",
      orderDate: new Date().toISOString(),
      totalAmount: 18200000,
      status: "COMPLETED",
      items: [
        {
          productName: "Mock Product",
          quantity: 1,
          price: 18200000,
        },
      ],
    },
  ];
};
