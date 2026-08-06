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
import { AccountSupportPage } from "../features/account/pages/AccountSupportPage";
import { AccountTermsPage } from "../features/account/pages/AccountTermsPage";
import { ChangePasswordPage } from "../features/account/pages/SettingsPages";
import { AccountReviewsPage } from "../features/account/pages/AccountReviewsPage";
import { AccountReviewsHistoryPage } from "../features/account/pages/AccountReviewsHistoryPage";
import { OrderDetailPage } from "../features/account/pages/OrderDetailPage";
import { OrderTrackingDetailPage } from "../features/account/pages/OrderTrackingDetailPage";
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
import {
  AdminInventoryBalancesPage,
  AdminReorderAlertsPage,
  AdminStockHistoryPage,
  AdminWarehousesPage,
} from "../features/admin/AdminInventoryPages";
import { AdminSuppliersPage } from "../features/admin/AdminSuppliersPage";
import { AdminWarehouseCreatePage } from "../features/admin/AdminWarehouseCreatePage";
import { AdminInventoryUnitDetailPage } from "../features/admin/AdminInventoryUnitDetailPage";
import { AdminInventoryUnitDirectoryPage } from "../features/admin/AdminInventoryUnitDirectoryPage";
import {
  AdminInventoryEntitiesPage,
  AdminStockLedgerPage,
  AdminWarehouseDetailPage,
  AdminWarehouseManagementPage,
} from "../features/admin/AdminInventoryOperationsPages";
import { CustomerRouteGuard } from "../features/auth/CustomerRouteGuard";

const customerRoute = (element: React.ReactNode) => (
  <CustomerRouteGuard>{element}</CustomerRouteGuard>
);

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
      { path: "inventory", element: <AdminWarehouseManagementPage /> },
      { path: "inventory/new", element: <AdminWarehouseCreatePage /> },
      { path: "inventory/balances", element: <AdminInventoryEntitiesPage /> },
      { path: "inventory/alerts", element: <AdminReorderAlertsPage /> },
      { path: "inventory/history", element: <AdminStockLedgerPage /> },
      { path: "inventory/ledger", element: <AdminStockLedgerPage /> },
      {
        path: "inventory/warehouses/:warehouseId",
        element: <AdminWarehouseDetailPage />,
      },
      {
        path: "inventory/unit-details",
        element: <AdminInventoryUnitDirectoryPage />,
      },
      {
        path: "inventory/unit-details/:warehouseId/:variantId",
        element: <AdminInventoryUnitDetailPage />,
      },
      { path: "suppliers", element: <AdminSuppliersPage /> },
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
    element: customerRoute(<HomePage />),
  },
  {
    element: customerRoute(<AppLayout />),
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
    element: customerRoute(<AccountOverviewPage />),
  },
  {
    path: "/account/orders",
    element: customerRoute(<OrderHistoryPage />),
  },
  {
    path: "/account/orders/:id",
    element: <OrderDetailPage />,
  },
  {
    path: "/account/tracking",
    element: customerRoute(<OrderTrackingPage />),
  },
  {
    path: "/account/tracking/:id",
    element: <OrderTrackingDetailPage />,
  },
  {
    path: "/account/warranty",
    element: customerRoute(<WarrantyPage />),
  },
  {
    path: "/account/tier",
    element: customerRoute(<MembershipTierPage />),
  },

  {
    path: "/account/returns",
    element: customerRoute(<ReturnsPage />),
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
    element: customerRoute(<NotificationsPage />),
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
    path: "/account/security",
    element: <ChangePasswordPage />,
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
    element: customerRoute(<Checkout />),
  },
  {
    path: "/payment/vnpay-return",
    element: customerRoute(<VnpayReturn />),
  },
  {
    path: "/login",
    element: customerRoute(<Login />),
  },
  {
    path: "/register",
    element: customerRoute(<Register />),
  },
  {
    path: "/forgot-password",
    element: customerRoute(<ForgotPassword />),
  },
  {
    path: "/reset-password",
    element: customerRoute(<ResetPassword />),
  },
  {
    path: "/verify-email",
    element: customerRoute(<EmailVerification />),
  },
]);
