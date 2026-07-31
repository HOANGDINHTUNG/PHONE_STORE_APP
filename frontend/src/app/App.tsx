import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AccountOverviewPage } from "../features/account/pages/AccountOverviewPage";
import {
  MyReviewsPage,
  NotificationsPage,
  ReturnsPage,
} from "../features/account/pages/AccountActivityPages";
import { OrderDetailPage } from "../features/account/pages/OrderDetailPage";
import { OrderHistoryPage } from "../features/account/pages/OrderHistoryPage";
import { OrderTrackingPage } from "../features/account/pages/OrderTrackingPage";
import {
  AddressesPage,
  FavoritesPage,
  MembershipPage,
  VouchersPage,
  WarrantyLookupPage,
} from "../features/account/pages/BenefitsPages";
import {
  AccountInformationPage,
  ChangePasswordPage,
  LinkedAccountsPage,
  LogoutConfirmationPage,
  SupportPage,
  TermsPage,
} from "../features/account/pages/SettingsPages";
import { CartEmptyPage } from "../features/cart/pages/CartEmptyPage";
import { CartPage } from "../features/cart/pages/CartPage";
import { CartStatusPage } from "../features/cart/pages/CartStatusPage";
import { HomePage } from "../features/home/pages/HomePage";
import { ProductDetailLoadingPage } from "../features/product/pages/ProductDetailLoadingPage";
import { ProductDetailPage } from "../features/product/pages/ProductDetailPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dang-nhap" element={<LoginPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
      <Route path="/san-pham/pinkphone-ultra-x" element={<ProductDetailPage />} />
      <Route
        path="/san-pham/pinkphone-ultra-x/het-hang"
        element={<ProductDetailPage availability="out-of-stock" />}
      />
      <Route
        path="/san-pham/pinkphone-ultra-x/dang-tai"
        element={<ProductDetailLoadingPage />}
      />
      <Route path="/gio-hang" element={<CartPage />} />
      <Route path="/gio-hang/trong" element={<CartEmptyPage />} />
      <Route path="/gio-hang/trang-thai" element={<CartStatusPage />} />
      <Route path="/tai-khoan" element={<AccountOverviewPage />} />
      <Route path="/tai-khoan/lich-su-mua-hang" element={<OrderHistoryPage />} />
      <Route path="/tai-khoan/lich-su-mua-hang/trong" element={<OrderHistoryPage empty />} />
      <Route path="/tai-khoan/don-hang/PP123-001" element={<OrderDetailPage />} />
      <Route path="/tai-khoan/theo-doi-don-hang" element={<OrderTrackingPage />} />
      <Route path="/tai-khoan/danh-gia" element={<MyReviewsPage />} />
      <Route path="/tai-khoan/bao-hanh" element={<WarrantyLookupPage />} />
      <Route path="/tai-khoan/doi-tra" element={<ReturnsPage />} />
      <Route path="/tai-khoan/thong-bao" element={<NotificationsPage />} />
      <Route path="/tai-khoan/hang-thanh-vien" element={<MembershipPage />} />
      <Route path="/tai-khoan/ma-giam-gia" element={<VouchersPage />} />
      <Route path="/tai-khoan/yeu-thich" element={<FavoritesPage />} />
      <Route path="/tai-khoan/so-dia-chi" element={<AddressesPage />} />
      <Route path="/tai-khoan/thong-tin" element={<AccountInformationPage />} />
      <Route path="/tai-khoan/doi-mat-khau" element={<ChangePasswordPage />} />
      <Route path="/tai-khoan/ho-tro" element={<SupportPage />} />
      <Route path="/tai-khoan/lien-ket" element={<LinkedAccountsPage />} />
      <Route path="/tai-khoan/dieu-khoan" element={<TermsPage />} />
      <Route path="/tai-khoan/dang-xuat" element={<LogoutConfirmationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
