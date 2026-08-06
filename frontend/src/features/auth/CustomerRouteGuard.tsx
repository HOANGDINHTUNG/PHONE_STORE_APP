import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

type CustomerRouteGuardProps = {
  children: ReactNode;
};

/** Keeps an authenticated administrator in the back-office area. */
export function CustomerRouteGuard({ children }: CustomerRouteGuardProps) {
  // Bỏ logic redirect ADMIN để tài khoản quản trị vẫn có thể truy cập trang chủ / storefront bình thường
  return <>{children}</>;
}
