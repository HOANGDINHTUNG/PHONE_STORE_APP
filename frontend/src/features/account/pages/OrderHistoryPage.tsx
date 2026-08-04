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
      <header className="mb-lg">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
          Lịch sử mua hàng
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Xem và quản lý tất cả các đơn hàng bạn đã thực hiện tại PinkPhone.
        </p>
      </header>

      {/* Order Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-sm border-b border-outline-variant mb-lg pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-3 transition-colors ${
              activeTab === tab
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant font-medium hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div className="md:col-span-2 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            size={18}
          />
          <input
            type="search"
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
            placeholder="Tìm kiếm theo mã đơn hoặc tên điện thoại..."
          />
        </div>
        <div className="relative flex items-center">
          <CalendarDays
            className="absolute left-4 z-10 text-on-surface-variant pointer-events-none"
            size={18}
          />
          <select className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none appearance-none transition-all cursor-pointer">
            <option>Tất cả thời gian</option>
            <option>30 ngày qua</option>
            <option>6 tháng qua</option>
            <option>Năm 2024</option>
          </select>
          <ChevronDown
            className="absolute right-4 z-10 text-on-surface-variant pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-lg">
        {orders.map((order) => (
          <article
            key={order.code}
            className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between p-4 bg-surface-container-low border-b border-outline-variant/20">
              <div className="flex items-center gap-lg">
                <span className="font-bold text-primary">{order.code}</span>
                <span className="text-on-surface-variant text-sm flex items-center gap-1">
                  <CalendarDays size={18} /> {order.date}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.statusType === "active"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-outline-variant text-on-surface"
                }`}
              >
                {order.statusType === "active" ? (
                  <Truck size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}{" "}
                {order.status}
              </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-lg">
              <div
                className="w-24 h-24 bg-surface-container rounded-lg p-2 flex items-center justify-center shrink-0"
                title={order.name}
              >
                <img
                  src={order.image}
                  alt={order.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex-1 flex flex-col md:flex-row justify-between gap-lg min-w-0">
                <div className="min-w-0">
                  <h4
                    className="font-headline-md text-headline-md text-on-surface mb-1 truncate"
                    title={order.name}
                  >
                    {order.name}
                  </h4>
                  <p className="text-on-surface-variant font-body-md mb-2 truncate">
                    {order.specs}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">
                      {order.price}
                    </span>
                    {order.oldPrice && (
                      <span className="text-on-surface-variant line-through text-sm">
                        {order.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col justify-end gap-2 md:min-w-[140px]">
                  {order.actions.map((act) => (
                    <Link
                      key={act.label}
                      to={act.link}
                      className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold text-center transition-colors active:scale-95 ${
                        act.primary
                          ? act.label === "Mua lại"
                            ? "bg-secondary-container text-on-secondary-container hover:bg-secondary" // Matches 'Mua lại' in mockup
                            : "bg-primary text-on-primary hover:bg-secondary" // Generic strong button
                          : act.label === "Đánh giá"
                            ? "bg-surface text-on-surface border border-outline hover:bg-surface-container"
                            : "border border-primary text-primary hover:bg-primary-fixed-dim/20"
                      }`}
                    >
                      {act.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-sm mt-xl">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full border border-outline hover:bg-surface-container transition-colors disabled:opacity-30"
          disabled
        >
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold shadow-sm">
          1
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors font-medium">
          2
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors font-medium">
          3
        </button>
        <span className="px-2 text-on-surface-variant">...</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors font-medium">
          10
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline hover:bg-surface-container transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
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
