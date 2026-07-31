import { apiClient } from "./client";
import { User } from "../types";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role?: string;
  };
}

export const loginApi = async (
  emailOrPhone: string,
  password?: string
): Promise<User | null> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      username: emailOrPhone,
      email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
      password: password || "123456",
    });

    if (response.data && response.data.accessToken) {
      localStorage.setItem("pinkphone_token", response.data.accessToken);
      const u = response.data.user;
      return {
        id: u?.id,
        name: u?.fullName || emailOrPhone,
        email: u?.email || (emailOrPhone.includes("@") ? emailOrPhone : "user@example.com"),
        phone: u?.phone || (!emailOrPhone.includes("@") ? emailOrPhone : "0901234567"),
        token: response.data.accessToken,
      };
    }
  } catch (error) {
    console.warn("Backend auth login error, fallback to client auth:", error);
  }

  // Fallback mock login for client development
  const mockUser: User = {
    name: "Nguyễn Văn A",
    email: emailOrPhone.includes("@") ? emailOrPhone : "user@example.com",
    phone: !emailOrPhone.includes("@") ? emailOrPhone : "0901234567",
  };
  return mockUser;
};

export const registerApi = async (details: {
  fullName: string;
  phone: string;
  email?: string;
  password?: string;
  [key: string]: any;
}): Promise<User | null> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", {
      fullName: details.fullName,
      phone: details.phone,
      email: details.email || `${details.phone}@phone-store.local`,
      password: details.password || "123456",
    });

    if (response.data && response.data.accessToken) {
      localStorage.setItem("pinkphone_token", response.data.accessToken);
      const u = response.data.user;
      return {
        id: u?.id,
        name: u?.fullName || details.fullName,
        email: u?.email || details.email || "user@example.com",
        phone: u?.phone || details.phone,
        token: response.data.accessToken,
      };
    }
  } catch (error) {
    console.warn("Backend auth register error, fallback to client auth:", error);
  }

  const mockUser: User = {
    name: details.fullName,
    phone: details.phone,
    email: details.email || "user@example.com",
  };
  return mockUser;
};
