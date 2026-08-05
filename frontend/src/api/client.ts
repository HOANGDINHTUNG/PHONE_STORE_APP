import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("pinkphone_token") ||
      sessionStorage.getItem("pinkphone_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          localStorage.getItem("pinkphone_refreshToken") ||
          sessionStorage.getItem("pinkphone_refreshToken");

        if (!refreshToken) {
          throw new Error("Phiên đăng nhập đã hết hạn.");
        }

        const refreshResponse = await axios.post(
          (import.meta.env.VITE_API_BASE_URL || "/api/v1") +
          "/auth/token/refresh",
          {},
          { withCredentials: true }, // Assuming refresh token might be in httpOnly cookie
        );
        const { accessToken } = refreshResponse.data;
        if (accessToken) {
          const tokenStorage = localStorage.getItem("pinkphone_refreshToken")
            ? localStorage
            : sessionStorage;
          tokenStorage.setItem("pinkphone_token", accessToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return apiClient(originalRequest);
        }
        throw new Error("Máy chủ không cấp access token mới.");
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("pinkphone_token");
        localStorage.removeItem("pinkphone_refreshToken");
        sessionStorage.removeItem("pinkphone_token");
        sessionStorage.removeItem("pinkphone_refreshToken");
        window.location.href = window.location.pathname.startsWith("/admin")
          ? "/admin/login"
          : "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
