import { CalendarDays, ChevronLeft, ChevronRight, PackageOpen, Search, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

const orders = [
  {
    code: "#PP123-001",
    date: "15/10/2024",
    name: "iPhone 16 Pro Max - Pink Titanium",
    variant: "256GB · Hồng",
    price: "34.990.000đ",
    oldPrice: "36.990.000đ",
    status: "Đang giao",
    index: 0,
  },
  {
    code: "#PP122-890",
    date: "02/09/2024",
    name: "Samsung Galaxy S24 Ultra",
    variant: "512GB · Tím",
    price: "26.490.000đ",
    oldPrice: "29.990.000đ",
    status: "Hoàn thành",
    index: 1,
  },
  {
    code: "#PP121-456",
    date: "15/07/2024",
    name: "Xiaomi 14 Ultra",
    variant: "256GB · Đen",
    price: "22.490.000đ",
    oldPrice: "25.990.000đ",
    status: "Hoàn thành",
    index: 2,
  },
] as const;

export function OrderHistoryPage({ empty = false }: { empty?: boolean }) {
  return (
    <AccountShell
      title={empty ? "Lịch sử mua hàng (Trống)" : "Lịch sử mua hàng"}
      description="Xem và quản lý tất cả đơn hàng điện thoại bạn đã thực hiện tại PinkPhone."
    >
      {empty ? <EmptyHistory /> : <HistoryContent />}
    </AccountShell>
  );
}

function HistoryContent() {
  return (
    <>
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        {["Tất cả", "Chờ xác nhận", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].map((tab, index) => (
          <button
            type="button"
            key={tab}
            className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold ${
              index === 0 ? "bg-primary text-white" : "text-muted hover:bg-surface-soft"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="my-5 grid gap-3 sm:grid-cols-[1fr_13rem]">
        <label className="relative">
          <span className="sr-only">Tìm kiếm đơn hàng</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input className="min-h-12 w-full rounded-xl border border-border bg-white pl-11 pr-4 outline-none focus:border-primary" placeholder="Tìm theo mã đơn hoặc tên điện thoại..." />
        </label>
        <button type="button" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white font-semibold">
          <CalendarDays size={18} /> Tất cả thời gian
        </button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Panel key={order.code} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-soft px-5 py-3 text-sm">
              <div className="flex items-center gap-4">
                <strong className="text-primary">{order.code}</strong>
                <span className="inline-flex items-center gap-1 text-muted"><CalendarDays size={15} /> {order.date}</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                order.status === "Đang giao" ? "bg-primary text-white" : "bg-neutral-soft text-muted"
              }`}>
                {order.status}
              </span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft">
                <PhoneStripImage index={order.index} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold">{order.name}</h2>
                <p className="mt-1 text-sm text-muted">{order.variant} · Số lượng 01</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <strong className="text-lg text-primary">{order.price}</strong>
                  <del className="text-xs text-muted">{order.oldPrice}</del>
                </div>
              </div>
              <div className="grid min-w-32 gap-2">
                {order.status === "Đang giao" ? (
                  <Link to="/tai-khoan/theo-doi-don-hang" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white">
                    Theo dõi
                  </Link>
                ) : (
                  <Link to="/san-pham/pinkphone-ultra-x" className="inline-flex min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-white">
                    Mua lại
                  </Link>
                )}
                <Link to="/tai-khoan/don-hang/PP123-001" className="inline-flex min-h-10 items-center justify-center rounded-xl border border-primary px-4 text-sm font-bold text-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <nav className="mt-7 flex justify-center gap-2" aria-label="Phân trang">
        <button type="button" className="grid size-10 place-items-center rounded-full border border-border"><ChevronLeft size={18} /></button>
        {[1, 2, 3].map((page) => <button type="button" key={page} className={`size-10 rounded-full ${page === 1 ? "bg-primary text-white" : ""}`}>{page}</button>)}
        <button type="button" className="grid size-10 place-items-center rounded-full border border-border"><ChevronRight size={18} /></button>
      </nav>
    </>
  );
}

function EmptyHistory() {
  return (
    <Panel className="p-6 text-center sm:p-12">
      <div className="mx-auto grid size-28 place-items-center rounded-full bg-surface-soft text-primary">
        <PackageOpen size={48} />
      </div>
      <h2 className="mt-6 text-xl font-extrabold">Bạn chưa có đơn hàng nào gần đây</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
        Khám phá các mẫu điện thoại mới nhất và ưu đãi dành riêng cho bạn tại PinkPhone.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 font-bold text-white">Mua sắm ngay</Link>
        <Link to="/#promotions" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-soft px-6 font-bold">Xem khuyến mãi</Link>
      </div>
      <div className="mt-10 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
        {["Bảo hành 24 tháng", "Giao hỏa tốc 2h", "Thu cũ đổi mới"].map((benefit) => (
          <div key={benefit} className="flex items-center justify-center gap-2 text-sm font-bold text-muted">
            <Truck size={18} className="text-primary" /> {benefit}
          </div>
        ))}
      </div>
    </Panel>
  );
}

