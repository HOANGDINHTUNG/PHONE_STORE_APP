import {
  CheckCircle2,
  Circle,
  CircleDollarSign,
  Headphones,
  Heart,
  PackageCheck,
  Pencil,
  Star,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../context/StoreContext";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";
import { AccountSidebar } from "../components/AccountShell";

const favoriteProducts = [
  {
    name: "iPhone 14 Pro",
    price: "21.990.000đ",
    image: "/images/prod_iphone15.png",
  },
  {
    name: "Google Pixel 8",
    price: "18.200.000đ",
    image: "/images/prod_s24.png",
  },
  {
    name: "Xiaomi 13 Ultra",
    price: "24.500.000đ",
    image: "/images/prod_xiaomi14.png",
  },
];

export function AccountOverviewPage() {
  const { user } = useStore();

  const displayName = user?.name || "Nguyễn Minh Anh";
  const displayPhone = user?.phone || "098***4567";

  return (
    <StorePageLayout title="Tổng quan tài khoản - PinkPhone">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          {/* Left Navigation Sidebar */}
          <AccountSidebar />

          {/* Main Account Content */}
          <div className="min-w-0 space-y-6">
            {/* Top Profile Card */}
            <section className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-soft border border-border">
                    <img
                      src="/images/prod_iphone15.png"
                      alt={displayName}
                      className="size-full object-cover"
                      onError={(e) => {
                        // Fallback to initial avatar if image fails
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="text-xl font-black text-primary">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground sm:text-3xl">
                        {displayName}
                      </h1>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <Pencil size={13} /> Chỉnh sửa
                      </button>
                    </div>
                    <p className="mt-1 text-xs font-medium text-muted">
                      {displayPhone} &nbsp;·&nbsp; ID: PP-992834
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-extrabold text-white shadow-sm">
                  Hạng Vàng
                </span>
              </div>

              {/* Tier Progress */}
              <div className="mt-6 border-t border-border/60 pt-5">
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs font-bold">
                  <span className="text-foreground">Tiến trình nâng hạng Kim cương</span>
                  <span className="text-primary">Còn thiếu: 15.000.000đ</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-soft">
                  <div className="h-full w-[80%] rounded-full bg-primary" />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted">
                  <span>Hạng Vàng</span>
                  <span>Hạng Kim cương</span>
                </div>
              </div>
            </section>

            {/* 4 Stat Cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Thống kê tài khoản">
              <StatCard value="12" label="Tổng đơn" />
              <StatCard value="85M" label="Chi tiêu" badge="đ" />
              <StatCard icon={Star} value="1.200" label="Điểm tích lũy" />
              <StatCard icon={Heart} value="8" label="Yêu thích" />
            </section>

            {/* Main Section Grid & Right Widgets */}
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-6">
                {/* Recent Orders */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
                    <h2 className="text-xl font-extrabold text-foreground">Đơn hàng gần đây</h2>
                    <Link to="/tai-khoan/lich-su-mua-hang" className="text-xs font-bold text-primary hover:underline">
                      Xem tất cả
                    </Link>
                  </div>

                  <RecentOrderItem
                    name="iPhone 15 Pro Max 256GB - Pink"
                    code="#ORD-7721"
                    date="12/03/2024"
                    price="32.990.000đ"
                    image="/images/prod_iphone15.png"
                  />
                  <RecentOrderItem
                    name="Samsung Galaxy Z Flip5"
                    code="#ORD-6612"
                    date="05/02/2024"
                    price="19.450.000đ"
                    image="/images/prod_s24.png"
                  />
                </section>

                {/* Favorite Products */}
                <section className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
                    <h2 className="text-xl font-extrabold text-foreground">Sản phẩm yêu thích</h2>
                  </div>
                  <div className="grid sm:grid-cols-3">
                    {favoriteProducts.map((p) => (
                      <Link
                        to="/san-pham/pinkphone-ultra-x"
                        key={p.name}
                        className="border-b border-border/60 p-5 transition hover:bg-surface-soft/60 sm:border-b-0 sm:border-r last:border-0"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft p-3 border border-border/50">
                          <img src={p.image} alt={p.name} className="size-full object-contain" />
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-foreground">{p.name}</h3>
                        <p className="mt-1 font-extrabold text-primary text-sm">{p.price}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Sidebar Column */}
              <aside className="space-y-4">
                {/* Pink Vouchers Widget */}
                <section className="rounded-2xl bg-primary p-5 text-white shadow-sm">
                  <div className="flex items-center gap-2">
                    <Ticket size={22} />
                    <h2 className="text-lg font-extrabold">Mã giảm giá của bạn</h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold tracking-wide">PINKSPRING24</span>
                        <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">Sắp hết hạn</span>
                      </div>
                      <p className="mt-1 text-xs text-white/90">Giảm 500k đơn từ 15M</p>
                      <p className="mt-1 text-[10px] text-white/70">Hết hạn: 3 ngày nữa</p>
                    </div>

                    <div className="rounded-xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-sm">
                      <span className="font-extrabold tracking-wide">MEMBERGOLD</span>
                      <p className="mt-1 text-xs text-white/90">Giảm 2% phụ kiện</p>
                      <p className="mt-1 text-[10px] text-white/70">Hết hạn: 15/04/2024</p>
                    </div>
                  </div>

                  <Link
                    to="/tai-khoan/ma-giam-gia"
                    className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-white text-xs font-extrabold text-primary hover:bg-white/95 transition shadow-sm"
                  >
                    Xem kho voucher
                  </Link>
                </section>

                {/* Complete Profile Widget */}
                <section className="rounded-2xl border border-dashed border-primary/50 bg-white p-5 shadow-sm">
                  <h2 className="font-extrabold text-foreground text-base">Hoàn thiện hồ sơ</h2>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Hoàn thành thông tin để nhận thêm 200 điểm thưởng và ưu đãi cá nhân hóa.
                  </p>
                  <ul className="mt-4 space-y-2.5 text-xs">
                    <li className="flex items-center gap-2 font-semibold text-success">
                      <CheckCircle2 size={16} className="text-success shrink-0" /> Xác thực số điện thoại
                    </li>
                    <li className="flex items-center gap-2 text-muted">
                      <Circle size={16} className="text-muted/60 shrink-0" /> Thêm ngày sinh nhật
                    </li>
                    <li className="flex items-center gap-2 text-muted">
                      <Circle size={16} className="text-muted/60 shrink-0" /> Liên kết tài khoản mạng xã hội
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="mt-5 min-h-10 w-full rounded-xl bg-primary text-xs font-extrabold text-white hover:bg-primary-strong transition shadow-sm"
                  >
                    Cập nhật ngay
                  </button>
                </section>

                {/* Need Support Widget */}
                <section className="rounded-2xl border border-border/80 bg-neutral-soft p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-extrabold text-foreground text-sm">
                    <Headphones size={18} className="text-primary" /> Bạn cần hỗ trợ?
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    Đội ngũ CSKH PinkPhone luôn sẵn sàng lắng nghe bạn 24/7.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      className="inline-flex min-h-9 items-center justify-center rounded-xl bg-white border border-border font-bold hover:bg-surface-soft transition"
                    >
                      Chat ngay
                    </button>
                    <a
                      href="tel:18006601"
                      className="inline-flex min-h-9 items-center justify-center rounded-xl bg-white border border-border font-bold hover:bg-surface-soft transition"
                    >
                      Gọi hotline
                    </a>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </StorePageLayout>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  badge,
}: {
  icon?: typeof Heart;
  value: string;
  label: string;
  badge?: string;
}) {
  return (
    <article className="rounded-2xl border border-border/80 bg-white p-4 text-center shadow-sm">
      {Icon && <Icon className="mx-auto text-primary" size={20} />}
      {badge && <span className="mx-auto text-xs font-black text-primary">{badge}</span>}
      <p className="mt-2 text-2xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted font-medium">{label}</p>
    </article>
  );
}

function RecentOrderItem({
  name,
  code,
  date,
  price,
  image,
}: {
  name: string;
  code: string;
  date: string;
  price: string;
  image: string;
}) {
  return (
    <article className="flex flex-col gap-4 border-b border-border/60 p-5 last:border-0 sm:flex-row sm:items-center">
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-surface-soft p-2 border border-border/50">
        <img src={image} alt={name} className="size-full object-contain" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold text-sm text-foreground">{name}</h3>
        <p className="mt-1 text-xs text-muted">
          Đơn hàng: {code} &nbsp;|&nbsp; {date}
        </p>
        <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 border border-emerald-200">
          THÀNH CÔNG
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
        <p className="font-extrabold text-foreground text-sm">{price}</p>
        <Link
          to="/san-pham/pinkphone-ultra-x"
          className="inline-flex min-h-8 items-center justify-center rounded-full border border-primary px-4 text-xs font-bold text-primary hover:bg-primary/10 transition"
        >
          Mua lại
        </Link>
      </div>
    </article>
  );
}
