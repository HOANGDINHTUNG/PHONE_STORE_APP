import { AccountShell } from "../components/AccountShell";
import { Link } from "react-router-dom";
import { useState } from "react";

export function WarrantyPage() {
  // Simulate having no warranties
  const warranties: any[] = [];

  return (
    <AccountShell
      title="Bảo hành của tôi - PinkPhone"
      description="Kiểm tra thông tin chi tiết về gói bảo hành và tình trạng thiết bị của bạn."
    >
      <div className="flex-1 flex flex-col gap-6 lg:gap-8 hover:transform-none">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-2"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <Link to="/account" className="hover:text-primary transition-colors">
            Tài khoản
          </Link>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-on-background font-medium">
            Bảo hành của tôi
          </span>
        </nav>

        {/* Empty State Card */}
        {warranties.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(214,51,108,0.08)] p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center text-center min-h-[500px] w-full border border-surface-variant/30">
            <div className="w-32 h-32 bg-primary-fixed/30 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-primary-fixed/20 rounded-full animate-pulse blur-md"></div>
              <span
                className="material-symbols-outlined text-[80px] text-primary relative z-10"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
            </div>

            <h1 className="text-display-lg-mobile md:text-headline-md font-headline-md text-on-background mb-4 font-bold text-2xl">
              Bạn chưa có thông tin bảo hành nào.
            </h1>

            <p className="text-body-md font-body-md text-on-surface-variant max-w-[448px] mx-auto mb-8">
              Các sản phẩm chính hãng mua tại PinkPhone sẽ được tự động kích
              hoạt bảo hành tại đây. Hãy tiếp tục mua sắm để nhận được các ưu
              đãi bảo hành tốt nhất.
            </p>

            <Link
              to="/"
              className="bg-primary text-on-primary px-8 py-3 rounded-full text-label-sm font-label-sm font-semibold hover:bg-secondary-container hover:scale-[0.98] transition-all duration-200 shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined">storefront</span>
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </AccountShell>
  );
}
