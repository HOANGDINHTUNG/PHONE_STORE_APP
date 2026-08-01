import { Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";

export function AccountHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-10 text-[13px] font-extrabold text-[#757575]">
          <Link
            to="/"
            className="relative flex min-h-16 items-center text-primary"
          >
            Thanh thông báo
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
          </Link>
          <Link
            to="/cua-hang"
            className="flex min-h-16 items-center hover:text-primary transition"
          >
            Cửa hàng
          </Link>
          <Link
            to="/tra-cuu"
            className="flex min-h-16 items-center hover:text-primary transition"
          >
            Tra cứu
          </Link>
          <Link
            to="/hotline"
            className="flex min-h-16 items-center hover:text-primary transition"
          >
            Hotline
          </Link>
        </nav>

        {/* Right Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="hidden font-extrabold text-primary hover:opacity-80 transition md:block"
          >
            %
          </Link>
          <Link
            to="/cart"
            className="flex min-h-8 items-center justify-center rounded-[2rem] bg-primary px-5 text-xs font-bold text-white transition hover:bg-primary-strong shadow-sm"
          >
            Giỏ hàng
          </Link>
          <Link
            to="/account"
            className="text-xs font-bold text-primary hover:opacity-80"
          >
            Tài khoản
          </Link>
        </nav>
      </div>
    </header>
  );
}
