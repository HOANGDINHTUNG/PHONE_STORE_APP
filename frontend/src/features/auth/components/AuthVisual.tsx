import { ShieldCheck, Truck } from "lucide-react";
import authImage from "../../../assets/pinkphone-auth.png";
import { BrandLogo } from "../../../shared/components/BrandLogo";

type AuthVisualProps = {
  mode: "login" | "register";
};

export function AuthVisual({ mode }: AuthVisualProps) {
  return (
    <aside className="relative hidden min-h-[46rem] overflow-hidden rounded-[1.75rem] bg-primary lg:block">
      <img
        src={authImage}
        alt="Bộ sưu tập điện thoại PinkPhone màu hồng"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary-strong/95" />

      <div className="relative flex h-full flex-col justify-between p-10 text-white">
        <BrandLogo inverse />

        <div className="max-w-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
            {mode === "login" ? "Trở lại PinkPhone" : "Thành viên PinkPhone"}
          </p>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-[-0.04em] xl:text-5xl">
            {mode === "login"
              ? "Công nghệ tinh tế, trải nghiệm thật gần."
              : "Chào mừng đến với PinkPhone."}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
            {mode === "login"
              ? "Đăng nhập để theo dõi đơn hàng và khám phá ưu đãi dành riêng cho bạn."
              : "Khám phá smartphone mới, lưu sản phẩm yêu thích và nhận ưu đãi thành viên."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <Truck size={21} aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">Giao hàng miễn phí</p>
              <p className="mt-1 text-xs text-white/70">Cho đơn từ 5 triệu</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <ShieldCheck size={21} aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">Bảo hành 12 tháng</p>
              <p className="mt-1 text-xs text-white/70">Chính hãng 100%</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
