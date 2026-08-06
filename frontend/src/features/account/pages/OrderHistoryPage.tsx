import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Truck,
  Loader2,
  ShoppingBag,
  Compass,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi, OrderResponse } from "../../../api/orderService";

import { AlertCircle, PackageOpen } from "lucide-react";

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
      title={
        isError
          ? "Lỗi tải đơn hàng | PinkPhone"
          : isEmpty
            ? "Lịch sử mua hàng (Trống)"
            : "Lịch sử mua hàng"
      }
      description="Xem và quản lý tất cả các đơn hàng bạn đã thực hiện tại PinkPhone."
    >
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : isError ? (
        <Panel className="w-full p-8 text-center border border-red-200 bg-red-50/50 rounded-2xl">
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
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

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
    if (
      status === "DELIVERED" ||
      status === "COMPLETED" ||
      status === "CANCELLED" ||
      status === "RETURNED"
    )
      return "completed";
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
      const itemMatch = o.items?.some(
        (i) =>
          i.productName?.toLowerCase().includes(q) ||
          i.variantName?.toLowerCase().includes(q),
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
          <div className="text-center py-10 text-muted">
            Không tìm thấy đơn hàng nào phù hợp.
          </div>
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
                    <span className="font-bold text-primary">
                      #{order.orderCode}
                    </span>
                    {formattedDate && (
                      <span className="text-xs text-muted">
                        ({formattedDate})
                      </span>
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
                            {firstItem.ram ||
                            firstItem.storage ||
                            firstItem.color ? (
                              <span className="inline-block bg-surface-soft px-2 py-0.5 rounded text-xs text-on-surface font-medium mr-2">
                                {[
                                  firstItem.ram,
                                  firstItem.storage,
                                  firstItem.color,
                                ]
                                  .filter(Boolean)
                                  .join(" - ")}
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
                        <span className="text-xs text-muted">
                          Tổng thanh toán:
                        </span>
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
                      {(order.status === "DELIVERED" ||
                        order.status === "COMPLETED") && (
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
    <div className="flex-grow min-h-[600px] flex flex-col">
      <div className="flex-grow bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg border border-primary-fixed/20 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl"></div>

        {/* Empty State Illustration Container */}
        <div className="relative w-full max-w-[400px] mx-auto mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="bg-surface-container-lowest rounded-full w-48 h-48 mx-auto flex items-center justify-center shadow-inner border border-outline-variant/20 mb-8 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFXLF_tO_ba73noL7_q1FlwlOpPbd6QI69IcA6naz77C5VDazaiSS1SgE2KTxz8RX-u0LnlW0FC8vBL7ZoUPoifZL5Xj8r4AzvRqwlMHhGCtIbOaCeOjtTqpFmYxNN_qyZBEa89v2AKlSuX3NVlnzCVzNHJxMqpkilFz3KdvccGT3zBs-nnz17Bc-wbfjUcsvo_IlUrqzevWio8bkCLMpB2ErZ5XZeGC6p-UNdkPFsPdKPVod4Zlxn"
              alt="Empty Box"
              className="w-40 h-40 object-contain transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Empty State Content */}
        <div className="z-10 w-full animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
          <h1 className="font-headline-md text-on-surface mb-2 font-bold text-[24px]">
            Bạn chưa có đơn hàng nào gần đây.
          </h1>
          <p className="font-body-md text-on-surface-variant mb-10 opacity-80 max-w-[450px] mx-auto text-[16px] leading-relaxed">
            Có vẻ như bạn chưa thực hiện giao dịch nào. Hãy khám phá các dòng
            smartphone mới nhất và ưu đãi hấp dẫn dành riêng cho bạn tại
            PinkPhone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/store"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:bg-secondary hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Mua sắm ngay
            </Link>
            <Link
              to="/promotions"
              className="w-full sm:w-auto px-8 py-3 bg-surface-container-high text-on-surface font-semibold rounded-full hover:bg-surface-variant transition-all flex items-center justify-center gap-2 active:scale-95 border border-transparent hover:border-outline-variant/30"
            >
              <Compass size={20} />
              Xem khuyến mãi
            </Link>
          </div>
        </div>

        {/* Recommendation Teaser (Subtle Bento) */}
        <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-outline-variant/30 animate-in fade-in duration-700 delay-300 fill-mode-both">
          <div className="p-4 bg-white/40 rounded-xl border border-white/60 text-left hover:bg-white/60 hover:shadow-sm transition-all cursor-pointer">
            <ShieldCheck className="text-primary mb-2" size={24} />
            <h3 className="font-label-sm text-[14px] font-bold text-on-surface">
              Bảo hành 24 tháng
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">
              Yên tâm sử dụng dài lâu
            </p>
          </div>
          <div className="p-4 bg-white/40 rounded-xl border border-white/60 text-left hover:bg-white/60 hover:shadow-sm transition-all cursor-pointer">
            <Truck className="text-primary mb-2" size={24} />
            <h3 className="font-label-sm text-[14px] font-bold text-on-surface">
              Giao hỏa tốc 2h
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">
              Nhận máy ngay trong ngày
            </p>
          </div>
          <div className="p-4 bg-white/40 rounded-xl border border-white/60 text-left hover:bg-white/60 hover:shadow-sm transition-all cursor-pointer">
            <RefreshCcw className="text-primary mb-2" size={24} />
            <h3 className="font-label-sm text-[14px] font-bold text-on-surface">
              Thu cũ đổi mới
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">
              Trợ giá lên đến 2 triệu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
