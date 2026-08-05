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
  MyReviewsPage,
  ReturnsPage,
  NotificationsPage,
} from "../features/account/pages/AccountActivityPages";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";
import { AdminLoginPage } from "../features/admin/AdminLoginPage";
import { AdminRouteGuard } from "../features/admin/AdminRouteGuard";
import { AdminLayout } from "../features/admin/AdminLayout";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { AdminPlaceholderPage } from "../features/admin/AdminPlaceholderPage";

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
      { path: "products", element: <AdminPlaceholderPage title="Sản phẩm & Nội dung" description="Quản lý sản phẩm, biến thể, hình ảnh, danh mục và nội dung bán hàng." /> },
      { path: "promotions", element: <AdminPlaceholderPage title="Khuyến mãi" description="Thiết lập chương trình khuyến mãi, mã giảm giá và ưu đãi." /> },
      { path: "orders", element: <AdminPlaceholderPage title="Đơn hàng" description="Theo dõi, xác nhận và xử lý đơn hàng của khách." /> },
      { path: "payments", element: <AdminPlaceholderPage title="Thanh toán & Hoàn tiền" description="Kiểm soát giao dịch thanh toán, đối soát và yêu cầu hoàn tiền." /> },
      { path: "shipping", element: <AdminPlaceholderPage title="Giao hàng" description="Theo dõi vận đơn, tiến độ giao hàng và các sự cố vận chuyển." /> },
      { path: "inventory", element: <AdminPlaceholderPage title="Kho hàng" description="Theo dõi tồn kho và điều chuyển sản phẩm giữa các kho." /> },
      { path: "procurement", element: <AdminPlaceholderPage title="Nhập hàng" description="Quản lý yêu cầu mua hàng, phiếu nhập và nhà cung cấp." /> },
      { path: "after-sales", element: <AdminPlaceholderPage title="Hậu mãi" description="Xử lý bảo hành, đổi trả và chăm sóc khách hàng sau mua." /> },
      { path: "users", element: <AdminPlaceholderPage title="Người dùng & Nhân sự" description="Quản lý khách hàng, nhân sự và trạng thái tài khoản." /> },
      { path: "roles", element: <AdminPlaceholderPage title="Vai trò & Quyền" description="Thiết lập vai trò và phạm vi quyền truy cập của nhân sự." /> },
      { path: "notifications", element: <AdminPlaceholderPage title="Thông báo" description="Quản lý thông báo vận hành gửi đến nhân sự và khách hàng." /> },
      { path: "audit-logs", element: <AdminPlaceholderPage title="Nhật ký kiểm toán" description="Theo dõi lịch sử thay đổi quan trọng trong hệ thống." /> },
      { path: "settings", element: <AdminPlaceholderPage title="Settings" description="Cấu hình vận hành cho hệ thống quản trị PinkPhone." /> },
      { path: "support", element: <AdminPlaceholderPage title="Support" description="Kênh hỗ trợ dành cho nhân sự quản trị." /> },
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
    path: "/account/reviews",
    element: <MyReviewsPage />,
  },
  {
    path: "/account/returns",
    element: <ReturnsPage />,
  },
  {
    path: "/account/notifications",
    element: <NotificationsPage />,
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
