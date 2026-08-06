import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  Star,
  Truck,
  BellOff,
  Search,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell, Panel } from "../components/AccountShell";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewEligibilitiesApi,
  getMyReviewsApi,
  createReviewApi,
} from "../../../api/reviewService";
import {
  getNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  NotificationResponse,
} from "../../../api/notificationService";

export function MyReviewsPage() {
  const [activeTab, setActiveTab] = useState<"ELIGIBLE" | "REVIEWED">(
    "ELIGIBLE",
  );
  const [reviewingItem, setReviewingItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const {
    data: eligibilities = [],
    isLoading: loadingEl,
    isError: errorEl,
    error: errDetailEl,
    refetch: refetchEl,
  } = useQuery({
    queryKey: ["reviewEligibilities"],
    queryFn: getReviewEligibilitiesApi,
  });

  const {
    data: reviews = [],
    isLoading: loadingRev,
    isError: errorRev,
    error: errDetailRev,
    refetch: refetchRev,
  } = useQuery({
    queryKey: ["myReviews"],
    queryFn: getMyReviewsApi,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { productId: string; payload: any }) =>
      createReviewApi(data.productId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewEligibilities"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      setReviewingItem(null);
      setTitle("");
      setComment("");
      setRating(5);
    },
  });

  const handleReviewSubmit = () => {
    if (!reviewingItem) return;
    reviewMutation.mutate({
      productId: reviewingItem.productId,
      payload: {
        orderItemId: reviewingItem.orderItemId,
        rating,
        title: title || undefined,
        comment,
      },
    });
  };

  const toReview = eligibilities.filter((e) => !e.hasReview);

  return (
    <AccountShell
      title="Đánh giá của tôi"
      description="Quản lý đánh giá và chia sẻ trải nghiệm sử dụng điện thoại đã mua tại PinkPhone."
    >
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("ELIGIBLE")}
          className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold transition ${activeTab === "ELIGIBLE" ? "bg-primary text-white" : "text-muted hover:bg-surface-soft"}`}
        >
          Chờ đánh giá ({toReview.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("REVIEWED")}
          className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold transition ${activeTab === "REVIEWED" ? "bg-primary text-white" : "text-muted hover:bg-surface-soft"}`}
        >
          Đã đánh giá ({reviews.length})
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {loadingEl && activeTab === "ELIGIBLE" && (
          <div className="py-10 text-center text-muted">
            Đang tải danh sách chờ đánh giá...
          </div>
        )}

        {activeTab === "ELIGIBLE" && errorEl && (
          <Panel className="p-6 text-center border border-red-200 bg-red-50/50 rounded-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-100 text-red-600 mb-3">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-red-700 mb-1">
              Không thể tải sản phẩm chờ đánh giá
            </h3>
            <p className="text-xs text-red-600 mb-4">
              {(errDetailEl as any)?.response?.status
                ? `Mã lỗi HTTP ${(errDetailEl as any).response.status}. Vui lòng đăng nhập lại.`
                : "Không thể kết nối đến máy chủ backend."}
            </p>
            <button
              onClick={() => refetchEl()}
              type="button"
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
            >
              Thử lại
            </button>
          </Panel>
        )}

        {activeTab === "ELIGIBLE" &&
          !errorEl &&
          toReview.length === 0 &&
          !loadingEl && (
            <div className="py-10 text-center text-muted">
              Bạn không có sản phẩm nào cần đánh giá.
            </div>
          )}

        {activeTab === "ELIGIBLE" &&
          toReview.map((item) => (
            <Panel key={item.orderItemId} className="p-5">
              <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="w-16 h-16 bg-surface-soft rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/30">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <PackageCheck size={32} className="text-muted" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted">
                    Mã sản phẩm trong đơn hàng
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold">
                    {item.productName}
                  </h2>
                  <p className="mt-1 text-xs text-secondary font-medium">
                    Hoàn thành đánh giá để nhận xu tích điểm thành viên
                  </p>
                </div>
                <button
                  onClick={() => {
                    setReviewingItem(item);
                    setRating(5);
                    setTitle("");
                    setComment("");
                  }}
                  type="button"
                  className="min-h-11 rounded-xl px-5 text-sm font-bold bg-primary text-white hover:bg-primary-strong transition"
                >
                  Viết đánh giá
                </button>
              </div>

              {reviewingItem?.orderItemId === item.orderItemId && (
                <div className="mt-4 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant">
                  <h4 className="font-bold mb-3">
                    Đánh giá cho sản phẩm {item.productName}
                  </h4>
                  <div className="flex gap-2 mb-4 items-center">
                    <span className="text-sm font-semibold mr-2">
                      Mức độ hài lòng:
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        type="button"
                      >
                        <Star
                          size={24}
                          className={
                            star <= rating
                              ? "fill-warning text-warning"
                              : "text-muted"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Tiêu đề đánh giá (không bắt buộc)..."
                    className="w-full p-3 rounded-lg border border-outline mb-3 text-sm focus:border-primary outline-none"
                  />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận chi tiết của bạn về sản phẩm..."
                    className="w-full p-3 rounded-lg border border-outline mb-3 h-24 text-sm focus:border-primary outline-none"
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setReviewingItem(null)}
                      type="button"
                      className="px-4 py-2 rounded-lg border border-outline font-bold text-sm"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleReviewSubmit}
                      disabled={reviewMutation.isPending}
                      type="button"
                      className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm"
                    >
                      {reviewMutation.isPending
                        ? "Đang gửi..."
                        : "Gửi đánh giá"}
                    </button>
                  </div>
                </div>
              )}
            </Panel>
          ))}

        {loadingRev && activeTab === "REVIEWED" && (
          <div className="py-10 text-center text-muted">
            Đang tải đánh giá của bạn...
          </div>
        )}

        {activeTab === "REVIEWED" && reviews.length === 0 && !loadingRev && (
          <div className="py-10 text-center text-muted">
            Bạn chưa viết đánh giá nào.
          </div>
        )}

        {activeTab === "REVIEWED" &&
          reviews.map((review) => (
            <Panel key={review.id} className="p-5">
              <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                <div className="w-16 h-16 bg-surface-soft rounded-lg flex items-center justify-center shrink-0 mt-1 border border-outline-variant/30 overflow-hidden">
                  {review.imageUrl ? (
                    <img
                      src={review.imageUrl}
                      alt={review.productName || "Sản phẩm"}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Star size={32} className="text-warning fill-warning" />
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      {review.productName && (
                        <p className="text-xs text-muted font-semibold mb-0.5">
                          {review.productName}
                        </p>
                      )}
                      <h2 className="text-base font-extrabold">
                        {review.title ||
                          review.productName ||
                          "Đánh giá sản phẩm"}
                      </h2>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${review.status === "APPROVED" ? "bg-green-100 text-green-700" : review.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                    >
                      {review.status === "APPROVED"
                        ? "Đã duyệt"
                        : review.status === "PENDING"
                          ? "Chờ duyệt"
                          : "Bị từ chối"}
                    </span>
                  </div>
                  <div className="mt-1 flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "fill-warning text-warning"
                            : "text-muted"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-on-surface text-sm whitespace-pre-wrap">
                    {review.comment}
                  </p>
                  {review.rejectionReason && review.status === "REJECTED" && (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      Lý do từ chối: {review.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </Panel>
          ))}
      </div>
    </AccountShell>
  );
}

export function ReturnsPage() {
  return (
    <AccountShell
      title="Đổi trả & hoàn tiền"
      description="Quản lý các yêu cầu đổi trả và hoàn tiền của bạn."
    >
      <div className="flex-1 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-on-background mb-1">
              Đổi trả & hoàn tiền
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Quản lý các yêu cầu đổi trả và hoàn tiền của bạn.
            </p>
          </div>
          <Link
            to="/account/returns/new"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-sm text-label-sm hover:bg-secondary-container active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              add
            </span>
            Tạo yêu cầu mới
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-surface-container-low p-4 rounded-xl shadow-[0px_2px_8px_rgba(214,51,108,0.04)] border border-outline-variant/30 flex flex-col items-center justify-center">
            <span className="text-display-lg font-display-lg font-bold text-primary">
              3
            </span>
            <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant mt-1 text-center">
              Đang xử lý
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl shadow-[0px_2px_8px_rgba(214,51,108,0.04)] border border-outline-variant/30 flex flex-col items-center justify-center">
            <span className="text-display-lg font-display-lg font-bold text-on-background">
              1
            </span>
            <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant mt-1 text-center">
              Đang vận chuyển
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl shadow-[0px_2px_8px_rgba(214,51,108,0.04)] border border-outline-variant/30 flex flex-col items-center justify-center">
            <span className="text-display-lg font-display-lg font-bold text-on-background">
              5
            </span>
            <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant mt-1 text-center">
              Hoàn thành
            </span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl shadow-[0px_2px_8px_rgba(214,51,108,0.04)] border border-outline-variant/30 flex flex-col items-center justify-center">
            <span className="text-display-lg font-display-lg font-bold text-on-background">
              0
            </span>
            <span className="text-label-sm font-label-sm font-semibold text-on-surface-variant mt-1 text-center">
              Đã hủy
            </span>
          </div>
        </div>

        {/* List View */}
        <div className="flex flex-col gap-4">
          {/* Item 1: PENDING */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_12px_rgba(214,51,108,0.08)] border border-surface-container-high transition-shadow hover:shadow-[0px_8px_24px_rgba(214,51,108,0.12)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-surface-container p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    assignment_return
                  </span>
                </div>
                <div>
                  <h4 className="text-label-sm font-label-sm font-bold text-on-background">
                    #RT-12345
                  </h4>
                  <p className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Đơn hàng: #ORD-98765
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim">
                  PENDING
                </span>
                <span className="text-body-md font-body-md text-on-surface-variant text-xs font-semibold">
                  24/10/2024
                </span>
              </div>
            </div>
            <div className="h-px bg-outline-variant/30 my-3 w-full"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  alt="Product Image"
                  className="w-12 h-12 object-contain bg-surface-container rounded"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsBKvDTQ1O4iRarAMqmCOO27UlBLSBrgLTOEvnVyEVf77F-6fFu4CKoYkWVKpcSVdbWqtND6pRkbVn2hD3Z-cpqHT-N38gX_8LDk_rTNI2S0ZRnU_xZFsfwNMeGYbD_2YO9_WHPqxMefEfdYEYTIz6ZqCuhP7mYxsWk2XIUnxzTaQakh_TBBQrpKfD_h0iCprhb8N0I-8ykS3tFUpTu35WfGQpJIMw9jzYiPM0vjXw_Qv5KhSXqm73"
                />
                <div>
                  <p className="text-body-md font-body-md text-on-background font-medium line-clamp-1">
                    PinkPhone Pro Max 256GB - Rose Pink
                  </p>
                  <p className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Loại: Hoàn tiền
                  </p>
                </div>
              </div>
              <Link
                className="text-primary hover:text-secondary font-label-sm text-label-sm font-semibold px-3 py-1.5 rounded hover:bg-primary-fixed/30 transition-colors hidden sm:block"
                to="/account/returns/RT-12345"
              >
                Xem chi tiết
              </Link>
            </div>
            <Link
              className="text-primary hover:text-secondary font-label-sm text-label-sm font-semibold w-full text-center py-2 mt-3 rounded hover:bg-primary-fixed/30 transition-colors sm:hidden block border border-primary/20"
              to="/account/returns/RT-12345"
            >
              Xem chi tiết
            </Link>
          </div>

          {/* Item 2: IN_TRANSIT */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0px_4px_12px_rgba(214,51,108,0.08)] border border-surface-container-high transition-shadow hover:shadow-[0px_8px_24px_rgba(214,51,108,0.12)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="bg-surface-container p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    published_with_changes
                  </span>
                </div>
                <div>
                  <h4 className="text-label-sm font-label-sm font-bold text-on-background">
                    #RT-12344
                  </h4>
                  <p className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Đơn hàng: #ORD-98760
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-fixed text-on-primary-fixed-variant border border-primary-fixed-dim">
                  IN_TRANSIT
                </span>
                <span className="text-body-md font-body-md text-on-surface-variant text-xs font-semibold">
                  20/10/2024
                </span>
              </div>
            </div>
            <div className="h-px bg-outline-variant/30 my-3 w-full"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  alt="Product Image"
                  className="w-12 h-12 object-contain bg-surface-container rounded"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh-MXDsnjZf6tDIbn2nIV-E8k2c1wc89J9xmXi66e3zfrSMIo85lmMeMFDopbE00jRJFhds9SuDBIVsRItmqbqwX3cKVF41UIPRDS1ucxhTRgC_dFJBx6Gg8qOyD0zmuTgvE7_R6_GJIOYxe4acewqGX2LPHNWQa18pFOyIjrBHVK9b4sI2B_YVcB9kDqlgM8FLe0Pusgr04o5KDNbZzJsBLT7X919oAF7PtjJwQrUTsgoKZWy6ik6"
                />
                <div>
                  <p className="text-body-md font-body-md text-on-background font-medium line-clamp-1">
                    PinkPods ANC - Cotton Candy
                  </p>
                  <p className="text-body-md font-body-md text-on-surface-variant text-sm">
                    Loại: Đổi sản phẩm
                  </p>
                </div>
              </div>
              <Link
                className="text-primary hover:text-secondary font-label-sm text-label-sm font-semibold px-3 py-1.5 rounded hover:bg-primary-fixed/30 transition-colors hidden sm:block"
                to="/account/returns/RT-12344"
              >
                Xem chi tiết
              </Link>
            </div>
            <Link
              className="text-primary hover:text-secondary font-label-sm text-label-sm font-semibold w-full text-center py-2 mt-3 rounded hover:bg-primary-fixed/30 transition-colors sm:hidden block border border-primary/20"
              to="/account/returns/RT-12344"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "error" | "empty" | "success"
  >("loading");
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    setFetchStatus("loading");
    try {
      const data = await getNotificationsApi();
      setNotifications(data);
      if (data.length === 0) setFetchStatus("empty");
      else setFetchStatus("success");
    } catch {
      setFetchStatus("error");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Chưa đọc") return !n.readAt;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return ShoppingBag;
      case "PAYMENT":
        return CreditCard;
      case "RETURN":
        return RefreshCcw;
      default:
        return Bell;
    }
  };

  const getNotifColor = (type: string) => {
    switch (type) {
      case "ORDER":
        return "bg-primary/20 text-primary";
      case "PAYMENT":
        return "bg-green-500/20 text-green-600";
      case "RETURN":
        return "bg-orange-500/20 text-orange-600";
      default:
        return "bg-surface-variant text-on-surface-variant";
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsReadApi();
    loadNotifs();
  };

  return (
    <AccountShell
      title="Thông báo"
      actions={
        <div className="flex items-center gap-4">
          {notifications.length > 0 && notifications.some((n) => !n.readAt) && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors underline decoration-primary decoration-2 underline-offset-4"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto border-b border-outline-variant mb-6">
        {["Tất cả", "Chưa đọc"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-label-sm text-label-sm pb-2 px-1 whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "font-bold text-primary border-b-2 border-primary"
                : "font-medium text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {fetchStatus === "loading" && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 items-start animate-pulse shadow-[0_4px_12px_rgba(214,51,108,0.08)]"
            >
              <div className="w-10 h-10 rounded-full bg-surface-variant shrink-0"></div>
              <div className="flex-grow">
                <div
                  className={`h-4 bg-surface-variant rounded mb-2 ${i === 1 ? "w-1/3" : i === 2 ? "w-1/4" : "w-1/2"}`}
                ></div>
                <div className="h-3 bg-surface-variant rounded w-full mb-1"></div>
                <div
                  className={`h-3 bg-surface-variant rounded ${i === 1 ? "w-2/3" : i === 2 ? "w-1/2" : "w-3/4"}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fetchStatus === "empty" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-outline-variant mt-8 fade-in">
          <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mb-6 text-outline">
            <BellOff size={48} />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            Không có thông báo nào
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[448px]">
            Bạn hiện không có thông báo nào mới. Hãy tiếp tục mua sắm để trải
            nghiệm các dịch vụ từ PinkPhone.
          </p>
          <Link
            to="/"
            className="mt-6 font-label-sm text-label-sm bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-secondary transition-colors inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      )}

      {fetchStatus === "error" && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-t border-outline-variant mt-8 fade-in">
          <div className="w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            Đã xảy ra lỗi khi tải dữ liệu
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Vui lòng kiểm tra kết nối mạng và thử lại.
          </p>
          <button
            onClick={loadNotifs}
            className="font-label-sm text-label-sm border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      )}

      {fetchStatus === "success" && (
        <div className="fade-in">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-t border-outline-variant mt-8 fade-in">
              <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mb-6 text-outline">
                <BellOff size={48} />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Không có thông báo nào
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[448px]">
                Bạn hiện không có thông báo nào mới ở danh mục này.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredNotifications.map((notif) => {
                const IconComp = getNotifIcon(notif.notificationType);
                return (
                  <Link
                    key={notif.id}
                    to={notif.actionUrl}
                    onClick={async () => {
                      if (!notif.readAt) {
                        await markNotificationReadApi(notif.id);
                      }
                    }}
                    className={`rounded-xl p-4 flex gap-4 items-start shadow-[0_4px_12px_rgba(214,51,108,0.08)] hover:shadow-[0_8px_24px_rgba(214,51,108,0.12)] transition-shadow relative cursor-pointer ${
                      !notif.readAt
                        ? "bg-primary-fixed-dim/10"
                        : "bg-surface-container-lowest"
                    }`}
                  >
                    {!notif.readAt && (
                      <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full"></div>
                    )}

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        !notif.readAt
                          ? getNotifColor(notif.notificationType)
                          : "bg-surface-variant text-on-surface-variant shrink-0"
                      }`}
                    >
                      <IconComp size={20} />
                    </div>

                    <div className="flex-grow pr-6">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-label-sm text-label-sm text-on-surface">
                          {notif.title}
                        </h4>
                        <span className="font-body-md text-body-md text-on-surface-variant text-sm shrink-0 ml-2">
                          {new Date(notif.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {notif.content}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AccountShell>
  );
}

function Summary({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof RefreshCcw;
  value: string;
  label: string;
}) {
  return (
    <Panel className="p-5 text-center">
      <Icon className="mx-auto text-primary" size={21} />
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </Panel>
  );
}
