import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Search,
  Truck,
} from "lucide-react";
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
      {
        label: "Theo dõi",
        primary: true,
        link: "/tai-khoan/theo-doi-don-hang",
      },
      {
        label: "Xem chi tiết",
        outline: true,
        link: "/tai-khoan/don-hang/PP123-001",
      },
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
      {
        label: "Xem chi tiết",
        outline: true,
        link: "/tai-khoan/don-hang/PP123-001",
      },
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
      {
        label: "Xem chi tiết",
        outline: true,
        link: "/tai-khoan/don-hang/PP123-001",
      },
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
      <div className="flex gap-[3.5rem] overflow-x-auto border-b border-border/70 pb-3 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-h-[2.25rem] shrink-0 border-b-[3px] border-transparent font-bold transition -mb-[15px] whitespace-nowrap text-[13px] ${
              activeTab === tab
                ? "!border-primary text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Date Filter Bar */}
      <div className="my-[22px] flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex min-h-[2.85rem] flex-1 items-center">
          <span className="sr-only">Tìm kiếm đơn hàng</span>
          <Search
            className="absolute left-4 text-muted pointer-events-none"
            size={18}
          />
          <input
            type="search"
            className="size-full rounded-[0.75rem] border border-border bg-white pl-[2.85rem] pr-4 text-[13px] outline-none transition focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
            placeholder="Tìm kiếm theo mã đơn hoặc tên điện thoại..."
          />
        </label>

        <button
          type="button"
          className="flex min-h-[2.85rem] min-w-[15rem] items-center justify-between rounded-[0.75rem] border border-border bg-white px-4 text-[13px] font-semibold text-foreground transition shadow-sm hover:bg-neutral-50"
        >
          <span className="flex items-center gap-2">
            <Calendar size={17} className="opacity-70" /> Tất cả thời gian
          </span>
          <ChevronDown size={17} className="opacity-70" />
        </button>
      </div>

      {/* Order Cards */}
      <div className="space-y-[22px]">
        {orders.map((order) => (
          <article
            key={order.code}
            className="rounded-[1rem] border border-border/70 bg-white shadow-sm overflow-hidden"
          >
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 bg-[#FAFAFA] px-5 py-3">
              <div className="flex items-center gap-[1.125rem]">
                <strong className="text-primary font-bold text-sm tracking-wide">
                  {order.code}
                </strong>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted font-medium">
                  <CalendarDays size={14} className="opacity-80" /> {order.date}
                </span>
              </div>
              <span
                className={`inline-flex min-h-[1.75rem] items-center gap-1.5 rounded-[1rem] px-[12px] text-[10px] font-bold uppercase tracking-widest ${
                  order.statusType === "active"
                    ? "bg-[#D81B60] text-white"
                    : "bg-[#EAEAEA] text-[#333333]"
                }`}
              >
                {order.statusType === "active" ? (
                  <Truck size={12} />
                ) : (
                  <CheckCircle2 size={12} />
                )}{" "}
                {order.status}
              </span>
            </div>

            {/* Content row */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-[1.375rem]">
              <div className="flex flex-1 items-center gap-5">
                <div className="relative grid size-[5.5rem] shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-[#F7F7F7] border border-[#EBEBEB]">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="size-4/5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="min-w-0 pb-1">
                  <h3 className="text-[15px] font-bold text-foreground">
                    {order.name}
                  </h3>
                  <p className="mt-[2px] text-[12px] font-medium text-muted">
                    {order.specs}
                  </p>
                  <div className="mt-2.5 flex items-end gap-2.5">
                    <span className="text-[15px] font-bold text-[#D81B60] leading-none">
                      {order.price}
                    </span>
                    {order.oldPrice && (
                      <del className="text-[12px] font-medium text-muted leading-none">
                        {order.oldPrice}
                      </del>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:min-w-[9rem] shrink-0 gap-[10px] sm:pl-3 border-t sm:border-t-0 border-border/40 pt-4 sm:pt-0 sm:justify-center">
                {order.actions.map((act) => (
                  <Link
                    key={act.label}
                    to={act.link}
                    className={`inline-flex min-h-[2.125rem] w-full items-center justify-center rounded-[0.4rem] px-[18px] text-[12px] font-bold transition ${
                      act.primary
                        ? "bg-[#D81B60] text-white hover:bg-[#C2185B] shadow-sm"
                        : "border border-[#D81B60]/30 bg-[#FFF0F4] text-[#D81B60] hover:bg-[#FFE5EC]"
                    } ${
                      act.label === "Đánh giá"
                        ? "!border !border-border !bg-white !text-foreground font-semibold shadow-sm hover:!bg-neutral-50"
                        : ""
                    }`}
                  >
                    {act.label}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <nav
        className="mt-10 flex items-center justify-center gap-[6px]"
        aria-label="Phân trang"
      >
        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full border border-border text-muted hover:border-primary hover:text-primary transition"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full bg-[#D81B60] text-[13px] font-bold text-white shadow-sm"
        >
          1
        </button>
        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full text-[13px] font-semibold text-muted hover:bg-[#F3F4F6] hover:text-foreground"
        >
          2
        </button>
        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full text-[13px] font-semibold text-muted hover:bg-[#F3F4F6] hover:text-foreground"
        >
          3
        </button>

        <span className="px-2 text-[13px] font-semibold text-muted">...</span>

        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full text-[13px] font-semibold text-muted hover:bg-[#F3F4F6] hover:text-foreground"
        >
          10
        </button>

        <button
          type="button"
          className="grid size-[2.125rem] place-items-center rounded-full border border-border text-muted hover:border-primary hover:text-primary transition"
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
      <h2 className="mt-6 text-xl font-extrabold">
        Bạn chưa có đơn hàng nào gần đây
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
        Khám phá các mẫu điện thoại mới nhất và ưu đãi dành riêng cho bạn tại
        PinkPhone.
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
        {["Bảo hành 24 tháng", "Giao hỏa tốc 2h", "Thu cũ đổi mới"].map(
          (benefit) => (
            <div
              key={benefit}
              className="flex items-center justify-center gap-2 text-sm font-bold text-muted"
            >
              <Truck size={18} className="text-primary" /> {benefit}
            </div>
          ),
        )}
      </div>
    </Panel>
  );
}
