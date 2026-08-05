import { useState, useEffect, useRef } from "react";
import {
  Tag,
  Headphones,
  Search,
  ShoppingCart,
  Store,
  PackageSearch,
  Truck,
  RefreshCw,
  ShieldCheck,
  Zap,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";

type SiteHeaderProps = {
  search: string;
  onSearch: (value: string) => void;
};

export function SiteHeader({ search, onSearch }: SiteHeaderProps) {
  const { user, logout, cart } = useStore();
  const cartCount = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );
  const [scrolled, setScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="w-full z-50 sticky top-0 relative">
        {/* Tier 1: Notification & Utility Bar */}
        <div className="bg-secondary-container h-10 flex items-center overflow-hidden hidden md:flex">
          <div className="max-w-[1200px] mx-auto w-full px-gutter flex items-center justify-between">
            {/* Left & Middle: Marquee */}
            <div className="flex-1 overflow-hidden relative mr-lg">
              <div className="animate-[marquee_50s_linear_infinite] flex w-max hover:[animation-play-state:paused]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center text-white text-[13px] font-medium space-x-xl shrink-0 pr-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <Truck size={18} />
                      <span>Đơn hàng từ 300.000đ</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <div className="flex items-center space-x-2">
                      <RefreshCw size={18} />
                      <span>Thu cũ giá tốt – Lên đời tiết kiệm</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck size={18} />
                      <span>Sản phẩm chính hãng – Xuất VAT đầy đủ</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                    <div className="flex items-center space-x-2">
                      <Zap size={18} />
                      <span>
                        Giao nhanh – Miễn phí vận chuyển cho đơn từ 300.000đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Fixed Links */}
            <div className="flex items-center space-x-md text-white text-[13px] font-medium shrink-0">
              <Link
                to="/cua-hang"
                className="flex items-center hover:text-white/80 transition-colors"
              >
                <Store size={16} className="mr-1.5" />
                Cửa hàng gần bạn
              </Link>
              <span className="w-[1px] h-3 bg-white/30"></span>
              <Link
                to="/tra-cuu"
                className="flex items-center hover:text-white/80 transition-colors"
              >
                <PackageSearch size={16} className="mr-1.5" />
                Tra cứu đơn hàng
              </Link>
              <span className="w-[1px] h-3 bg-white/30"></span>
              <a className="flex items-center font-bold" href="tel:18006601">
                <Headphones size={16} className="mr-1.5" />
                1800 6601
              </a>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Navigation Bar */}
        <div
          id="main-header"
          className={`bg-white shadow-sm transition-all duration-300 w-full ${scrolled ? "py-2 h-16" : "h-20"}`}
        >
          <div className="max-w-[1200px] mx-auto w-full px-gutter flex items-center h-full gap-xl">
            {/* Logo */}
            <Link
              to="/"
              className="text-headline-md font-extrabold text-secondary-container shrink-0 tracking-tight"
            >
              PinkPhone
            </Link>

            {/* Main Search Bar */}
            <div className="flex-1 relative group">
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Bạn muốn tìm điện thoại nào?"
                className="w-full h-11 pl-12 pr-4 rounded-lg border-none bg-surface-container text-body-md focus:ring-2 focus:ring-secondary-container/30 outline-none transition-all placeholder:text-on-surface-variant/60"
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary-container transition-colors"
              />
            </div>

            {/* Utility Actions */}
            <div className="flex items-center space-x-lg shrink-0">
              <Link
                to="/khuyen-mai"
                className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors group hidden sm:flex"
              >
                <Tag size={22} />
                <span className="text-[11px] font-bold mt-0.5">Khuyến mãi</span>
              </Link>

              <Link
                to="/cart"
                className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors relative group hidden sm:flex"
              >
                <ShoppingCart size={22} />
                <span className="text-[11px] font-bold mt-0.5">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-secondary-container text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Popover Tài Khoản */}
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="active:scale-95 transition-transform flex flex-col items-center justify-center min-w-[64px] h-12 rounded-xl bg-primary-container text-on-primary-container shadow-md"
                >
                  {user ? (
                    <div className="flex items-center justify-center w-[22px] h-[22px] bg-primary text-on-primary rounded-full text-[11px] font-black uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                  ) : (
                    <User size={22} />
                  )}
                  <span className="text-[10px] font-bold uppercase mt-1">
                    {user ? "Cá nhân" : "Tài khoản"}
                  </span>
                </button>

                <div
                  className={`absolute top-[calc(100%+12px)] right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-outline-variant/20 p-6 transform origin-top-right transition-all duration-300 z-[60] ${isAccountOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"}`}
                >
                  {/* popover-arrow */}
                  <div className="absolute top-[-8px] right-[24px] w-4 h-4 bg-white rotate-45 border-t border-l border-outline-variant/20 -z-10"></div>

                  {user ? (
                    <div>
                      <h3
                        className="font-headline-md text-lg font-bold text-on-surface mb-2 truncate"
                        title={`Chào, ${user.name}`}
                      >
                        Chào, {user.name}
                      </h3>
                      <span className="text-[10px] font-extrabold text-secondary-container bg-secondary-container/10 px-1.5 py-0.5 rounded uppercase tracking-widest mb-4 inline-block">
                        Thành viên Vàng
                      </span>
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl active:scale-95 text-center hover:bg-secondary transition-colors block"
                        >
                          Quản lý tài khoản
                        </Link>
                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            logout();
                          }}
                          className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl active:scale-95 hover:bg-surface-container-highest transition-colors flex items-center justify-center"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-headline-md text-lg text-on-surface mb-2 font-bold">
                        Chào mừng bạn!
                      </h3>
                      <p className="text-body-md text-[13px] text-on-surface-variant mb-6 leading-relaxed">
                        Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích
                        và nhận ưu đãi thành viên.
                      </p>
                      <div className="flex flex-col gap-3">
                        <Link
                          to="/login"
                          onClick={() => setIsAccountOpen(false)}
                          className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl active:scale-95 hover:bg-secondary transition-colors text-center block"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsAccountOpen(false)}
                          className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl active:scale-95 hover:bg-surface-container-highest transition-colors text-center block"
                        >
                          Đăng ký tài khoản
                        </Link>
                      </div>
                      <div className="mt-6 pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
                        <Link
                          to="/account/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Truck size={20} />
                          Tra cứu đơn hàng
                        </Link>
                        <a
                          href="tel:18006601"
                          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Headphones size={20} />
                          Bạn cần hỗ trợ?
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay (Hiệu ứng làm mờ trang khi Popover mở) */}
      <div
        className={`fixed inset-0 z-40 bg-surface/10 backdrop-blur-[2px] transition-all duration-300 ${
          isAccountOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsAccountOpen(false)}
      />
    </>
  );
}
