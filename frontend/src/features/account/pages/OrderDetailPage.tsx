import { Link, useParams } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { useQuery } from "@tanstack/react-query";
import { getMyOrderApi } from "../../../api/orderService";
import {
  ArrowLeft,
  Clock,
  ThumbsUp,
  FileText,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
  HeadphonesIcon,
  ShoppingBag,
  Star,
  Undo2,
  Wallet,
  AlertCircle,
  PackageOpen,
} from "lucide-react";

export function OrderDetailPage() {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getMyOrderApi(id!),
    enabled: !!id,
    retry: 1,
  });

  const order = response;

  // Handle loading state
  if (isLoading) {
    return (
      <AccountShell
        title={`Chi tiết đơn hàng #${id}`}
        description="Đang tải thông tin đơn hàng..."
      >
        <div className="flex justify-center items-center py-32 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-medium">
              Đang lấy dữ liệu...
            </p>
          </div>
        </div>
      </AccountShell>
    );
  }

  // Handle error state
  if (isError || !order) {
    return (
      <AccountShell
        title={`Chi tiết đơn hàng #${id}`}
        description="Không thể tải thông tin đơn hàng."
      >
        <div className="p-10 text-center bg-error-container text-on-error-container rounded-xl w-full">
          <AlertCircle size={48} className="mx-auto mb-4 text-error" />
          <h2 className="text-xl font-bold mb-2">Đã có lỗi xảy ra</h2>
          <p className="opacity-80">
            {error instanceof Error
              ? error.message
              : "Không tìm thấy đơn hàng, vui lòng thử lại sau."}
          </p>
          <Link
            to="/account/orders"
            className="inline-flex items-center justify-center px-6 py-2 bg-error text-white mt-6 rounded-lg hover:bg-error/90 transition-colors font-bold"
          >
            Quay lại Lịch sử đơn hàng
          </Link>
        </div>
      </AccountShell>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + "₫";

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
        return "Đang giao hàng";
      case "DELIVERED":
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      case "RETURNED":
      case "PARTIALLY_RETURNED":
        return "Đã trả hàng";
      default:
        return status;
    }
  };

  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const statuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPING",
      "DELIVERED",
    ];
    let mappedStatus = currentStatus;
    if (currentStatus === "COMPLETED") mappedStatus = "DELIVERED";
    if (currentStatus === "SHIPPED") mappedStatus = "SHIPPING";

    const stepIdx = statuses.indexOf(stepStatus);
    const currIdx = statuses.indexOf(mappedStatus);

    if (currIdx === -1) {
      if (stepStatus === "PENDING") return true;
      return false;
    }

    return stepIdx <= currIdx;
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const timeOnly = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const subTotal =
    order.items?.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * item.quantity,
      0,
    ) || 0;
  const discount =
    (order.total || subTotal) -
    (order.grandTotalAmount ?? order.total ?? subTotal);

  return (
    <AccountShell
      title={`Chi tiết đơn hàng #${order.orderCode}`}
      description="Theo dõi trạng thái và chi tiết sản phẩm của đơn hàng."
    >
      <style>{`
        .timeline-step::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e0bec4;
          z-index: -1;
        }
        .timeline-step:last-child::after {
          display: none;
        }
        .active-step::after {
          background: #b41254; /* bg-primary */
        }
      `}</style>

      <div className="flex-grow space-y-6">
        {/* Order Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/account/orders"
                className="hover:text-primary transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
                Chi tiết đơn hàng #{order.orderCode}
              </h1>
            </div>
            <p className="text-on-surface-variant font-body-md pl-8">
              Ngày đặt: {formattedDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pl-8 md:pl-0 justify-end">
            <button className="px-4 py-2 bg-primary text-white font-label-sm text-label-sm rounded-lg hover:bg-secondary-container hover:text-white transition-colors flex items-center gap-2 shadow-sm active:scale-95">
              <ShoppingBag size={18} /> Mua lại
            </button>
            <button className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm text-label-sm rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2 active:scale-95">
              <Star size={18} /> Đánh giá
            </button>
            <button className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm text-label-sm rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-2 active:scale-95">
              <Undo2 size={18} /> Yêu cầu trả hàng
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-xl shadow-sm border border-outline-variant/30 hidden md:block">
          {order.status === "CANCELLED" ? (
            <div className="flex flex-col items-center justify-center py-4">
              <AlertCircle size={48} className="text-error mb-4" />
              <h3 className="text-xl font-bold text-error">Đơn hàng đã hủy</h3>
            </div>
          ) : (
            <div className="relative flex justify-between">
              {/* Pending */}
              <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center timeline-step ${getStepStatus("PENDING", order.status) ? "bg-primary text-white active-step" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <Clock size={20} />
                </div>
                <span
                  className={`font-label-sm text-label-sm text-center ${getStepStatus("PENDING", order.status) ? "text-on-surface font-bold" : "text-on-surface-variant"}`}
                >
                  Chờ xác nhận
                </span>
                {getStepStatus("PENDING", order.status) && (
                  <span className="text-[11px] text-on-surface-variant">
                    Cập nhật lúc: {timeOnly}
                  </span>
                )}
              </div>
              {/* Confirmed */}
              <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center timeline-step ${getStepStatus("CONFIRMED", order.status) ? "bg-primary text-white active-step" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <ThumbsUp size={20} />
                </div>
                <span
                  className={`font-label-sm text-label-sm text-center ${getStepStatus("CONFIRMED", order.status) ? "text-on-surface font-bold" : "text-on-surface-variant"}`}
                >
                  Đã xác nhận
                </span>
              </div>
              {/* Processing */}
              <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center timeline-step ${getStepStatus("PROCESSING", order.status) ? "bg-primary text-white active-step" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <FileText size={20} />
                </div>
                <span
                  className={`font-label-sm text-label-sm text-center ${getStepStatus("PROCESSING", order.status) ? "text-on-surface font-bold" : "text-on-surface-variant"}`}
                >
                  Đang xử lý
                </span>
              </div>
              {/* Shipping */}
              <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center timeline-step ${getStepStatus("SHIPPING", order.status) ? "bg-primary text-white active-step" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <Truck size={20} />
                </div>
                <span
                  className={`font-label-sm text-label-sm text-center ${getStepStatus("SHIPPING", order.status) ? "text-on-surface font-bold" : "text-on-surface-variant"}`}
                >
                  Đang giao hàng
                </span>
              </div>
              {/* Completed */}
              <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center timeline-step ${getStepStatus("DELIVERED", order.status) ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <CheckCircle2 size={24} />
                </div>
                <span
                  className={`font-label-sm text-label-sm text-center ${getStepStatus("DELIVERED", order.status) ? "text-primary font-bold" : "text-on-surface-variant"}`}
                >
                  Hoàn thành
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Mobile Status Timeline fallback */}
        <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 block md:hidden">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${order.status === "CANCELLED" ? "bg-error-container text-error" : "bg-primary-container text-primary"}`}
            >
              {order.status === "CANCELLED" ? (
                <AlertCircle size={28} />
              ) : (
                <CheckCircle2 size={28} />
              )}
            </div>
            <div>
              <h3
                className={`font-bold ${order.status === "CANCELLED" ? "text-error" : "text-primary"}`}
              >
                {getStatusText(order.status)}
              </h3>
              <p className="text-on-surface-variant font-medium text-sm">
                Cập nhật lúc: {timeOnly}
              </p>
            </div>
          </div>
        </section>

        {/* Receiver & Payment Summary Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receiver Info */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <MapPin className="text-primary" size={20} />
              <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thông tin nhận hàng
              </h2>
            </div>
            <div className="space-y-4 flex-grow">
              <div>
                <p className="text-[12px] text-on-surface-variant uppercase font-bold mb-1">
                  Thông tin liên hệ
                </p>
                <p className="font-bold text-on-surface">
                  {order.receiverName ||
                    order.customerName ||
                    order.contactName ||
                    "Người nhận"}
                </p>
                <p className="text-on-surface-variant font-medium">
                  {order.receiverPhone ||
                    order.customerPhone ||
                    order.contactPhone ||
                    "Không có SĐT"}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-on-surface-variant uppercase font-bold mb-1">
                  Địa chỉ giao hàng
                </p>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  {order.shippingDetailAddress
                    ? `${order.shippingDetailAddress}, ${order.shippingWardName}, ${order.shippingDistrictName}, ${order.shippingProvinceName}`
                    : "Không có địa chỉ được ghi nhận"}
                </p>
              </div>
            </div>
          </div>
          {/* Payment Summary */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Wallet className="text-primary" size={20} />
              <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Chi tiết thanh toán
              </h2>
            </div>
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Tạm tính ({order.items?.length || 0} sản phẩm)</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary font-bold">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant font-medium">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-bold">
                    {order.shippingFee
                      ? formatCurrency(order.shippingFee)
                      : "Miễn phí"}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-outline-variant flex justify-between items-center mt-auto">
                <span className="font-bold text-on-surface">Tổng cộng</span>
                <span className="font-headline-md text-headline-md font-bold text-primary">
                  {formatCurrency(
                    order.grandTotalAmount ?? order.total ?? subTotal,
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-surface-container-low rounded-lg text-[12px] font-medium shrink-0">
                <CreditCard className="text-primary" size={16} />
                <span className="text-on-surface-variant">
                  Thanh toán khi nhận hàng / COD
                </span>
                <span
                  className={`ml-auto font-bold ${
                    order.status === "COMPLETED" || order.status === "DELIVERED"
                      ? "text-green-600"
                      : "text-primary"
                  }`}
                >
                  {order.status === "COMPLETED" || order.status === "DELIVERED"
                    ? "Đã thanh toán"
                    : "Chờ thanh toán"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h2 className="font-headline-md text-[20px] text-on-surface font-bold">
              Danh sách sản phẩm
            </h2>
            <Link
              to="/account/support"
              className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1 bg-surface-container hover:bg-surface-container-highest px-3 py-1.5 rounded-lg transition-colors"
            >
              <HeadphonesIcon size={18} /> Hỗ trợ
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-left font-label-sm text-label-sm text-on-surface-variant">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-4 text-left font-label-sm text-label-sm text-on-surface-variant">
                    Phiên bản
                  </th>
                  <th className="px-4 py-4 text-right font-label-sm text-label-sm text-on-surface-variant">
                    Đơn giá
                  </th>
                  <th className="px-4 py-4 text-center font-label-sm text-label-sm text-on-surface-variant">
                    SL
                  </th>
                  <th className="px-6 py-4 text-right font-label-sm text-label-sm text-on-surface-variant">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {order.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center p-2 border border-outline-variant/30 flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              className="w-full h-full object-contain mix-blend-multiply"
                              alt={item.productName}
                              src={item.imageUrl}
                            />
                          ) : (
                            <PackageOpen className="text-muted" size={32} />
                          )}
                        </div>
                        <div>
                          <h4
                            className="font-bold text-on-surface max-w-[200px]"
                            title={item.productName}
                          >
                            {item.productName}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-on-surface-variant text-sm font-medium">
                      {item.ram || item.storage || item.color ? (
                        <>
                          {[item.ram, item.storage].filter(Boolean).join(" / ")}
                          <br />
                          Màu: {item.color || "Tiêu chuẩn"}
                        </>
                      ) : (
                        "Bản tiêu chuẩn"
                      )}
                    </td>
                    <td className="px-4 py-6 text-right text-on-surface font-medium whitespace-nowrap">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="px-4 py-6 text-center text-on-surface font-bold text-lg">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-6 text-right font-bold text-primary whitespace-nowrap">
                      {formatCurrency((item.unitPrice || 0) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AccountShell>
  );
}
