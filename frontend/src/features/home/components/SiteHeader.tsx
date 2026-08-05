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
  Bell,
  ArrowRight,
  Megaphone,
  Ticket,
  CreditCard,
  Headset,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";

type SiteHeaderProps = {
  search: string;
  onSearch: (value: string) => void;
};

// Đã xoá tạm dữ liệu tĩnh để sếp test màn "Không thể tải"
const HEADER_NOTIFICATIONS: any[] = [];

export function SiteHeader({ search, onSearch }: SiteHeaderProps) {
  const navigate = useNavigate();
  const { user, logout, cart } = useStore();
  const cartCount = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  const [scrolled, setScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = HEADER_NOTIFICATIONS.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
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

  const handleNotificationClick = () => {
    if (user) {
      setIsNotificationOpen(!isNotificationOpen);
      if (isAccountOpen) setIsAccountOpen(false);
    } else {
      navigate("/login?redirect=/account/notifications");
    }
  };

  const handleAccountClick = () => {
    setIsAccountOpen(!isAccountOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

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
                className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors group hidden xl:flex"
              >
                <Tag size={22} />
                <span className="text-[11px] font-bold mt-0.5">Khuyến mãi</span>
              </Link>

              {/* Notification Popover */}
              {user && (
                <div className="relative hidden md:block" ref={notificationRef}>
                  <button
                    onClick={handleNotificationClick}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors relative group h-12"
                  >
                    <Bell size={22} />
                    <span className="text-[11px] font-bold mt-0.5">
                      Thông báo
                    </span>
                    {user && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-0 w-[18px] h-[18px] bg-error text-[10px] text-white flex items-center justify-center rounded-full font-bold border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <div
                    className={`absolute top-[calc(100%+8px)] right-[-60px] w-80 md:w-96 bg-surface-container-lowest border border-outline-variant shadow-lg rounded-xl flex flex-col z-[100] transform origin-top-right transition-all duration-200 ${
                      isNotificationOpen
                        ? "opacity-100 visible scale-100"
                        : "opacity-0 invisible scale-95"
                    }`}
                  >
                    <div className="absolute top-[-8px] right-[75px] w-4 h-4 bg-surface-container-low rotate-45 border-t border-l border-outline-variant -z-10"></div>

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-xl z-10">
                      <h3 className="font-bold text-[18px] text-on-surface m-0 leading-tight">
                        Thông báo mới
                      </h3>
                      <button className="text-on-surface-variant hover:text-primary transition-colors text-xs font-bold">
                        Đánh dấu đã đọc
                      </button>
                    </div>

                    {/* List / Error State */}
                    {HEADER_NOTIFICATIONS.length > 0 ? (
                      <ul className="flex flex-col max-h-[400px] overflow-y-auto bg-white">
                        {HEADER_NOTIFICATIONS.map((notif) => (
                          <li
                            key={notif.id}
                            className={`relative border-b border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer group ${!notif.isRead ? "bg-primary-fixed-dim/5" : "bg-white"}`}
                          >
                            <Link
                              to="/account/notifications"
                              className="flex items-start gap-4 p-4 w-full"
                              onClick={() => setIsNotificationOpen(false)}
                            >
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.colorClass}`}
                              >
                                <notif.Icon size={20} />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors leading-tight pr-2">
                                  {notif.title}
                                </h4>
                                <p className="text-[13px] text-on-surface-variant line-clamp-2 leading-tight mb-2 font-medium">
                                  {notif.text}
                                </p>
                                <span className="text-[11px] font-bold text-outline">
                                  {notif.time}
                                </span>
                              </div>
                              {!notif.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 absolute right-4 top-4"></div>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-4 bg-white">
                        <AlertCircle size={48} className="text-error" />
                        <div>
                          <p className="text-on-surface font-medium">
                            Không thể tải thông báo
                          </p>
                          <p className="text-on-surface-variant text-[13px] mt-1">
                            Vui lòng kiểm tra kết nối mạng và thử lại.
                          </p>
                        </div>
                        <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-colors">
                          Thử lại
                        </button>
                      </div>
                    )}

                    {/* View All */}
                    <div className="p-3 text-center border-t border-outline-variant bg-surface-container-low rounded-b-xl hover:bg-surface-container-highest transition-colors">
                      <Link
                        to="/account/notifications"
                        onClick={() => setIsNotificationOpen(false)}
                        className="inline-flex items-center gap-1.5 text-sm text-primary font-bold w-full justify-center"
                      >
                        Xem tất cả thông báo
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <Link
                to="/cart"
                className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors relative group hidden sm:flex h-12"
              >
                <ShoppingCart size={22} />
                <span className="text-[11px] font-bold mt-0.5">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-0 w-[18px] h-[18px] bg-secondary-container text-[10px] text-white flex items-center justify-center rounded-full font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Popover Tài Khoản */}
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  onClick={handleAccountClick}
                  className="active:scale-95 transition-transform flex flex-col items-center justify-center min-w-[64px] h-12 rounded-xl bg-primary-container text-on-primary-container shadow-sm hover:shadow border border-primary-container/20 hover:bg-primary-container/80"
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
                          className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl active:scale-95 text-center hover:bg-secondary transition-colors block shadow-md shadow-primary/20"
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
                          className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl active:scale-95 hover:bg-secondary transition-colors text-center block shadow-md shadow-primary/20"
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
                          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                        >
                          <Truck size={20} />
                          Tra cứu đơn hàng
                        </Link>
                        <a
                          href="tel:18006601"
                          className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
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
          isAccountOpen || isNotificationOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => {
          setIsAccountOpen(false);
          setIsNotificationOpen(false);
        }}
      />
    </>
  );
}
