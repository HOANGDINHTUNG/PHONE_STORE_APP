import { Link, useNavigate } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "../../../api/orderService";
import { useState } from "react";

export function OrderTrackingPage() {
  const navigate = useNavigate();

  // 1. Fetch user orders list
  const {
    data: pagedOrders,
    isLoading: loadingOrders,
    isError: errorOrders,
    error: errDetailOrders,
    refetch,
  } = useQuery({
    queryKey: ["myOrders", 1],
    queryFn: () => getMyOrdersApi(1, 100),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const ordersListRaw = pagedOrders?.items || pagedOrders?.content || [];

  // Filter by search term
  const ordersList = ordersListRaw.filter(
    (o: any) =>
      o.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.receiverPhone && o.receiverPhone.includes(searchTerm)),
  );

  const isLoading = loadingOrders || isSearching;
  const isError = errorOrders;
  const httpStatus = (errDetailOrders as any)?.response?.status;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xác nhận",
          color:
            "bg-surface-variant text-on-surface-variant border-outline-variant",
          icon: "hourglass_empty",
        };
      case "CONFIRMED":
      case "PROCESSING":
        return {
          text: "Đang đóng gói",
          color:
            "bg-surface-variant text-on-surface-variant border-outline-variant",
          icon: "inventory",
        };
      case "SHIPPED":
      case "SHIPPING":
        return {
          text: "Đang vận chuyển",
          color:
            "bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim",
          icon: "local_shipping",
        };
      case "DELIVERED":
      case "COMPLETED":
        return {
          text: "Giao thành công",
          color: "bg-primary-fixed text-primary border-primary-fixed-dim",
          icon: "check_circle",
        };
      case "CANCELLED":
        return {
          text: "Đã hủy",
          color:
            "bg-error-container text-on-error-container border-error-container",
          icon: "cancel",
        };
      default:
        return {
          text: status,
          color:
            "bg-surface-variant text-on-surface-variant border-outline-variant",
          icon: "package",
        };
    }
  };

  const getHeaderIconStyles = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "PROCESSING":
        return {
          icon: "inventory_2",
          classes: "text-tertiary-container bg-tertiary-fixed",
        };
      case "SHIPPED":
      case "SHIPPING":
        return {
          icon: "local_shipping",
          classes:
            "text-secondary-fixed text-on-secondary-fixed-variant bg-secondary-fixed",
        };
      case "DELIVERED":
      case "COMPLETED":
        return {
          icon: "check_circle",
          classes: "text-primary bg-primary-fixed",
        };
      default:
        return {
          icon: "box",
          classes: "text-primary-container bg-primary-fixed",
        };
    }
  };

  const getProgress = (status: string) => {
    if (status === "DELIVERED" || status === "COMPLETED")
      return { width: "100%", activeDots: 3 };
    if (status === "SHIPPED" || status === "SHIPPING")
      return { width: "66%", activeDots: 2 };
    if (status === "CANCELLED") return { width: "0%", activeDots: 0 };
    return { width: "0%", activeDots: 1 };
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " ₫";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <AccountShell
      title="Theo dõi đơn hàng | PinkPhone"
      description="Tra cứu tình trạng vận chuyển của các đơn hàng hiện tại."
    >
      <div className="flex-1 flex flex-col space-y-lg">
        {/* Page Header */}
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface">
            Theo dõi đơn hàng
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-2">
            Tra cứu tình trạng vận chuyển của các đơn hàng hiện tại.
          </p>
        </div>

        {/* Search Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(214,51,108,0.08)] p-lg border border-surface-container-high">
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={handleSearch}
          >
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
                tag
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:ring-opacity-50 text-body-md font-body-md transition-shadow placeholder-on-surface-variant"
                placeholder="Nhập Mã đơn hàng hoặc Số điện thoại"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="bg-primary-container text-on-primary hover:bg-secondary transition-colors px-6 py-3 rounded-lg font-label-sm text-label-sm font-semibold whitespace-nowrap active:scale-98 shadow-sm"
              type="submit"
            >
              Tra cứu
            </button>
          </form>
        </section>

        {isError && (
          <div className="w-full p-8 text-center border border-red-200 bg-red-50/50 rounded-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <span className="material-symbols-outlined text-4xl">error</span>
            </div>
            <h3 className="text-lg font-bold text-red-700 mb-2">
              Không thể lấy thông tin theo dõi đơn hàng
            </h3>
            <p className="text-sm text-red-600 max-w-[448px] mx-auto mb-5 leading-relaxed">
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
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition"
              >
                Thử lại
              </button>
              {httpStatus === 401 && (
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-[#AD1457] transition"
                >
                  Đăng nhập lại
                </Link>
              )}
            </div>
          </div>
        )}

        {isLoading && !isError && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <span
                className="material-symbols-outlined text-4xl text-primary-container animate-spin"
                style={{ animationDuration: "2s" }}
              >
                sync
              </span>
              <p className="text-body-md text-on-surface-variant mt-4">
                Đang tìm kiếm...
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && ordersList.length === 0 && (
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(214,51,108,0.08)] p-xl border border-surface-container-high flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-outline">
              <span className="material-symbols-outlined text-5xl">
                search_off
              </span>
            </div>
            <h3 className="text-headline-md font-headline-md text-on-surface font-bold mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-[448px]">
              {searchTerm
                ? "Chúng tôi không tìm thấy đơn hàng nào khớp với thông tin bạn cung cấp. Vui lòng kiểm tra lại mã đơn hàng hoặc số điện thoại."
                : "Bạn chưa có đơn hàng nào hiện đang vận chuyển. Hãy bắt đầu mua sắm ngay hôm nay!"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-2 rounded-lg border border-outline text-on-surface font-label-sm text-label-sm hover:bg-surface-container-low hover:text-primary transition-colors font-semibold"
              >
                Xóa tìm kiếm
              </button>
            ) : (
              <Link
                to="/"
                className="mt-6 px-6 py-2.5 rounded-lg border border-outline text-on-surface font-label-sm text-label-sm hover:bg-surface-container-low hover:text-primary transition-colors font-semibold"
              >
                Quay lại cửa hàng
              </Link>
            )}
          </section>
        )}

        {!isLoading && !isError && ordersList.length > 0 && (
          <section className="space-y-4">
            {ordersList.map((order: any, idx: number) => {
              const badge = getStatusBadge(order.status);
              const headerIconStyle = getHeaderIconStyles(order.status);
              const progress = getProgress(order.status);
              const itemsCount = order.items?.length || 0;
              const hasMultipleItems = itemsCount > 1;
              const mainItem = order.items?.[0];
              const secondItem = order.items?.[1];

              return (
                <div
                  key={order.id || idx}
                  className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(214,51,108,0.08)] border border-surface-container-high overflow-hidden hover:shadow-[0_8px_32px_rgba(214,51,108,0.12)] transition-shadow duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-surface-container-low px-lg py-md border-b border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`material-symbols-outlined p-2 rounded-full ${headerIconStyle.classes}`}
                      >
                        {headerIconStyle.icon}
                      </span>
                      <div>
                        <h3 className="text-label-sm font-label-sm font-bold text-on-surface">
                          Đơn hàng #{order.orderCode}
                        </h3>
                        <p className="text-body-md font-body-md text-on-surface-variant text-sm">
                          Đặt ngày{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold border ${badge.color}`}
                    >
                      <span className="material-symbols-outlined text-sm mr-1">
                        {badge.icon}
                      </span>
                      {badge.text}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-lg">
                    <div className="flex flex-col md:flex-row gap-lg items-start md:items-center">
                      {!hasMultipleItems ? (
                        /* Single Product Image */
                        <div className="w-24 h-24 shrink-0 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden border border-surface-container-high relative">
                          {mainItem?.imageUrl ? (
                            <img
                              className="object-cover w-full h-full mix-blend-multiply"
                              alt={mainItem.productName}
                              src={mainItem.imageUrl}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-4xl text-outline-variant">
                              image
                            </span>
                          )}
                          <span className="absolute bottom-1 right-1 z-10 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded shadow-sm border border-outline-variant">
                            x{mainItem?.quantity || 1}
                          </span>
                        </div>
                      ) : (
                        /* Stack of images for multiple items */
                        <div className="flex -space-x-4 relative">
                          {mainItem && (
                            <div className="w-16 h-16 shrink-0 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden border-2 border-surface-container-lowest relative z-20">
                              {mainItem.imageUrl ? (
                                <img
                                  className="object-cover w-full h-full mix-blend-multiply"
                                  alt={mainItem.productName}
                                  src={mainItem.imageUrl}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-outline-variant">
                                  image
                                </span>
                              )}
                            </div>
                          )}
                          {secondItem && (
                            <div className="w-16 h-16 shrink-0 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden border-2 border-surface-container-lowest relative z-10">
                              {secondItem.imageUrl ? (
                                <img
                                  className="object-cover w-full h-full mix-blend-multiply"
                                  alt={secondItem.productName}
                                  src={secondItem.imageUrl}
                                />
                              ) : (
                                <span className="material-symbols-outlined text-outline-variant">
                                  image
                                </span>
                              )}
                            </div>
                          )}
                          {itemsCount > 2 && (
                            <div className="w-16 h-16 shrink-0 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-surface-container-lowest relative z-0 text-on-surface-variant font-bold text-sm">
                              +{itemsCount - 2}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 w-full mt-4 md:mt-0">
                        <h4 className="text-body-lg font-body-lg text-on-surface font-semibold mb-1 truncate max-w-[512px]">
                          {mainItem
                            ? hasMultipleItems
                              ? `${mainItem.productName}, ...`
                              : mainItem.productName
                            : "Không xác định"}
                        </h4>
                        <p className="text-body-md font-body-md text-on-surface-variant">
                          {hasMultipleItems ? `${itemsCount} sản phẩm • ` : ""}
                          Tổng tiền:{" "}
                          <span className="text-primary font-bold">
                            {formatCurrency(
                              order.grandTotalAmount ?? order.total ?? 0,
                            )}
                          </span>
                        </p>

                        {!hasMultipleItems ? (
                          <>
                            {/* Minimal Tracking Progress */}
                            <div className="mt-4 flex items-center w-full max-w-[448px] relative">
                              <div className="h-1 bg-surface-container-high absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 rounded-full"></div>
                              <div
                                className="h-1 bg-primary-container absolute top-1/2 left-0 -translate-y-1/2 z-0 rounded-full transition-all duration-700"
                                style={{ width: progress.width }}
                              ></div>
                              <div className="flex justify-between w-full z-10 relative">
                                <div
                                  className={`w-3 h-3 rounded-full ring-4 ring-surface-container-lowest ${
                                    progress.activeDots >= 1
                                      ? "bg-primary-container"
                                      : "bg-surface-container-high border-2 border-surface-container-high"
                                  }`}
                                ></div>
                                <div
                                  className={`w-3 h-3 rounded-full ring-4 ring-surface-container-lowest ${
                                    progress.activeDots >= 2
                                      ? "bg-primary-container"
                                      : "bg-surface-container-high border-2 border-surface-container-high"
                                  }`}
                                ></div>
                                <div
                                  className={`w-3 h-3 rounded-full ring-4 ring-surface-container-lowest ${
                                    progress.activeDots >= 3
                                      ? "bg-primary-container"
                                      : "bg-surface-container-high border-2 border-surface-container-high"
                                  }`}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between max-w-[448px] mt-2 text-xs text-on-surface-variant">
                              <span
                                className={
                                  progress.activeDots >= 1 ? "text-primary" : ""
                                }
                              >
                                Đã xác nhận
                              </span>
                              <span
                                className={
                                  progress.activeDots >= 2 ? "text-primary" : ""
                                }
                              >
                                Đang giao
                              </span>
                              <span
                                className={
                                  progress.activeDots >= 3 ? "text-primary" : ""
                                }
                              >
                                Nhận hàng
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-surface px-lg py-md border-t border-surface-container-high flex flex-col sm:flex-row justify-end gap-3">
                    {!hasMultipleItems && (
                      <Link
                        to="/account/support"
                        className="px-4 py-2 rounded-lg border border-outline text-on-surface font-label-sm text-label-sm hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm mr-2">
                          support_agent
                        </span>
                        Liên hệ hỗ trợ
                      </Link>
                    )}
                    <Link
                      to={`/account/tracking/${order.orderCode || order.id}`}
                      className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold hover:bg-secondary transition-colors shadow-sm active:scale-98 flex items-center justify-center"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </AccountShell>
  );
}
