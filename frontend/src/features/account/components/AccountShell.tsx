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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccountHeader } from "./AccountHeader";
import { SiteFooter } from "../../home/components/SiteFooter";

const accountNavigation = [
  [LayoutGrid, "Tổng quan", "/account"],
  [History, "Lịch sử mua hàng", "/account/orders"],
  [Truck, "Theo dõi đơn hàng", "/account/tracking"],
  [MessageSquare, "Đánh giá của tôi", "/account/reviews"],
  [ShieldCheck, "Bảo hành của tôi", "/account/warranty"],
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

      <main className="flex-1">
        <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <AccountSidebar />

            <div className="min-w-0">
              <header className="hidden">
                {/* Visual title hidden since we match exactly the mockup structure which has no page title rendering here */}
              </header>
              {children}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
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
    <aside className="min-w-0 max-w-full lg:sticky lg:top-28 rounded-2xl bg-[#FBFBFB] py-6 px-4">
      <div className="flex flex-col items-center gap-3 pb-6 border-b border-border/40 text-center">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-pink-50 p-1">
          <img
            src="/images/prod_iphone15.png"
            alt="Avatar"
            className="size-full rounded-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-extrabold text-[#D81B60] text-[15px]">
            {user ? user.name : "Thành viên PinkPhone"}
          </p>
          <p className="text-[11px] font-semibold text-[#888888] mt-1">
            Chào mừng bạn trở lại
          </p>
        </div>
      </div>
      <nav
        className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-[6px] pt-4"
        aria-label="Khu vực tài khoản"
      >
        {accountNavigation.map(([Icon, label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={`flex min-h-[44px] shrink-0 items-center gap-4 rounded-lg px-4 text-[13px] transition ${
                active
                  ? "bg-[#D81B60] text-white font-bold shadow-[0_2px_8px_rgba(216,27,96,0.3)]"
                  : "text-[#555555] hover:bg-neutral-soft/60 hover:text-foreground font-semibold"
              }`}
            >
              <Icon
                size={18}
                className={active ? "opacity-100" : "text-[#777777]"}
              />
              {label}
            </Link>
          );
        })}
        <div className="pt-2 mt-2">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex min-h-[44px] w-full shrink-0 items-center gap-4 rounded-lg px-4 text-[13px] font-bold transition text-[#D81B60] hover:bg-red-50"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
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
  return (
    <section
      className={`rounded-2xl border border-border bg-white ${className}`}
    >
      {children}
    </section>
  );
}
