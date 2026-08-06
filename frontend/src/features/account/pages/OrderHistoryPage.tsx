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
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi, OrderResponse } from "../../../api/orderService";

import { AlertCircle } from "lucide-react";

export function OrderHistoryPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["myOrders", 1],
    queryFn: () => getMyOrdersApi(1, 20),
  });

  const orders = data?.items || data?.content || [];
  const isEmpty = !isLoading && !isError && orders.length === 0;

  const httpStatus = (error as any)?.response?.status;

  return (
    <AccountShell
      title={isError ? "Lỗi tải đơn hàng | PinkPhone" : isEmpty ? "Lịch sử mua hàng (Trống)" : "Lịch sử mua hàng"}
      description="Xem và quản lý tất cả các đơn hàng bạn đã thực hiện tại PinkPhone."
    >
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : isError ? (
        <Panel className="p-8 text-center border border-red-200 bg-red-50/50 rounded-2xl">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle size={36} />
          </div>
          <h3 className="text-lg font-bold text-red-700 mb-2">
            Không thể lấy danh sách đơn hàng
          </h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-5 leading-relaxed">
            {httpStatus === 401
              ? "Phiên đăng nhập đã hết hạn (Mã lỗi: 401 Unauthorized). Vui lòng đăng nhập lại."
              : httpStatus === 403
              ? "Bạn không có quyền truy cập dữ liệu đơn hàng (Mã lỗi: 403 Forbidden)."
              : httpStatus
              ? `Máy chủ phản hồi mã lỗi HTTP: ${httpStatus}. Vui lòng thử lại sau.`
              : "Không thể kết nối đến máy chủ backend (ERR_CONNECTION_REFUSED hoặc lỗi mạng)."}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              type="button"
              className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition"
            >
              Thử lại
            </button>
            {httpStatus === 401 && (
              <Link
                to="/login"
                className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-strong transition"
              >
                Đăng nhập lại
              </Link>
            )}
          </div>
        </Panel>
      ) : isEmpty ? (
        <EmptyHistory />
      ) : (
        <HistoryContent orders={orders} />
      )}
    </AccountShell>
  );
}

function HistoryContent({ orders }: { orders: OrderResponse[] }) {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const tabs = [
    "Tất cả",
    "Chờ xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Hoàn thành",
    "Đã hủy",
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "PARTIALLY_RETURNED":
        return "Đổi trả một phần";
      case "RETURNED":
        return "Đã đổi trả";
      default:
        return status;
    }
  };

  const getStatusType = (status: string) => {
    if (status === "DELIVERED" || status === "COMPLETED" || status === "CANCELLED" || status === "RETURNED") return "completed";
    return "active";
  };

  const filteredOrders = orders.filter((o) => {
    // Tab filter
    if (activeTab !== "Tất cả" && getStatusText(o.status) !== activeTab) {
      return false;
    }
    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const codeMatch = o.orderCode?.toLowerCase().includes(q);
      const itemMatch = o.items?.some((i) =>
        i.productName?.toLowerCase().includes(q) || i.variantName?.toLowerCase().includes(q)
      );
      if (!codeMatch && !itemMatch) return false;
    }
    // Time filter
    if (timeFilter !== "ALL" && o.createdAt) {
      const orderDate = new Date(o.createdAt).getTime();
      const now = new Date().getTime();
      const days = (now - orderDate) / (1000 * 3600 * 24);
      if (timeFilter === "30" && days > 30) return false;
      if (timeFilter === "180" && days > 180) return false;
    }
    return true;
  });

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all"
            placeholder="Tìm kiếm theo mã đơn hoặc tên sản phẩm..."
          />
        </div>
        <div className="relative flex items-center">
          <CalendarDays
            className="absolute left-4 z-10 text-on-surface-variant pointer-events-none"
            size={18}
          />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none appearance-none transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả thời gian</option>
            <option value="30">30 ngày qua</option>
            <option value="180">6 tháng qua</option>
          </select>
          <ChevronDown
            className="absolute right-4 z-10 text-on-surface-variant pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-lg">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-muted">Không tìm thấy đơn hàng nào phù hợp.</div>
        ) : (
          filteredOrders.map((order) => {
            const firstItem = order.items && order.items[0];
            const extraCount = order.items ? order.items.length - 1 : 0;
            const statusType = getStatusType(order.status);
            const totalAmount = order.grandTotalAmount ?? order.total ?? 0;
            const formattedDate = order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;
            
            return (
              <article
                key={order.orderCode}
                className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between p-4 bg-surface-container-low border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">#{order.orderCode}</span>
                    {formattedDate && (
                      <span className="text-xs text-muted">({formattedDate})</span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      statusType === "active"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-outline-variant text-on-surface"
                    }`}
                  >
                    {statusType === "active" ? (
                      <Truck size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}{" "}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-lg">
                  <div className="w-24 h-24 bg-surface-container rounded-lg p-2 flex items-center justify-center shrink-0 border border-outline-variant/20 overflow-hidden">
                    {firstItem?.imageUrl ? (
                      <img
                        src={firstItem.imageUrl}
                        alt={firstItem.productName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <PackageOpen size={40} className="text-muted" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row justify-between gap-lg min-w-0">
                    <div className="min-w-0">
                      {firstItem && (
                        <>
                          <h4
                            className="font-headline-md text-headline-md text-on-surface mb-1 truncate"
                            title={firstItem.productName}
                          >
                            {firstItem.productName}
                          </h4>
                          <p className="text-on-surface-variant text-sm mb-2">
                            {firstItem.ram || firstItem.storage || firstItem.color ? (
                              <span className="inline-block bg-surface-soft px-2 py-0.5 rounded text-xs text-on-surface font-medium mr-2">
                                {[firstItem.ram, firstItem.storage, firstItem.color].filter(Boolean).join(" - ")}
                              </span>
                            ) : null}
                            Số lượng: x{firstItem.quantity}
                          </p>
                          {extraCount > 0 && (
                            <p className="text-xs text-secondary italic mb-2">
                              (Và {extraCount} sản phẩm khác...)
                            </p>
                          )}
                        </>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted">Tổng thanh toán:</span>
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-col justify-end gap-2 md:min-w-[140px]">
                      <Link
                        to={`/account/tracking?orderCode=${order.orderCode}`}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold text-center transition-colors active:scale-95 bg-secondary-container text-on-secondary-container hover:bg-secondary"
                      >
                        Theo dõi
                      </Link>
                      {(order.status === "DELIVERED" || order.status === "COMPLETED") && (
                        <Link
                          to="/account/reviews"
                          className="flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold text-center transition-colors active:scale-95 bg-surface text-on-surface border border-outline hover:bg-surface-container"
                        >
                          Đánh giá
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
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
      </div>
    </Panel>
  );
}
