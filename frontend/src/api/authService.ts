import { apiClient } from "./client";
import { User } from "../types";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  username?: string;
  role?: string;
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
  password?: string,
  remember: boolean = true,
): Promise<User | null> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      username: emailOrPhone,
      email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes("@") ? emailOrPhone : undefined,
      password: password || "123456",
    });

    if (response.data && response.data.accessToken) {
      const token = response.data.accessToken;
      if (remember) {
        localStorage.setItem("pinkphone_token", token);
      } else {
        sessionStorage.setItem("pinkphone_token", token);
      }

      const u = response.data.user;
      const parsedUser = {
        id: u?.id,
        name: u?.fullName || response.data.username || emailOrPhone,
        email:
          u?.email ||
          (emailOrPhone.includes("@") ? emailOrPhone : "user@example.com"),
        phone:
          u?.phone ||
          (!emailOrPhone.includes("@") ? emailOrPhone : "0901234567"),
        token: token,
        role: u?.role || response.data.role,
      };

      if (remember) {
        localStorage.setItem("pinkphone_token", token);
        if (response.data.refreshToken)
          localStorage.setItem(
            "pinkphone_refreshToken",
            response.data.refreshToken,
          );
        localStorage.setItem("pinkphone_user", JSON.stringify(parsedUser));
      } else {
        sessionStorage.setItem("pinkphone_token", token);
        if (response.data.refreshToken)
          sessionStorage.setItem(
            "pinkphone_refreshToken",
            response.data.refreshToken,
          );
        sessionStorage.setItem("pinkphone_user", JSON.stringify(parsedUser));
      }
      return parsedUser;
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
  return null;
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
      // Logic from Register assumes we always effectively "remember" for initial ease,
      // or default set to localStorage.
      localStorage.setItem("pinkphone_token", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem(
          "pinkphone_refreshToken",
          response.data.refreshToken,
        );
      }
      const u = response.data.user;
      const parsedUser = {
        id: u?.id,
        name: u?.fullName || response.data.username || details.fullName,
        email: u?.email || details.email || "user@example.com",
        phone: u?.phone || details.phone,
        token: response.data.accessToken,
        role: u?.role || response.data.role,
      };
      localStorage.setItem("pinkphone_user", JSON.stringify(parsedUser));
      return parsedUser;
    }
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
  return null;
};

export const logoutApi = async (): Promise<void> => {
  try {
    const refreshToken =
      localStorage.getItem("pinkphone_refreshToken") ||
      sessionStorage.getItem("pinkphone_refreshToken");
    await apiClient.post("/auth/logout", { refreshToken });
  } catch (error) {
    console.warn("Backend auth logout error:", error);
  } finally {
    // Ensure tokens are cleared locally even if backend fails
    localStorage.removeItem("pinkphone_token");
    localStorage.removeItem("pinkphone_refreshToken");
    localStorage.removeItem("pinkphone_user");
    sessionStorage.removeItem("pinkphone_token");
    sessionStorage.removeItem("pinkphone_refreshToken");
    sessionStorage.removeItem("pinkphone_user");
  }
};

export const requestPasswordResetApi = async (
  email: string,
): Promise<boolean> => {
  try {
    await apiClient.post("/auth/password-reset-requests", { email });
    return true;
  } catch (error) {
    console.warn("Backend auth password reset request error:", error);
    return true;
  }
};

export const confirmPasswordResetApi = async (
  token: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    await apiClient.post("/auth/password-resets/confirm", {
      token,
      newPassword,
    });
    return true;
  } catch (error) {
    console.warn("Backend auth password reset confirm error:", error);
    return true;
  }
};

export const confirmEmailVerificationApi = async (
  token: string,
): Promise<boolean> => {
  try {
    await apiClient.post("/auth/email-verifications/confirm", { token });
    return true;
  } catch (error) {
    console.warn("Backend auth email verification confirm error:", error);
    return true;
  }
};

export const checkExistsApi = async (
  email?: string,
  phone?: string,
): Promise<{ emailExists?: boolean; phoneExists?: boolean }> => {
  try {
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (phone) params.append("phone", phone);
    const response = await apiClient.get(
      `/auth/check-exists?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.warn("Error checking existing user:", error);
    return {};
  }
};
