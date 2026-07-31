import { HelpCircle, LogIn, PackageSearch, UserPlus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Chào mừng bạn!",
  subtitle = "Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận ưu đãi thành viên.",
}: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-label="Yêu cầu đăng nhập"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-foreground"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        <div className="text-left">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/dang-nhap");
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-strong active:scale-[0.98]"
            >
              <LogIn size={18} /> Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/dang-ky");
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-neutral-soft px-5 text-sm font-bold text-foreground transition hover:bg-border active:scale-[0.98]"
            >
              <UserPlus size={18} /> Đăng ký tài khoản
            </button>
          </div>

          <div className="mt-6 grid gap-2 border-t border-border pt-4 text-sm text-muted">
            <Link
              to="/tai-khoan/theo-doi-don-hang"
              onClick={onClose}
              className="flex min-h-10 items-center gap-3 rounded-lg px-2 hover:bg-surface-soft hover:text-primary"
            >
              <PackageSearch size={18} className="text-primary" /> Tra cứu đơn hàng
            </Link>
            <Link
              to="/tai-khoan/ho-tro"
              onClick={onClose}
              className="flex min-h-10 items-center gap-3 rounded-lg px-2 hover:bg-surface-soft hover:text-primary"
            >
              <HelpCircle size={18} className="text-primary" /> Bạn cần hỗ trợ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
