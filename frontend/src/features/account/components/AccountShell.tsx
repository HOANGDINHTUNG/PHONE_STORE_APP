import type { ReactNode } from "react";
import {
  Bell,
  FileText,
  Headphones,
  Heart,
  History,
  LayoutGrid,
  LogOut,
  MapPin,
  MessageSquare,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Ticket,
  Truck,
  User,
  Award,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccountHeader } from "./AccountHeader";
import { SiteFooter } from "../../home/components/SiteFooter";

const accountNavigation = [
  [LayoutGrid, "Tổng quan", "/account"],
  [History, "Lịch sử mua hàng", "/account/orders"],
  [Truck, "Theo dõi đơn hàng", "/account/tracking"],
  [MessageSquare, "Đánh giá sản phẩm", "/account/reviews"],
  [ShieldCheck, "Bảo hành của tôi", "/account/warranty"],
  [Award, "Hạng thành viên", "/account/tier"],
  [RefreshCcw, "Đổi trả & hoàn tiền", "/account/returns"],
  [Bell, "Thông báo", "/account/notifications"],
  [Ticket, "Ưu đãi & mã giảm giá", "/account/vouchers"],
  [Heart, "Sản phẩm yêu thích", "/account/wishlist"],
  [MapPin, "Sổ địa chỉ", "/account/address"],
  [User, "Thông tin tài khoản", "/account/profile"],
  [Shield, "Bảo mật & phiên đăng nhập", "/account/security"],
  [Headphones, "Góp ý - Hỗ trợ", "/account/support"],
  [FileText, "Điều khoản", "/account/terms"],
] as const;

type AccountShellProps = {
  title: string;
  children: ReactNode;
  description?: string;
  actions?: ReactNode;
};

import { useEffect } from "react";
import { useStore } from "../../../context/StoreContext";
import { AuthModal } from "../../auth/components/AuthModal";

export function AccountShell({
  title,
  description,
  actions,
  children,
}: AccountShellProps) {
  const { user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${title} - PinkPhone`;
  }, [title]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-foreground flex flex-col font-sans">
      <AccountHeader />

      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-margin-desktop py-lg flex flex-col md:flex-row gap-gutter">
        <AccountSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function AccountSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const getInitials = (name?: string) => {
    if (!name) return "MA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-xl shadow-sm p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-primary">
            <img
              className="w-full h-full object-cover"
              alt="Avatar"
              src={
                user?.avatarUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="font-headline-md text-label-sm text-primary truncate"
              title={user ? user.name : "Thành viên PinkPhone"}
            >
              {user ? user.name : "Thành viên PinkPhone"}
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant truncate">
              Chào mừng bạn trở lại
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {accountNavigation.map(([Icon, label, href]) => {
            const active =
              href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(href as string);
            return (
              <Link
                key={href as string}
                to={href as string}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  active
                    ? "bg-primary-container/10 text-primary font-bold scale-98"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary font-bold"
                }`}
              >
                <Icon size={20} className={active ? "" : "opacity-80"} />
                <span className="font-label-sm text-label-sm tracking-tight">
                  {label as string}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg px-4 py-2 transition-all mt-4 text-error"
          >
            <LogOut size={20} />
            <span className="font-label-sm text-label-sm">Đăng xuất</span>
          </button>
        </nav>
      </div>
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
  return (
    <section
      className={`rounded-2xl border border-border bg-white ${className}`}
    >
      {children}
    </section>
  );
}
