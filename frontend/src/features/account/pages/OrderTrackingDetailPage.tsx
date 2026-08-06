import { useParams, Link } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { useQuery } from "@tanstack/react-query";
import { getMyOrderApi } from "../../../api/orderService";
import {
  Check,
  MapPin,
  Headphones,
  MessageCircle,
  AlertCircle,
  PackageOpen,
} from "lucide-react";

export function OrderTrackingDetailPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getMyOrderApi(id!),
    enabled: !!id,
    retry: 1,
  });

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
        title={`Chi tiết theo dõi đơn hàng #${id}`}
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PROCESSING":
        return "Đang đóng gói";
      case "SHIPPED":
      case "SHIPPING":
        return "Đang vận chuyển";
      case "DELIVERED":
      case "COMPLETED":
        return "Giao hàng thành công";
      case "CANCELLED":
        return "Đã hủy";
      case "RETURNED":
      case "PARTIALLY_RETURNED":
        return "Đã trả hàng";
      default:
        return status;
    }
  };

  const timeOnly = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const dateOnly = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
    : "";

  const dateTime = `${timeOnly}, ${dateOnly}`;

  return (
    <AccountShell
      title={`Chi tiết đơn hàng #${order.orderCode}`}
      description="Chi tiết theo dõi hành trình đơn hàng của bạn."
    >
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(214, 51, 108, 0.1);
          box-shadow: 0 4px 20px rgba(214, 51, 108, 0.08);
        }
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: #e0bec4;
        }
        .timeline-item:last-child .timeline-line::before {
          display: none;
        }
      `}</style>

      <div className="flex-grow space-y-6">
        {/* Header Card */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-2">
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Đơn hàng #{order.orderCode}
          </h1>
          <p className="text-on-surface-variant font-body-md">
            Đơn hàng này bao gồm{" "}
            <span className="font-bold text-primary">1 kiện hàng</span> chứa{" "}
            {order.items?.length || 0} sản phẩm.
          </p>
        </div>

        <div className="bento-grid">
          {/* Shipping Timeline List */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Shipment */}
            <div className="glass-card rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-outline-variant pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                      Kiện hàng 1{" "}
                      <span className="text-body-md text-on-surface-variant font-normal">
                        (#SHP-{order.orderCode}-1)
                      </span>
                    </h2>
                    <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed rounded-full font-label-sm whitespace-nowrap">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Đơn vị vận chuyển
                    </span>
                    <span className="font-bold text-secondary">
                      PinkPhone Express
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Mã vận đơn
                    </span>
                    <span className="font-bold text-primary">
                      #{order.orderCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-on-surface mb-3">
                  Sản phẩm trong kiện này
                </h3>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30"
                    >
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center border border-outline-variant/30 flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            className="w-10 h-10 object-contain mix-blend-multiply"
                            alt={item.productName}
                            src={item.imageUrl}
                          />
                        ) : (
                          <PackageOpen className="text-muted" size={20} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-on-surface text-sm">
                          {item.productName}
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                          {[item.color, item.storage, item.ram]
                            .filter(Boolean)
                            .join(" / ") || "Bản tiêu chuẩn"}
                        </p>
                      </div>
                      <div className="font-bold text-on-surface">
                        SL: {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-4">
                  Hành trình đơn hàng
                </h3>

                {order.status === "CANCELLED" ? (
                  <div className="space-y-0">
                    <div className="timeline-item relative pb-8 flex gap-4">
                      <div className="timeline-line relative z-10">
                        <div className="w-6 h-6 rounded-full bg-error border-4 border-error-container flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <div className="flex-grow pt-0.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-on-surface text-body-lg">
                            Đã hủy (CANCELLED)
                          </h4>
                          <span className="text-error font-bold">
                            {dateTime}
                          </span>
                        </div>
                        <p className="text-on-surface-variant font-body-md mt-1">
                          Đơn hàng đã được yêu cầu hủy.
                        </p>
                      </div>
                    </div>
                    <div className="timeline-item relative pb-0 flex gap-4 opacity-70">
                      <div className="timeline-line relative z-10">
                        <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                          <Check
                            size={14}
                            strokeWidth={3}
                            className="text-white"
                          />
                        </div>
                      </div>
                      <div className="flex-grow pt-0.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-on-surface text-body-md">
                            Chờ xác nhận (PENDING)
                          </h4>
                          <span className="text-on-surface-variant text-label-sm">
                            {dateTime}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mt-1">
                          Đơn hàng đã được ghi nhận.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {/* DELIVERED / COMPLETED */}
                    {getStepStatus("DELIVERED", order.status) && (
                      <div className="timeline-item relative pb-8 flex gap-4">
                        <div className="timeline-line relative z-10">
                          <div className="w-6 h-6 rounded-full bg-primary border-4 border-primary-fixed flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-on-surface text-body-lg">
                              Giao hàng thành công (DELIVERED)
                            </h4>
                          </div>
                          <p className="text-on-surface-variant font-body-md mt-1">
                            Kiện hàng đã được giao thành công đến bạn.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* SHIPPING */}
                    {(getStepStatus("SHIPPING", order.status) ||
                      getStepStatus("DELIVERED", order.status)) && (
                      <div
                        className={`timeline-item relative pb-8 flex gap-4 ${!getStepStatus("DELIVERED", order.status) ? "" : "opacity-70"}`}
                      >
                        <div className="timeline-line relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${!getStepStatus("DELIVERED", order.status) ? "bg-primary border-4 border-primary-fixed" : "bg-outline-variant"}`}
                          >
                            {!getStepStatus("DELIVERED", order.status) ? (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            ) : (
                              <Check
                                size={14}
                                strokeWidth={3}
                                className="text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4
                              className={`${!getStepStatus("DELIVERED", order.status) ? "font-bold text-body-lg" : "font-medium text-body-md"} text-on-surface`}
                            >
                              Đang vận chuyển (SHIPPING)
                            </h4>
                          </div>
                          <p
                            className={`text-on-surface-variant ${!getStepStatus("DELIVERED", order.status) ? "font-body-md" : "text-sm"} mt-1`}
                          >
                            Shipper đang trên đường giao đến bạn.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PROCESSING */}
                    {(getStepStatus("PROCESSING", order.status) ||
                      getStepStatus("SHIPPING", order.status)) && (
                      <div
                        className={`timeline-item relative pb-8 flex gap-4 ${!getStepStatus("SHIPPING", order.status) ? "" : "opacity-70"}`}
                      >
                        <div className="timeline-line relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${!getStepStatus("SHIPPING", order.status) ? "bg-primary border-4 border-primary-fixed" : "bg-outline-variant"}`}
                          >
                            {!getStepStatus("SHIPPING", order.status) ? (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            ) : (
                              <Check
                                size={14}
                                strokeWidth={3}
                                className="text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4
                              className={`${!getStepStatus("SHIPPING", order.status) ? "font-bold text-body-lg" : "font-medium text-body-md"} text-on-surface`}
                            >
                              Đang đóng gói (PROCESSING)
                            </h4>
                          </div>
                          <p
                            className={`text-on-surface-variant ${!getStepStatus("SHIPPING", order.status) ? "font-body-md" : "text-sm"} mt-1`}
                          >
                            Kiểm tra kỹ thuật và đóng gói chống sốc.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* CONFIRMED */}
                    {(getStepStatus("CONFIRMED", order.status) ||
                      getStepStatus("PROCESSING", order.status)) && (
                      <div
                        className={`timeline-item relative pb-8 flex gap-4 ${!getStepStatus("PROCESSING", order.status) ? "" : "opacity-70"}`}
                      >
                        <div className="timeline-line relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${!getStepStatus("PROCESSING", order.status) ? "bg-primary border-4 border-primary-fixed" : "bg-outline-variant"}`}
                          >
                            {!getStepStatus("PROCESSING", order.status) ? (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            ) : (
                              <Check
                                size={14}
                                strokeWidth={3}
                                className="text-white"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex-grow pt-0.5">
                          <div className="flex justify-between items-start">
                            <h4
                              className={`${!getStepStatus("PROCESSING", order.status) ? "font-bold text-body-lg" : "font-medium text-body-md"} text-on-surface`}
                            >
                              Đã xác nhận (CONFIRMED)
                            </h4>
                          </div>
                          <p
                            className={`text-on-surface-variant ${!getStepStatus("PROCESSING", order.status) ? "font-body-md" : "text-sm"} mt-1`}
                          >
                            Đơn hàng đã được xác nhận.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PENDING */}
                    <div
                      className={`timeline-item relative ${!getStepStatus("CONFIRMED", order.status) ? "pb-8" : "pb-0"} flex gap-4 ${!getStepStatus("CONFIRMED", order.status) ? "" : "opacity-70"}`}
                    >
                      <div className="timeline-line relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${!getStepStatus("CONFIRMED", order.status) ? "bg-primary border-4 border-primary-fixed" : "bg-outline-variant"}`}
                        >
                          {!getStepStatus("CONFIRMED", order.status) ? (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          ) : (
                            <Check
                              size={14}
                              strokeWidth={3}
                              className="text-white"
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow pt-0.5">
                        <div className="flex justify-between items-start">
                          <h4
                            className={`${!getStepStatus("CONFIRMED", order.status) ? "font-bold text-body-lg" : "font-medium text-body-md"} text-on-surface`}
                          >
                            Chờ xác nhận (PENDING)
                          </h4>
                          <span className="text-on-surface-variant text-label-sm">
                            {dateTime}
                          </span>
                        </div>
                        <p
                          className={`text-on-surface-variant ${!getStepStatus("CONFIRMED", order.status) ? "font-body-md" : "text-sm"} mt-1`}
                        >
                          Đơn hàng đã được ghi nhận.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Bento Cards */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Receiver Info */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={24} className="text-primary" />
                <h3 className="font-bold text-on-surface">
                  Thông tin người nhận
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Họ và tên
                  </p>
                  <p className="font-medium text-on-surface">
                    {order.receiverName ||
                      order.customerName ||
                      order.contactName ||
                      "Người nhận"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Số điện thoại
                  </p>
                  <p className="font-medium text-on-surface">
                    {order.receiverPhone ||
                      order.customerPhone ||
                      order.contactPhone ||
                      "Không có SĐT"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Địa chỉ giao hàng
                  </p>
                  <p className="font-medium text-on-surface mt-1">
                    {order.shippingDetailAddress
                      ? `${order.shippingDetailAddress}, ${order.shippingWardName}, ${order.shippingDistrictName}, ${order.shippingProvinceName}`
                      : "Không có địa chỉ được ghi nhận"}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="glass-card rounded-xl overflow-hidden h-48 relative group">
              <div className="absolute inset-0 bg-surface-container-high flex flex-col items-center justify-center text-center">
                <div
                  className="w-full h-full bg-cover bg-center"
                  title="Ho Chi Minh City"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXNuVpa0MnNd2cVRhdBneHQj02VxblxV825rp_4O8cw9UWyheZQwWz6VlNaOy3HLqLY3Huo2pAxEbuF9Z60FzyqevwOuuScTB5iNx0Ti05MPTk8dIlnesxO7IqsGYaEXd25AYxl4z0VdYhJ-oaN8I5GI3UT7o4YQOlzytDCyiujJbCWGusDs4cP6GI6HD4SpNn_4UH0g0mJAItu8QUCTGqy1LGgf_f5Nhs_WKnxtWsZm1QSwqvKrL9')",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all pointer-events-none">
                  <button className="bg-white/90 backdrop-blur text-primary font-bold px-4 py-2 rounded-full shadow-lg">
                    Xem bản đồ trực tiếp
                  </button>
                </div>
              </div>
            </div>

            {/* Support Action */}
            <div className="bg-primary-container rounded-xl p-6 text-on-primary-container shadow-lg">
              <h3 className="font-bold mb-2">Cần giúp đỡ với đơn hàng?</h3>
              <p className="text-sm mb-4 opacity-90 leading-tight">
                Đội ngũ hỗ trợ của PinkPhone luôn sẵn sàng giải đáp thắc mắc của
                bạn 24/7.
              </p>
              <div className="space-y-2">
                <Link
                  to="/account/support"
                  className="w-full bg-white text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all active:scale-95 shadow-sm"
                >
                  <Headphones size={20} />
                  Liên hệ hỗ trợ ngay
                </Link>
                <button className="w-full bg-primary-fixed-dim/20 border border-white/30 text-white font-medium py-2 rounded-lg hover:bg-primary-fixed-dim/30 transition-all shadow-sm">
                  Gửi khiếu nại đơn hàng
                </button>
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
