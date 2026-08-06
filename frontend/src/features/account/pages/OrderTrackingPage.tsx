import { Check, Headphones, MapPin, MessageCircle, Loader2, PackageOpen, ChevronDown, AlertCircle } from "lucide-react";
import { AccountShell } from "../components/AccountShell";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi, getMyOrderApi } from "../../../api/orderService";

export function OrderTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderCodeFromUrl = searchParams.get("orderCode") || "";

  // 1. Fetch user orders list so user can choose any order or default to the latest order
  const { data: pagedOrders, isLoading: loadingOrders, isError: errorOrders, error: errDetailOrders, refetch: refetchOrders } = useQuery({
    queryKey: ["myOrders", 1],
    queryFn: () => getMyOrdersApi(1, 50),
  });

  const ordersList = pagedOrders?.items || pagedOrders?.content || [];
  
  // Selected order code: URL order code or fallback to latest order code
  const activeOrderCode = orderCodeFromUrl || (ordersList.length > 0 ? ordersList[0].orderCode : "");

  // 2. Fetch active order details
  const { data: order, isLoading: loadingOrder, isError: errorSingleOrder, error: errDetailSingle, refetch: refetchSingle } = useQuery({
    queryKey: ["myOrder", activeOrderCode],
    queryFn: () => getMyOrderApi(activeOrderCode),
    enabled: !!activeOrderCode,
  });

  const isLoading = loadingOrders || (!!activeOrderCode && loadingOrder);
  const isError = errorOrders || (!!activeOrderCode && errorSingleOrder);
  const currentError = errorOrders ? errDetailOrders : errDetailSingle;
  const httpStatus = (currentError as any)?.response?.status;

  if (isLoading) {
    return (
      <AccountShell
        title="Theo dõi đơn hàng | PinkPhone"
        description="Quản lý quá trình giao nhận sản phẩm"
      >
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      </AccountShell>
    );
  }

  if (isError) {
    return (
      <AccountShell
        title="Theo dõi đơn hàng | PinkPhone"
        description="Quản lý quá trình giao nhận sản phẩm"
      >
        <div className="p-8 text-center border border-red-200 bg-red-50/50 rounded-2xl my-8">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle size={36} />
          </div>
          <h3 className="text-lg font-bold text-red-700 mb-2">
            Không thể lấy thông tin theo dõi đơn hàng
          </h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-5 leading-relaxed">
            {httpStatus === 401
              ? "Phiên đăng nhập đã hết hạn (Mã lỗi: 401 Unauthorized). Vui lòng đăng nhập lại."
              : httpStatus === 403
              ? "Bạn không có quyền truy cập đơn hàng này (Mã lỗi: 403 Forbidden)."
              : httpStatus
              ? `Máy chủ phản hồi mã lỗi HTTP: ${httpStatus}. Vui lòng thử lại.`
              : "Không thể kết nối đến máy chủ backend (ERR_CONNECTION_REFUSED)."}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { refetchOrders(); if (activeOrderCode) refetchSingle(); }}
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
        </div>
      </AccountShell>
    );
  }

  if (ordersList.length === 0 && !order) {
    return (
      <AccountShell
        title="Theo dõi đơn hàng | PinkPhone"
        description="Quản lý quá trình giao nhận sản phẩm"
      >
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <PackageOpen size={48} className="text-muted mb-4" />
          <h2 className="text-xl font-bold mb-2">Bạn chưa có đơn hàng nào để theo dõi</h2>
          <p className="text-muted mb-4 text-sm">Hãy khám phá các sản phẩm tuyệt vời tại PinkPhone.</p>
          <Link to="/" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-strong transition">
            Mua sắm ngay
          </Link>
        </div>
      </AccountShell>
    );
  }

  if (!order) {
    return (
      <AccountShell
        title="Theo dõi đơn hàng | PinkPhone"
        description="Quản lý quá trình giao nhận sản phẩm"
      >
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center text-red-500">
          <p>Không tìm thấy thông tin đơn hàng này.</p>
          <Link to="/account/orders" className="text-primary hover:underline font-medium mt-2">
            Quay lại Lịch sử mua hàng
          </Link>
        </div>
      </AccountShell>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING": return "Chờ xác nhận";
      case "CONFIRMED": return "Đã xác nhận";
      case "PROCESSING": return "Đang xử lý";
      case "SHIPPED":
      case "SHIPPING": return "Đang giao";
      case "DELIVERED":
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  const isCompleted = (step: string) => {
    if (order.status === "CANCELLED") return false;
    const normalizedStatus = order.status === "CONFIRMED" ? "PROCESSING" 
      : (order.status === "SHIPPING" ? "SHIPPED" 
      : (order.status === "COMPLETED" ? "DELIVERED" : order.status));
      
    const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIndex = statuses.indexOf(normalizedStatus);
    const stepIndex = statuses.indexOf(step);
    return currentIndex >= stepIndex;
  };

  const receiverName = order.receiverName || order.contactName || order.customerName || "Khách hàng";
  const receiverPhone = order.receiverPhone || order.contactPhone || order.customerPhone || "Chưa cập nhật";
  const fullAddress = [
    order.shippingDetailAddress,
    order.shippingWardName,
    order.shippingDistrictName,
    order.shippingProvinceName,
  ].filter(Boolean).join(", ");

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  const totalAmount = order.grandTotalAmount ?? order.total ?? 0;

  return (
    <AccountShell
      title={`Theo dõi đơn hàng #${order.orderCode} | PinkPhone`}
      description="Quản lý quá trình giao nhận sản phẩm"
    >
      <div className="flex-grow space-y-6">
        {/* Order Selector Dropdown if multiple orders exist */}
        {ordersList.length > 1 && (
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="orderSelect" className="font-bold text-sm text-on-surface">
              Chọn đơn hàng cần theo dõi:
            </label>
            <div className="relative flex-1 max-w-xs">
              <select
                id="orderSelect"
                value={order.orderCode}
                onChange={(e) => setSearchParams({ orderCode: e.target.value })}
                className="w-full pl-4 pr-10 py-2 bg-surface-container-low border border-outline rounded-lg font-semibold text-sm appearance-none cursor-pointer outline-none focus:border-primary"
              >
                {ordersList.map((o) => (
                  <option key={o.orderCode} value={o.orderCode}>
                    #{o.orderCode} - {getStatusText(o.status)} ({formatCurrency(o.grandTotalAmount ?? o.total ?? 0)})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-md text-2xl font-semibold text-on-surface mb-1">
              Đơn hàng #{order.orderCode}
            </h1>
            <p className="text-on-surface-variant font-body-md text-base">
              {order.status === "DELIVERED"
                ? "Đã giao thành công"
                : order.status === "CANCELLED"
                ? "Đơn hàng đã bị hủy"
                : "Đang trong quá trình xử lý và giao hàng"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-label-sm text-sm font-semibold text-on-surface-variant block">
                Tổng thanh toán
              </span>
              <span className="font-bold text-primary text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Shipping Timeline */}
          <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-md text-2xl font-semibold text-on-surface">
                Hành trình đơn hàng
              </h2>
              <span className={`px-3 py-1 text-white rounded-full font-bold text-sm ${order.status === "CANCELLED" ? "bg-red-500" : "bg-primary"}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            {order.status === "CANCELLED" ? (
               <div className="text-center py-10">
                 <p className="text-red-500 font-medium">Đơn hàng này đã bị hủy. Hành trình giao hàng kết thúc.</p>
               </div>
            ) : (
              <div className="space-y-0 relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-6 bottom-8 w-[2px] bg-outline-variant"></div>

                {/* Step 4: DELIVERED */}
                <div className={`relative pb-8 flex gap-4 ${isCompleted("DELIVERED") ? "" : "opacity-50"}`}>
                  <div className="relative z-10 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted("DELIVERED") ? "bg-primary ring-4 ring-primary-fixed text-white" : "bg-outline-variant text-white"}`}>
                      {isCompleted("DELIVERED") ? <div className="w-2 h-2 rounded-full bg-white"></div> : <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-grow pt-[2px]">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-lg ${isCompleted("DELIVERED") ? "text-on-surface" : "text-on-surface-variant"}`}>
                        Giao hàng thành công
                      </h4>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-base mt-1">
                      Đơn hàng đã được giao đến bạn.
                    </p>
                  </div>
                </div>

                {/* Step 3: SHIPPED */}
                <div className={`relative pb-8 flex gap-4 ${isCompleted("SHIPPED") ? "" : "opacity-50"}`}>
                  <div className="relative z-10 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isCompleted("SHIPPED") ? (order.status === "SHIPPED" ? "bg-primary ring-4 ring-primary-fixed" : "bg-primary") : "bg-outline-variant"}`}>
                      {order.status === "SHIPPED" ? <div className="w-2 h-2 rounded-full bg-white"></div> : <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-grow pt-[2px]">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-lg ${isCompleted("SHIPPED") ? "text-on-surface" : "text-on-surface-variant"}`}>
                        Đang giao hàng
                      </h4>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-base mt-1">
                      Đơn hàng đang trên đường giao.
                    </p>
                  </div>
                </div>

                {/* Step 2: PROCESSING */}
                <div className={`relative pb-8 flex gap-4 ${isCompleted("PROCESSING") ? "" : "opacity-50"}`}>
                  <div className="relative z-10 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isCompleted("PROCESSING") ? (order.status === "PROCESSING" ? "bg-primary ring-4 ring-primary-fixed" : "bg-primary") : "bg-outline-variant"}`}>
                      {order.status === "PROCESSING" ? <div className="w-2 h-2 rounded-full bg-white"></div> : <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-grow pt-[2px]">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-lg ${isCompleted("PROCESSING") ? "text-on-surface" : "text-on-surface-variant"}`}>
                        Đang xử lý
                      </h4>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-base mt-1">
                      PinkPhone đang chuẩn bị đơn hàng của bạn.
                    </p>
                  </div>
                </div>

                {/* Step 1: PENDING */}
                <div className={`relative pb-0 flex gap-4 ${isCompleted("PENDING") ? "" : "opacity-50"}`}>
                  <div className="relative z-10 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isCompleted("PENDING") ? (order.status === "PENDING" ? "bg-primary ring-4 ring-primary-fixed" : "bg-primary") : "bg-outline-variant"}`}>
                      {order.status === "PENDING" ? <div className="w-2 h-2 rounded-full bg-white"></div> : <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="flex-grow pt-[2px]">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold text-lg ${isCompleted("PENDING") ? "text-on-surface" : "text-on-surface-variant"}`}>
                        Chờ xác nhận
                      </h4>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-base mt-1">
                      Đơn hàng đã được ghi nhận thành công.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column Bento Cards */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Receiver Info */}
            <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-outline-variant/30 pb-3">
                <MapPin size={24} className="text-primary" />
                <h3 className="font-bold text-on-surface">
                  Thông tin nhận hàng
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold">
                    Họ và tên
                  </p>
                  <p className="font-bold text-on-surface">{receiverName}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs font-semibold">
                    Số điện thoại
                  </p>
                  <p className="font-bold text-on-surface">{receiverPhone}</p>
                </div>
                {fullAddress && (
                  <div>
                    <p className="text-on-surface-variant text-xs font-semibold">
                      Địa chỉ nhận hàng
                    </p>
                    <p className="text-sm text-on-surface leading-relaxed">{fullAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Summary */}
            {order.items && order.items.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-6">
                <h3 className="font-bold text-on-surface mb-3 border-b border-outline-variant/30 pb-2">
                  Sản phẩm đã đặt ({order.items.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center text-xs">
                      <div className="w-12 h-12 rounded bg-surface-container shrink-0 overflow-hidden flex items-center justify-center p-1 border border-outline-variant/20">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                        ) : (
                          <PackageOpen size={20} className="text-muted" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate text-on-surface">{item.productName}</p>
                        <p className="text-muted">x{item.quantity} - {formatCurrency(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Action */}
            <div className="bg-primary-container rounded-xl p-6 text-on-primary-container shadow-lg">
              <h3 className="font-bold mb-2">Cần giúp đỡ với đơn hàng?</h3>
              <p className="text-sm mb-4 opacity-90 leading-tight">
                Đội ngũ hỗ trợ của PinkPhone luôn sẵn sàng giải đáp thắc mắc của
                bạn 24/7.
              </p>
              <div className="space-y-2">
                <Link to="/account/support" className="w-full bg-white text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all active:scale-95 text-sm">
                  <Headphones size={20} /> Liên hệ hỗ trợ ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB for quick contact (Mobile) */}
      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all group">
          <MessageCircle size={28} />
        </button>
      </div>
    </AccountShell>
  );
}
