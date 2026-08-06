import { useState } from "react";
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
import { getReviewEligibilitiesApi, getMyReviewsApi, createReviewApi } from "../../../api/reviewService";

export function MyReviewsPage() {
  const [activeTab, setActiveTab] = useState<"ELIGIBLE" | "REVIEWED">("ELIGIBLE");
  const [reviewingItem, setReviewingItem] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { data: eligibilities = [], isLoading: loadingEl, isError: errorEl, error: errDetailEl, refetch: refetchEl } = useQuery({
    queryKey: ["reviewEligibilities"],
    queryFn: getReviewEligibilitiesApi,
  });

  const { data: reviews = [], isLoading: loadingRev, isError: errorRev, error: errDetailRev, refetch: refetchRev } = useQuery({
    queryKey: ["myReviews"],
    queryFn: getMyReviewsApi,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { productId: string; payload: any }) => createReviewApi(data.productId, data.payload),
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
          <div className="py-10 text-center text-muted">Đang tải danh sách chờ đánh giá...</div>
        )}

        {activeTab === "ELIGIBLE" && errorEl && (
          <Panel className="p-6 text-center border border-red-200 bg-red-50/50 rounded-2xl">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-100 text-red-600 mb-3">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-red-700 mb-1">Không thể tải sản phẩm chờ đánh giá</h3>
            <p className="text-xs text-red-600 mb-4">
              {(errDetailEl as any)?.response?.status
                ? `Mã lỗi HTTP ${(errDetailEl as any).response.status}. Vui lòng đăng nhập lại.`
                : "Không thể kết nối đến máy chủ backend."}
            </p>
            <button onClick={() => refetchEl()} type="button" className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition">
              Thử lại
            </button>
          </Panel>
        )}

        {activeTab === "ELIGIBLE" && !errorEl && toReview.length === 0 && !loadingEl && (
          <div className="py-10 text-center text-muted">Bạn không có sản phẩm nào cần đánh giá.</div>
        )}
        
        {activeTab === "ELIGIBLE" && toReview.map((item) => (
          <Panel key={item.orderItemId} className="p-5">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="w-16 h-16 bg-surface-soft rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/30">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain p-1" />
                ) : (
                  <PackageCheck size={32} className="text-muted" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted">Mã sản phẩm trong đơn hàng</p>
                <h2 className="mt-1 text-lg font-extrabold">{item.productName}</h2>
                <p className="mt-1 text-xs text-secondary font-medium">Hoàn thành đánh giá để nhận xu tích điểm thành viên</p>
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
                <h4 className="font-bold mb-3">Đánh giá cho sản phẩm {item.productName}</h4>
                <div className="flex gap-2 mb-4 items-center">
                  <span className="text-sm font-semibold mr-2">Mức độ hài lòng:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} type="button">
                      <Star size={24} className={star <= rating ? "fill-warning text-warning" : "text-muted"} />
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
                  <button onClick={() => setReviewingItem(null)} type="button" className="px-4 py-2 rounded-lg border border-outline font-bold text-sm">Hủy</button>
                  <button onClick={handleReviewSubmit} disabled={reviewMutation.isPending} type="button" className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm">
                    {reviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            )}
          </Panel>
        ))}

        {loadingRev && activeTab === "REVIEWED" && (
          <div className="py-10 text-center text-muted">Đang tải đánh giá của bạn...</div>
        )}

        {activeTab === "REVIEWED" && reviews.length === 0 && !loadingRev && (
          <div className="py-10 text-center text-muted">Bạn chưa viết đánh giá nào.</div>
        )}

        {activeTab === "REVIEWED" && reviews.map((review) => (
          <Panel key={review.id} className="p-5">
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
               <div className="w-16 h-16 bg-surface-soft rounded-lg flex items-center justify-center shrink-0 mt-1 border border-outline-variant/30 overflow-hidden">
                {review.imageUrl ? (
                  <img src={review.imageUrl} alt={review.productName || "Sản phẩm"} className="w-full h-full object-contain p-1" />
                ) : (
                  <Star size={32} className="text-warning fill-warning" />
                )}
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    {review.productName && (
                      <p className="text-xs text-muted font-semibold mb-0.5">{review.productName}</p>
                    )}
                    <h2 className="text-base font-extrabold">{review.title || review.productName || "Đánh giá sản phẩm"}</h2>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${review.status === "APPROVED" ? "bg-green-100 text-green-700" : review.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {review.status === "APPROVED" ? "Đã duyệt" : review.status === "PENDING" ? "Chờ duyệt" : "Bị từ chối"}
                  </span>
                </div>
                <div className="mt-1 flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-warning text-warning" : "text-muted"} />
                  ))}
                </div>
                <p className="mt-3 text-on-surface text-sm whitespace-pre-wrap">
                  {review.comment}
                </p>
                {review.rejectionReason && review.status === "REJECTED" && (
                  <p className="mt-2 text-xs text-red-600 font-medium">Lý do từ chối: {review.rejectionReason}</p>
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
      title="Bảo hành của tôi"
      description="Quản lý và tra cứu thông tin bảo hành, đổi trả các sản phẩm đã mua tại PinkPhone."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-headline-md font-headline-md font-bold text-on-background">
            Bảo hành của tôi
          </h1>
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              className="w-full bg-surface-container border-outline/30 text-body-md font-body-md rounded-full py-3 pl-12 pr-4 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
              placeholder="Tìm theo mã bảo hành, đơn hàng, IMEI..."
              type="text"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={20}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-label-sm font-label-sm whitespace-nowrap">
            Tất cả
          </button>
          <button className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-label-sm font-label-sm whitespace-nowrap hover:bg-surface-variant transition-colors">
            Đang hiệu lực (ACTIVE)
          </button>
          <button className="px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-label-sm font-label-sm whitespace-nowrap hover:bg-surface-variant transition-colors">
            Hết hạn (EXPIRED)
          </button>
        </div>

        {/* Warranty List */}
        <div className="flex flex-col gap-6">
          {/* Warranty Card 1: ACTIVE */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-highest flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
            <div className="w-32 h-32 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                className="w-full h-full object-contain p-2"
                alt="Product"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO6v5Q31yGSQ8gZV9DiOXaL9UKKA3aQDh86eBWAOe6JB_JByJxVq-9sTdKCB7wdLGaP1GphvHFPBMbFADBojBNagC8TwCV9ke38Iy87SASIQCXMu09VQl6Rbqp8TvlT9tEvmrQBm0epVT9q_4uag9yx_g__y2AtkEYYx4GvbBlqY9EvExSxVzOwEmMmDOH-P8r-d7LphjaLSXV7fyg9f77Vks2YiqiKrxkj88nypnftuBvGhV3zWNO"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-body-lg font-body-lg font-bold text-on-background">
                    PinkPhone 15 Pro Max
                  </h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider font-bold">
                    Active
                  </span>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant mb-4">
                  256GB / Rose Gold
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Mã bảo hành
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    W-8472-X9M
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Mã đơn hàng
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    ORD-99381
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    IMEI/Serial
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    *****5921
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Thời hạn
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background">
                    12/2023 - 12/2024
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end lg:justify-start">
              <Link
                to={`/account/returns/W-8472-X9M`}
                className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-sm font-label-sm font-semibold hover:bg-secondary active:scale-[0.98] transition-all whitespace-nowrap"
              >
                Yêu cầu bảo hành
              </Link>
            </div>
          </div>

          {/* Warranty Card 2: EXPIRED */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-highest flex flex-col lg:flex-row gap-6 opacity-75">
            <div className="w-32 h-32 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0 grayscale">
              <img
                className="w-full h-full object-contain p-2"
                alt="Product"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVlUQuIURzcuQSHdgLA_m0m4WrzKc7sjKRqDq1BkaRh3V7LAbNSSZcpgxrwcNTnv3F8YvWt8wAVJYPTwLqt8D_xmdu0jZq_c5UeBsyYxccNkopUx8EmKetNN-g59nyywL7R5rEho6kCyu9MSD-RKbDPI66tIA-ld5SeDf2yLbRqmnlxjuYZ-GpmXWXv_RvdSDuQEHLAjzsKN57jBoYh5W61j5lBe7tNoO-2Hv-5P33KQwveXnepvID"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-body-lg font-body-lg font-bold text-on-background">
                    PinkPhone 13
                  </h3>
                  <span className="bg-surface-dim text-on-surface px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider font-bold">
                    Expired
                  </span>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant mb-4">
                  128GB / Midnight
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Mã bảo hành
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    W-2210-P4A
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Mã đơn hàng
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    ORD-44210
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    IMEI/Serial
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background font-mono">
                    *****1042
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block mb-1">
                    Thời hạn
                  </span>
                  <span className="text-label-sm font-label-sm text-on-background">
                    05/2022 - 05/2023
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end lg:justify-start">
              {/* No CTA for expired */}
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    Icon: ShoppingBag,
    title: "Xác nhận đơn hàng #PP-123456",
    time: "Vừa xong",
    text: "Đơn hàng của bạn đã được xác nhận và đang trong quá trình chuẩn bị. Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.",
    isRead: false,
    category: "Đơn hàng",
  },
  {
    id: "2",
    Icon: CreditCard,
    title: "Thanh toán thành công #PP-123412",
    time: "2 giờ trước",
    text: "Bạn đã thanh toán thành công số tiền 24,990,000đ cho đơn hàng #PP-123412.",
    isRead: true,
    category: "Đơn hàng",
  },
  {
    id: "3",
    Icon: Truck,
    title: "Đơn hàng #PP-123390 đang được giao",
    time: "Hôm qua",
    text: "Đơn hàng của bạn đã được giao cho bưu tá. Vui lòng chú ý điện thoại để nhận hàng.",
    isRead: true,
    category: "Đơn hàng",
  },
];

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  // [DEV-MODE]: Added state machine to handle the 4 lifecycle paths organically
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "error" | "empty" | "success"
  >("success");

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((n) => {
    if (activeTab === "Chưa đọc") return !n.isRead;
    if (activeTab === "Đơn hàng") return n.category === "Đơn hàng";
    return true;
  });

  return (
    <AccountShell
      title="Thông báo"
      description="Cập nhật đơn hàng, ưu đãi và hoạt động tài khoản PinkPhone."
      actions={
        <div className="flex items-center gap-4">
          {/* Debug Panel to toggle states easily during UI verification */}
          <div className="hidden lg:flex bg-surface-container-high rounded-full p-1 gap-1 text-[10px] font-bold">
            {["loading", "empty", "error", "success"].map((s) => (
              <button
                key={s}
                onClick={() => setFetchStatus(s as any)}
                className={`px-3 py-1 rounded-full uppercase ${fetchStatus === s ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container-highest"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors underline decoration-primary decoration-2 underline-offset-4"
          >
            Đánh dấu tất cả là đã đọc
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-8 overflow-x-auto border-b border-outline-variant mb-6">
        {["Tất cả", "Chưa đọc", "Đơn hàng", "Ưu đãi"].map((tab) => (
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
              className="bg-surface-container-low rounded-xl p-4 flex gap-4 items-start animate-pulse"
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
            Hộp thư thông báo đang trống
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Các cập nhật về đơn hàng và ưu đãi sẽ xuất hiện tại đây.
          </p>
          <button className="mt-6 font-label-sm text-label-sm bg-primary text-on-primary px-6 py-3 rounded-full hover:bg-secondary transition-colors">
            Tiếp tục mua sắm
          </button>
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
            onClick={() => {
              setFetchStatus("loading");
              setTimeout(() => setFetchStatus("success"), 1000);
            }}
            className="font-label-sm text-label-sm border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      )}

      {fetchStatus === "success" && (
        <div className="fade-in">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-on-surface-variant font-medium">
              Không tìm thấy thông báo nào trong mục này
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-xl p-4 flex gap-4 items-start shadow-sm border border-border/50 hover:shadow-md transition-shadow relative cursor-pointer ${
                    !notif.isRead
                      ? "bg-primary-fixed-dim/10"
                      : "bg-surface-container-lowest"
                  }`}
                >
                  {!notif.isRead && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full"></div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      !notif.isRead
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    <notif.Icon size={20} />
                  </div>

                  <div className="flex-grow pr-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-label-sm text-label-sm text-on-surface">
                        {notif.title}
                      </h4>
                      <span className="font-body-md text-body-md text-on-surface-variant text-sm shrink-0 ml-2">
                        {notif.time}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {notif.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button className="font-label-sm text-label-sm text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              Xem thêm
            </button>
          </div>
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
