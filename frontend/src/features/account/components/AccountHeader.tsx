import { Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../../shared/components/BrandLogo";

export function AccountHeader() {
  return (
    <header className="bg-surface dark:bg-surface-dim shadow-sm sticky top-0 z-50">
      <div className="flex flex-col w-full max-w-[1200px] mx-auto px-4 md:px-margin-desktop py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-display-lg text-display-lg font-black text-primary dark:text-primary-fixed"
          >
            PinkPhone
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-primary font-bold border-b-2 border-primary pb-1 font-label-sm text-label-sm"
            >
              Thanh thông báo
            </Link>
            <Link
              to="/cua-hang"
              className="text-on-surface-variant font-medium hover:text-secondary transition-colors font-label-sm text-label-sm"
            >
              Cửa hàng
            </Link>
            <Link
              to="/tra-cuu"
              className="text-on-surface-variant font-medium hover:text-secondary transition-colors font-label-sm text-label-sm"
            >
              Tra cứu
            </Link>
            <Link
              to="/hotline"
              className="text-on-surface-variant font-medium hover:text-secondary transition-colors font-label-sm text-label-sm"
            >
              Hotline
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-container rounded-full transition-all active:scale-95">
              <Percent size={24} className="text-primary" />
            </button>
            <Link
              to="/cart"
              className="px-4 py-2 bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm active:scale-95 transition-all"
            >
              Giỏ hàng
            </Link>
            <Link
              to="/account"
              className="px-4 py-2 text-primary font-bold hover:bg-surface-container rounded-full font-label-sm text-label-sm"
            >
              Tài khoản
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
