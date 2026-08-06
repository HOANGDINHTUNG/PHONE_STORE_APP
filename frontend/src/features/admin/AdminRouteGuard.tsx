import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useStore } from "../../context/StoreContext";

type AdminRouteGuardProps = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.adminPortal && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
