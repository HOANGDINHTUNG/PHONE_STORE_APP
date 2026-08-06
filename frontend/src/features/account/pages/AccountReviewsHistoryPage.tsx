import { AccountShell } from "../components/AccountShell";
import {
  Star,
  AlertCircle,
  Clock,
  Edit,
  MessageSquare,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReviewsApi } from "../../../api/reviewService";
import { getDefaultProductImage } from "../../../api/productService";
import { Loader2 } from "lucide-react";

interface ReviewHistoryItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  title: string;
  content: string;
  date: string;
  rejectionReason?: string;
}

export function AccountReviewsHistoryPage() {
  const [filter, setFilter] = useState<
    "ALL" | "APPROVED" | "PENDING" | "REJECTED"
  >("ALL");
  const [reviews, setReviews] = useState<ReviewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await getMyReviewsApi();
        if (active && Array.isArray(data)) {
          const mapped: ReviewHistoryItem[] = data.map((r) => ({
            id: r.id,
            name: r.productName || "Sản phẩm",
            image: r.imageUrl && r.imageUrl.trim() !== ""
              ? r.imageUrl
              : getDefaultProductImage(undefined, r.productName || undefined),
            rating: r.rating,
            status: r.status,
            title: r.title || "Đánh giá sản phẩm",
            content: r.comment || "",
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "",
            rejectionReason: r.rejectionReason || undefined,
          }));
          setReviews(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch my reviews:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadReviews();
    return () => {
      active = false;
    };
  }, []);

  const filteredReviews = reviews.filter(
    (r) => filter === "ALL" || r.status === filter,
  );

  return (
    <AccountShell title="" description="">
      <div className="-mt-2">
        <div className="flex items-center gap-6 mb-6 border-b-2 border-outline-variant/30">
          <Link
            to="/account/reviews"
            className="pb-3 border-b-2 border-primary text-primary font-bold flex items-center gap-2 translate-y-[2px]"
          >
            <Star size={20} />
            Đã đánh giá
          </Link>
          <Link
            to="/account/reviews/pending"
            className="pb-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-bold flex items-center gap-2 transition-colors"
          >
            <Clock size={20} />
            Chờ đánh giá
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4 border-b-2 border-primary/20 pb-4">
          <h1
            className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary tracking-tight font-black"
            style={{ fontSize: "32px", lineHeight: "40px" }}
          >
            Đánh giá của tôi
          </h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-surface-container-highest rounded-full text-label-sm text-on-surface-variant font-bold shadow-sm">
              Tổng số: {reviews.length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2 mt-4">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "APPROVED", label: "Đã hiển thị" },
            { id: "PENDING", label: "Chờ duyệt" },
            { id: "REJECTED", label: "Bị từ chối" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-2.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors shadow-sm ${
                filter === f.id
                  ? "bg-primary text-white pointer-events-none"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/80 cursor-pointer"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Review Cards List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-surface-container-lowest border p-6 rounded-2xl shadow-sm transition-shadow ${
                review.status === "REJECTED"
                  ? "border-error/30"
                  : "border-outline-variant/30 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div
                  className={`w-28 h-28 bg-surface-container-low rounded-xl flex-shrink-0 flex items-center justify-center p-2 ${review.status === "REJECTED" ? "opacity-50 grayscale-[0.2]" : ""}`}
                >
                  <img
                    className="w-full h-full object-contain"
                    alt={review.name}
                    src={review.image}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
                    <div>
                      <h2
                        className={`text-body-lg font-black text-on-surface leading-tight ${review.status === "REJECTED" ? "opacity-80" : ""}`}
                      >
                        {review.name}
                      </h2>
                      <div
                        className={`flex items-center gap-1 mt-2 text-primary ${review.status === "REJECTED" ? "opacity-50" : ""}`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={
                              star <= review.rating
                                ? "fill-primary"
                                : "text-outline-variant"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {review.status === "APPROVED" && (
                        <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-label-sm font-bold border border-green-200">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                          Đã hiển thị
                        </span>
                      )}
                      {review.status === "PENDING" && (
                        <span className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-label-sm font-bold border border-amber-200">
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                          Chờ duyệt
                        </span>
                      )}
                      {review.status === "REJECTED" && (
                        <span className="flex items-center gap-1.5 px-4 py-1.5 bg-red-100 text-red-800 rounded-full text-label-sm font-bold border border-red-200">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                          Bị từ chối
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3
                      className={`font-bold text-on-surface-variant ${review.status === "REJECTED" ? "text-error/70 line-through" : ""}`}
                    >
                      {review.title}
                    </h3>
                    <p
                      className={`mt-2 text-[15px] leading-relaxed ${review.status === "REJECTED" ? "text-on-surface-variant/50 line-through" : review.status === "PENDING" ? "text-on-surface-variant/70 italic" : "text-on-surface-variant"}`}
                    >
                      {review.content}
                    </p>

                    {/* Rejection Reason Block */}
                    {review.status === "REJECTED" && review.rejectionReason && (
                      <div className="mt-4 bg-[#fff0f1] p-4 rounded-xl flex items-start gap-3 border border-error/10">
                        <AlertCircle
                          className="text-error shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="text-on-error-container font-black text-label-sm">
                            Lý do từ chối:
                          </p>
                          <p className="text-on-error-container text-[14px] mt-1 font-medium">
                            {review.rejectionReason}
                          </p>
                          <button className="mt-3 text-primary font-black text-label-sm flex items-center gap-2 hover:underline active:scale-95 transition-all">
                            Chỉnh sửa lại đánh giá
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-outline font-medium">
                      Đã đánh giá vào: {review.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-surface-container-lowest to-surface-container-low/30 min-h-[400px] rounded-2xl border border-outline-variant/30 mt-4">
              <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute inset-2 bg-secondary-fixed rounded-full opacity-50"></div>
                <MessageSquare className="w-16 h-16 text-primary relative z-10" />

                <Star className="absolute top-2 right-2 w-6 h-6 text-tertiary" />
                <Search className="absolute bottom-4 left-0 w-5 h-5 text-secondary opacity-70" />
              </div>

              <h2 className="text-[24px] font-headline-md text-on-surface mb-3 font-bold">
                Bạn chưa có đánh giá nào.
              </h2>
              <p className="text-[16px] font-body-md text-on-surface-variant max-w-[400px] mx-auto mb-8 opacity-80">
                Những nhận xét của bạn sẽ giúp người dùng khác chọn được sản
                phẩm ưng ý nhất.
              </p>

              <Link
                to="/account/reviews/pending"
                className="bg-secondary-container text-on-secondary-container hover:bg-primary-container px-6 py-3 rounded-full text-[14px] font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-2 max-w-fit mx-auto"
              >
                <Edit className="w-5 h-5" />
                Xem sản phẩm chờ đánh giá
              </Link>
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
