import { useState } from "react";
import {
  Gift,
  Headphones,
  HelpCircle,
  LogIn,
  MapPin,
  PackageSearch,
  Search,
  ShoppingCart,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";

type SiteHeaderProps = {
  search: string;
  onSearch: (value: string) => void;
};

const tickerMessages = [
  "Miễn phí vận chuyển đơn từ 300k",
  "Thu cũ đổi mới trợ giá cao",
  "Sản phẩm chính hãng · Xuất VAT đầy đủ",
  "Giao hàng hỏa tốc 2h",
];

export function SiteHeader({ search, onSearch }: SiteHeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      {accountOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-foreground/10 backdrop-blur-[2px]"
          onClick={() => setAccountOpen(false)}
          aria-label="Đóng bảng tài khoản"
        />
      )}
      <header className={`sticky top-0 border-b border-border/80 bg-white/95 backdrop-blur-xl ${accountOpen ? "z-50" : "z-40"}`}>
      <div className="bg-primary text-white">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center gap-3 px-4 text-[11px] font-semibold sm:px-6">
          <div
            className="ticker-window min-w-0 flex-1 overflow-hidden"
            aria-label={`Thông tin ưu đãi: ${tickerMessages.join(". ")}`}
          >
            <div className="ticker-track">
              {[false, true].map((duplicate) => (
                <div
                  key={duplicate ? "ticker-copy" : "ticker-source"}
                  className="ticker-group"
                  aria-hidden={duplicate || undefined}
                >
                  {tickerMessages.map((message) => (
                    <span key={message} className="inline-flex items-center gap-3 whitespace-nowrap">
                      <span className="size-1 rounded-full bg-white/65" aria-hidden="true" />
                      {message}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <nav
            className="hidden shrink-0 items-center gap-4 border-l border-white/25 pl-4 lg:flex"
            aria-label="Tiện ích nhanh"
          >
            <a href="#stores" className="inline-flex items-center gap-1.5 text-white/90 hover:text-white">
              <MapPin size={13} /> Hệ thống cửa hàng
            </a>
            <a href="#order-lookup" className="inline-flex items-center gap-1.5 text-white/90 hover:text-white">
              <PackageSearch size={13} /> Tra cứu đơn hàng
            </a>
            <a href="tel:18006601" className="inline-flex items-center gap-1.5 text-white hover:underline">
              <Headphones size={13} /> 1800 6601
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <BrandLogo />

        <label className="relative ml-auto hidden max-w-xl flex-1 lg:block">
          <span className="sr-only">Tìm kiếm điện thoại</span>
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Bạn muốn tìm điện thoại nào?"
            className="min-h-11 w-full rounded-xl border border-border bg-surface-soft pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>

        <nav className="relative ml-auto flex items-center gap-1 sm:gap-2" aria-label="Tài khoản và giỏ hàng">
          <a
            href="#promotions"
            className="hidden min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-surface-soft md:flex"
          >
            <Gift size={20} /> Khuyến mãi
          </a>
          <Link
            to="/gio-hang"
            onClick={() => setAccountOpen(false)}
            className="relative grid size-11 place-items-center rounded-xl hover:bg-surface-soft"
            aria-label="Giỏ hàng, 2 sản phẩm"
          >
            <ShoppingCart size={21} />
            <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white">
              2
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            className={`grid size-11 place-items-center rounded-xl transition ${
              accountOpen ? "bg-primary text-white" : "hover:bg-surface-soft"
            }`}
            aria-label="Mở tài khoản"
            aria-expanded={accountOpen}
            aria-haspopup="dialog"
          >
            <UserRound size={21} />
          </button>

          {accountOpen && (
            <div
              role="dialog"
              aria-label="Tài khoản chưa đăng nhập"
              className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-border bg-white p-5 text-left shadow-card"
            >
              <p className="text-xl font-extrabold tracking-[-0.03em]">Chào mừng bạn!</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận ưu đãi thành viên.
              </p>
              <div className="mt-5 grid gap-2">
                <Link
                  to="/dang-nhap"
                  onClick={() => setAccountOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-strong"
                >
                  <LogIn size={17} /> Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  onClick={() => setAccountOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-soft px-4 text-sm font-bold transition hover:bg-border"
                >
                  <UserPlus size={17} /> Đăng ký tài khoản
                </Link>
              </div>
              <div className="mt-5 grid gap-1 border-t border-border pt-4">
                <a
                  href="#order-lookup"
                  className="flex min-h-10 items-center gap-3 rounded-lg px-2 text-sm text-muted hover:bg-surface-soft hover:text-primary"
                >
                  <PackageSearch size={17} /> Tra cứu đơn hàng
                </a>
                <a
                  href="#support"
                  className="flex min-h-10 items-center gap-3 rounded-lg px-2 text-sm text-muted hover:bg-surface-soft hover:text-primary"
                >
                  <HelpCircle size={17} /> Bạn cần hỗ trợ?
                </a>
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-border/60 px-4 py-3 lg:hidden">
        <label className="relative mx-auto block max-w-7xl">
          <span className="sr-only">Tìm kiếm điện thoại</span>
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Bạn muốn tìm điện thoại nào?"
            className="min-h-11 w-full rounded-xl border border-border bg-surface-soft pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </label>
      </div>
      </header>
    </>
  );
}
