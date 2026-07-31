import {
  ChevronRight,
  CircleDollarSign,
  Gift,
  Headphones,
  Heart,
  PackageCheck,
  Pencil,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";
import { AccountSidebar } from "../components/AccountShell";

const favoritePhones = [
  ["iPhone 15 Pro Max", "29.490.000đ", 0],
  ["Samsung Galaxy S24 Ultra", "26.990.000đ", 1],
  ["Xiaomi 14 Ultra", "22.490.000đ", 2],
] as const;

export function AccountOverviewPage() {
  return (
    <StorePageLayout title="Tổng quan tài khoản - PinkPhone">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <AccountSidebar />

          <div className="min-w-0 space-y-6">
            <section className="rounded-2xl border border-border bg-white p-5 shadow-card sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid size-16 place-items-center rounded-2xl bg-surface-soft text-2xl font-black text-primary">
                    MA
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                        Nguyễn Minh Anh
                      </h1>
                      <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                        <Pencil size={15} /> Chỉnh sửa
                      </button>
                    </div>
                    <p className="mt-1 text-muted">098***4567 · ID: PP-992834</p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-extrabold text-white">
                  Hạng Vàng
                </span>
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm font-bold">
                  <span>Tiến trình nâng hạng Kim cương</span>
                  <span className="text-primary">Còn thiếu 15.000.000đ</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-soft">
                  <div className="h-full w-4/5 rounded-full bg-primary" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted">
                  <span>Hạng Vàng</span>
                  <span>Hạng Kim cương</span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Thống kê tài khoản">
              <StatCard icon={PackageCheck} value="12" label="Tổng đơn" />
              <StatCard icon={CircleDollarSign} value="85M" label="Chi tiêu" />
              <StatCard icon={Star} value="1.200" label="Điểm tích lũy" />
              <StatCard icon={Heart} value="8" label="Yêu thích" />
            </section>

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-6">
                <section className="overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
                    <h2 className="text-xl font-black sm:text-2xl">Đơn hàng gần đây</h2>
                    <a href="#orders" className="text-sm font-bold text-primary">Xem tất cả</a>
                  </div>
                  <RecentOrder index={0} name="iPhone 15 Pro Max 256GB" code="#ORD-7721" price="32.990.000đ" />
                  <RecentOrder index={1} name="Samsung Galaxy S24 Ultra" code="#ORD-6612" price="26.990.000đ" />
                </section>

                <section className="overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
                    <h2 className="text-xl font-black sm:text-2xl">Điện thoại yêu thích</h2>
                    <Link to="/" className="text-sm font-bold text-primary">Xem tất cả</Link>
                  </div>
                  <div className="grid sm:grid-cols-3">
                    {favoritePhones.map(([name, price, index]) => (
                      <Link
                        to="/san-pham/pinkphone-ultra-x"
                        key={name}
                        className="border-b border-border p-5 transition hover:bg-surface-soft sm:border-b-0 sm:border-r last:border-0"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft">
                          <PhoneStripImage index={index} />
                        </div>
                        <h3 className="mt-4 text-sm font-bold">{name}</h3>
                        <p className="mt-1 font-extrabold text-primary">{price}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <section className="rounded-2xl bg-primary p-5 text-white">
                  <div className="flex items-center gap-2">
                    <Ticket size={21} />
                    <h2 className="text-xl font-black">Mã giảm giá của bạn</h2>
                  </div>
                  <Voucher code="PINKMEMBER" text="Giảm 500k đơn điện thoại từ 15M" />
                  <Voucher code="MEMBERGOLD" text="Giảm thêm 2% giá máy" />
                  <button type="button" className="mt-4 min-h-11 w-full rounded-xl bg-white text-sm font-bold text-primary">
                    Xem kho voucher
                  </button>
                </section>

                <section className="rounded-2xl border border-dashed border-primary bg-surface-soft p-5">
                  <h2 className="font-extrabold">Hoàn thiện hồ sơ</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Hoàn thành thông tin để nhận thêm điểm thưởng và ưu đãi cá nhân hóa.
                  </p>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-2 text-success"><ShieldCheck size={17} /> Xác thực số điện thoại</li>
                    <li className="flex items-center gap-2"><UserRound size={17} /> Thêm ngày sinh nhật</li>
                    <li className="flex items-center gap-2"><WalletCards size={17} /> Liên kết phương thức thanh toán</li>
                  </ul>
                  <button type="button" className="mt-5 min-h-11 w-full rounded-xl bg-primary text-sm font-bold text-white">
                    Cập nhật ngay
                  </button>
                </section>

                <section className="rounded-2xl border border-border bg-neutral-soft p-5">
                  <div className="flex items-center gap-2 font-extrabold">
                    <Headphones size={20} className="text-primary" /> Bạn cần hỗ trợ?
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">Đội ngũ PinkPhone luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                  <a href="tel:18006601" className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-white text-sm font-bold">
                    Gọi 1800 6601
                  </a>
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
}: {
  icon: typeof Gift;
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 text-center">
      <Icon className="mx-auto text-primary" size={21} />
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </article>
  );
}

function RecentOrder({
  index,
  name,
  code,
  price,
}: {
  index: number;
  name: string;
  code: string;
  price: string;
}) {
  return (
    <article className="flex flex-col gap-4 border-b border-border p-5 last:border-0 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-surface-soft">
        <PhoneStripImage index={index} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-extrabold">{name}</h3>
        <p className="mt-1 text-xs text-muted">Đơn hàng: {code}</p>
        <span className="mt-2 inline-block rounded-md bg-green-100 px-2 py-1 text-[11px] font-extrabold text-success">
          Giao thành công
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
        <p className="font-extrabold">{price}</p>
        <Link to="/san-pham/pinkphone-ultra-x" className="mt-2 inline-flex items-center text-sm font-bold text-primary">
          Mua lại <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function Voucher({ code, text }: { code: string; text: string }) {
  return (
    <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-4">
      <p className="font-black">{code}</p>
      <p className="mt-1 text-xs leading-5 text-white/85">{text}</p>
    </div>
  );
}
