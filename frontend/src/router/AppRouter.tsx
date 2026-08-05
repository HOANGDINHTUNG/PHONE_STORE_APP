import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { HomePage } from "../features/home/pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import VnpayReturn from "../pages/Checkout/VnpayReturn";
import { AccountOverviewPage } from "../features/account/pages/AccountOverviewPage";
import { OrderHistoryPage } from "../features/account/pages/OrderHistoryPage";
import { OrderTrackingPage } from "../features/account/pages/OrderTrackingPage";
import { WarrantyPage } from "../features/account/pages/WarrantyPage";
import { MembershipTierPage } from "../features/account/pages/MembershipTierPage";
import {
  ReturnsPage,
  NotificationsPage,
} from "../features/account/pages/AccountActivityPages";
import { VouchersPage } from "../features/account/pages/VouchersPage";
import { WishlistPage } from "../features/account/pages/WishlistPage";
import { AccountProfilePage } from "../features/account/pages/AccountProfilePage";
import { AccountAddressPage } from "../features/account/pages/AccountAddressPage";
import { WarrantyDetailPage } from "../features/account/pages/WarrantyDetailPage";
import { AccountSupportPage } from "../features/account/pages/AccountSupportPage";
import { AccountTermsPage } from "../features/account/pages/AccountTermsPage";
import { AccountReviewsPage } from "../features/account/pages/AccountReviewsPage";
import { AccountReviewsHistoryPage } from "../features/account/pages/AccountReviewsHistoryPage";
import { ReturnCreatePage } from "../features/account/pages/ReturnCreatePage";
import { ReturnDetailsPage } from "../features/account/pages/ReturnDetailsPage";
import { WarrantyDetailPage } from "../features/account/pages/WarrantyDetailPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";
import { AdminLoginPage } from "../features/admin/AdminLoginPage";
import { AdminRouteGuard } from "../features/admin/AdminRouteGuard";
import { AdminLayout } from "../features/admin/AdminLayout";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { AdminPlaceholderPage } from "../features/admin/AdminPlaceholderPage";
import { ProcurementListPage } from "../features/admin/procurement/ProcurementListPage";
import { ProcurementDetailPage } from "../features/admin/procurement/ProcurementDetailPage";
import { AfterSalesPage } from "../features/admin/afterSales/AfterSalesPage";
import { UserStaffPage } from "../features/admin/userStaff/UserStaffPage";
import { RolesPermissionsPage } from "../features/admin/rolePermissions/RolesPermissionsPage";
import { NotificationsPage as AdminNotificationsPage } from "../features/admin/notificationAudit/NotificationsPage";
import { AuditLogsPage } from "../features/admin/notificationAudit/AuditLogsPage";
import { AdminCatalogPage } from "../features/admin/AdminCatalogPage";
import {
  AdminCouponDetailPage,
  AdminCouponEditorPage,
  AdminPromotionsPage,
} from "../features/admin/AdminPromotionPages";
import {
  AdminOrderDetailPage,
  AdminOrdersPage,
} from "../features/admin/AdminOrderPages";
import {
  AdminPaymentDetailPage,
  AdminPaymentsPage,
  AdminRefundQueuePage,
} from "../features/admin/AdminPaymentPages";
import {
  AdminShipmentCreatePage,
  AdminShipmentDetailPage,
  AdminShipmentsPage,
} from "../features/admin/AdminShipmentPages";

export const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminRouteGuard>
        <AdminLayout />
      </AdminRouteGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "products", element: <AdminCatalogPage kind="products" /> },
      { path: "variants", element: <AdminCatalogPage kind="variants" /> },
      { path: "categories", element: <AdminCatalogPage kind="categories" /> },
      { path: "brands", element: <AdminCatalogPage kind="brands" /> },
      { path: "banners", element: <AdminCatalogPage kind="banners" /> },
      { path: "news", element: <AdminCatalogPage kind="news" /> },
      { path: "promotions", element: <AdminPromotionsPage /> },
      { path: "promotions/new", element: <AdminCouponEditorPage /> },
      { path: "promotions/:couponId", element: <AdminCouponDetailPage /> },
      { path: "promotions/:couponId/edit", element: <AdminCouponEditorPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "orders/:orderId", element: <AdminOrderDetailPage /> },
      { path: "payments", element: <AdminPaymentsPage /> },
      { path: "payments/:paymentId", element: <AdminPaymentDetailPage /> },
      { path: "refunds", element: <AdminRefundQueuePage /> },
      { path: "shipping", element: <AdminShipmentsPage /> },
      { path: "shipments/new", element: <AdminShipmentCreatePage /> },
      { path: "shipments/:shipmentId", element: <AdminShipmentDetailPage /> },
      {
        path: "inventory",
        element: (
          <AdminPlaceholderPage
            title="Kho hàng"
            description="Theo dõi tồn kho và điều chuyển sản phẩm giữa các kho."
          />
        ),
      },
      { path: "procurement", element: <ProcurementListPage /> },
      { path: "procurement/:poCode", element: <ProcurementDetailPage /> },
      { path: "after-sales", element: <AfterSalesPage /> },
      { path: "users", element: <UserStaffPage /> },
      { path: "roles", element: <RolesPermissionsPage /> },
      { path: "notifications", element: <AdminNotificationsPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
      {
        path: "settings",
        element: (
          <AdminPlaceholderPage
            title="Settings"
            description="Cấu hình vận hành cho hệ thống quản trị PinkPhone."
          />
        ),
      },
      {
        path: "support",
        element: (
          <AdminPlaceholderPage
            title="Support"
            description="Kênh hỗ trợ dành cho nhân sự quản trị."
          />
        ),
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/account",
    element: <AccountOverviewPage />,
  },
  {
    path: "/account/orders",
    element: <OrderHistoryPage />,
  },
  {
    path: "/account/tracking",
    element: <OrderTrackingPage />,
  },
  {
    path: "/account/warranty",
    element: <WarrantyPage />,
  },
  {
    path: "/account/tier",
    element: <MembershipTierPage />,
  },

  {
    path: "/account/returns",
    element: <ReturnsPage />,
  },
  {
    path: "/account/returns/new",
    element: <ReturnCreatePage />,
  },
  {
    path: "/account/returns/:id",
    element: <ReturnDetailsPage />,
  },
  {
    path: "/account/warranty/:id",
    element: <WarrantyDetailPage />,
  },
  {
    path: "/account/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/account/vouchers",
    element: <VouchersPage />,
  },
  {
    path: "/account/wishlist",
    element: <WishlistPage />,
  },
  {
    path: "/account/address",
    element: <AccountAddressPage />,
  },
  {
    path: "/account/profile",
    element: <AccountProfilePage />,
  },
  {
    path: "/account/support",
    element: <AccountSupportPage />,
  },
  {
    path: "/account/terms",
    element: <AccountTermsPage />,
  },
  {
    path: "/account/reviews/pending",
    element: <AccountReviewsPage />,
  },
  {
    path: "/account/reviews",
    element: <AccountReviewsHistoryPage />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/payment/vnpay-return",
    element: <VnpayReturn />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
]);
