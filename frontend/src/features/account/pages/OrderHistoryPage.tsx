import { CalendarDays, ChevronLeft, ChevronRight, PackageOpen, Search, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";

const orders = [
  {
    code: "#PP123-001",
    date: "15/10/2024",
    name: "iPhone 16 Pro Max - Pink Titanium",
    specs: "Dung lượng: 256GB | Số lượng: 01",
    price: "34.990.000đ",
    oldPrice: "36.990.000đ",
    status: "ĐANG GIAO",
    statusType: "active",
    image: "/images/prod_iphone15.png",
    actions: [
      { label: "Theo dõi", primary: true, link: "/tai-khoan/theo-doi-don-hang" },
      { label: "Xem chi tiết", outline: true, link: "/tai-khoan/don-hang/PP123-001" },
    ],
  },
  {
    code: "#PP122-890",
    date: "02/09/2024",
    name: "Samsung Galaxy Z Flip 6",
    specs: "Màu sắc: Rose Gold | Số lượng: 01",
    price: "22.490.000đ",
    status: "HOÀN THÀNH",
    statusType: "completed",
    image: "/images/prod_s24.png",
    actions: [
      { label: "Đánh giá", outline: true, link: "/tai-khoan/danh-gia" },
      { label: "Mua lại", primary: true, link: "/san-pham/pinkphone-ultra-x" },
      { label: "Xem chi tiết", outline: true, link: "/tai-khoan/don-hang/PP123-001" },
    ],
  },
  {
    code: "#PP121-456",
    date: "15/07/2024",
    name: "Apple Watch Series 9 GPS",
    specs: "Dây quấn thể thao hồng | 41mm",
    price: "8.590.000đ",
    status: "HOÀN THÀNH",
    statusType: "completed",
    image: "/images/prod_realmegt.png",
    actions: [
      { label: "Mua lại", primary: true, link: "/san-pham/pinkphone-ultra-x" },
      { label: "Xem chi tiết", outline: true, link: "/tai-khoan/don-hang/PP123-001" },
    ],
  },
];

export function OrderHistoryPage({ empty = false }: { empty?: boolean }) {
  return (
    <AccountShell
      title={empty ? "Lịch sử mua hàng (Trống)" : "Lịch sử mua hàng"}
      description="Xem và quản lý tất cả các đơn hàng bạn đã thực hiện tại PinkPhone."
    >
      {empty ? <EmptyHistory /> : <HistoryContent />}
    </AccountShell>
  );
}

function HistoryContent() {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Hoàn thành",
    "Đã hủy",
    "Trả hàng",
  ];

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-4 overflow-x-auto border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-h-10 shrink-0 border-b-2 px-1 text-sm font-bold transition ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Date Filter Bar */}
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Tìm kiếm đơn hàng</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="search"
            className="min-h-11 w-full rounded-xl border border-border bg-white pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Tìm kiếm theo mã đơn hoặc tên điện thoại..."
          />
        </label>

        <select className="min-h-11 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary">
          <option value="all">Tất cả thời gian</option>
          <option value="30">30 ngày qua</option>
          <option value="90">90 ngày qua</option>
          <option value="2024">Năm 2024</option>
        </select>
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Panel key={order.code} className="overflow-hidden border border-border/80 shadow-sm">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-soft/60 px-5 py-3 text-sm border-b border-border/50">
              <div className="flex items-center gap-4">
                <strong className="text-primary font-black">{order.code}</strong>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <CalendarDays size={14} /> {order.date}
                </span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide ${
                  order.statusType === "active"
                    ? "bg-primary text-white"
                    : "bg-neutral-soft text-muted"
                }`}
              >
                {order.statusType === "completed" ? "✓ " : ""}
                {order.status}
              </span>
            </div>

            {/* Content row */}
            <div className="grid gap-4 p-5 sm:grid-cols-[6.5rem_1fr_auto] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft p-2 border border-border">
                <img
                  src={order.image}
                  alt={order.name}
                  className="size-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-foreground">{order.name}</h3>
                <p className="mt-1 text-xs text-muted">{order.specs}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-primary">{order.price}</span>
                  {order.oldPrice && (
                    <del className="text-xs text-muted">{order.oldPrice}</del>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end sm:min-w-32">
                {order.actions.map((act) => (
                  <Link
                    key={act.label}
                    to={act.link}
                    className={`inline-flex min-h-9 items-center justify-center rounded-xl px-4 text-xs font-bold transition ${
                      act.primary
                        ? "bg-primary text-white hover:bg-primary-strong shadow-sm"
                        : "border border-primary text-primary hover:bg-primary/10"
                    }`}
                  >
                    {act.label}
                  </Link>
                ))}
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Pagination */}
      <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Phân trang">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full border border-border text-muted hover:border-primary hover:text-primary transition"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full bg-primary font-bold text-white shadow-sm"
        >
          1
        </button>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full text-sm font-semibold text-muted hover:bg-surface-soft hover:text-foreground"
        >
          2
        </button>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-full text-sm font-semibold text-muted hover:bg-surface-soft hover:text-foreground"
        >
          3
        </button>

        <span className="px-1 text-xs text-muted">...</span>

        <button
          type="button"
          className="grid size-9 place-items-center rounded-full text-sm font-semibold text-muted hover:bg-surface-soft hover:text-foreground"
        >
          10
        </button>

        <button
          type="button"
          className="grid size-9 place-items-center rounded-full border border-border text-muted hover:border-primary hover:text-primary transition"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </>
  );
}

function EmptyHistory() {
  return (
    <Panel className="p-6 text-center sm:p-12">
      <div className="mx-auto grid size-24 place-items-center rounded-full bg-surface-soft text-primary">
        <PackageOpen size={42} />
      </div>
      <h2 className="mt-6 text-xl font-extrabold">Bạn chưa có đơn hàng nào gần đây</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
        Khám phá các mẫu điện thoại mới nhất và ưu đãi dành riêng cho bạn tại PinkPhone.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 font-bold text-white hover:bg-primary-strong transition"
        >
          Mua sắm ngay
        </Link>
        <Link
          to="/#promotions"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-soft px-6 font-bold hover:bg-border transition"
        >
          Xem khuyến mãi
        </Link>
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
