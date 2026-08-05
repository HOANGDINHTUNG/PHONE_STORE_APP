import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

type CustomerRouteGuardProps = {
  children: ReactNode;
};

/** Keeps an authenticated administrator in the back-office area. */
export function CustomerRouteGuard({ children }: CustomerRouteGuardProps) {
  const { user } = useStore();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
