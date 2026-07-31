import type { ReactNode } from "react";
import {
  BadgeCheck,
  Heart,
  History,
  KeyRound,
  Link2,
  LogOut,
  MapPin,
  MessageCircleQuestion,
  MessageSquareText,
  PackageSearch,
  RefreshCcw,
  ScrollText,
  Settings,
  ShieldCheck,
  Ticket,
  Bell,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";

const accountNavigation = [
  [UserRound, "Tổng quan", "/tai-khoan"],
  [History, "Lịch sử mua hàng", "/tai-khoan/lich-su-mua-hang"],
  [PackageSearch, "Theo dõi đơn hàng", "/tai-khoan/theo-doi-don-hang"],
  [MessageSquareText, "Đánh giá của tôi", "/tai-khoan/danh-gia"],
  [ShieldCheck, "Tra cứu bảo hành", "/tai-khoan/bao-hanh"],
  [RefreshCcw, "Đổi trả & hoàn tiền", "/tai-khoan/doi-tra"],
  [Bell, "Thông báo", "/tai-khoan/thong-bao"],
  [BadgeCheck, "Hạng thành viên", "/tai-khoan/hang-thanh-vien"],
  [Ticket, "Mã giảm giá của tôi", "/tai-khoan/ma-giam-gia"],
  [Heart, "Sản phẩm yêu thích", "/tai-khoan/yeu-thich"],
  [MapPin, "Sổ địa chỉ", "/tai-khoan/so-dia-chi"],
  [Settings, "Thông tin tài khoản", "/tai-khoan/thong-tin"],
  [KeyRound, "Đổi mật khẩu", "/tai-khoan/doi-mat-khau"],
  [Link2, "Liên kết tài khoản", "/tai-khoan/lien-ket"],
  [MessageCircleQuestion, "Góp ý & Hỗ trợ", "/tai-khoan/ho-tro"],
  [ScrollText, "Điều khoản sử dụng", "/tai-khoan/dieu-khoan"],
] as const;

type AccountShellProps = {
  title: string;
  children: ReactNode;
  description?: string;
  actions?: ReactNode;
};

import { useState } from "react";
import { useStore } from "../../../context/StoreContext";
import { AuthModal } from "../../auth/components/AuthModal";
import { useNavigate } from "react-router-dom";

export function AccountShell({ title, description, actions, children }: AccountShellProps) {
  const { user } = useStore();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(!user);

  return (
    <StorePageLayout title={`${title} - PinkPhone`}>
      {!user && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            navigate("/");
          }}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <AccountSidebar />

          <div className="min-w-0">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">{title}</h1>
                {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>}
              </div>
              {actions}
            </header>
            {children}
          </div>
        </div>
      </div>
    </StorePageLayout>
  );
}

export function AccountSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return "MA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-border bg-white p-4 lg:sticky lg:top-32 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-black text-white shadow-sm">
          {getInitials(user?.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-extrabold text-primary">
            {user ? user.name : "Thành viên PinkPhone"}
          </p>
          <p className="text-xs text-muted">Chào mừng bạn trở lại</p>
        </div>
      </div>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid" aria-label="Khu vực tài khoản">
        {accountNavigation.map(([Icon, label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                active
                  ? "bg-primary text-white font-bold"
                  : "text-muted hover:bg-surface-soft hover:text-primary"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className={`flex min-h-11 w-full shrink-0 items-center gap-3 rounded-xl border-t border-border px-3 text-sm font-semibold transition text-danger hover:bg-red-50`}
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </nav>
    </aside>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-border bg-white ${className}`}>{children}</section>;
}
