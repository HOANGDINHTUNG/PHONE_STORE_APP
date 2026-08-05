import { AccountShell } from "../components/AccountShell";
import { Star, AlertCircle, Clock, Edit } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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

  const reviews: ReviewHistoryItem[] = [
    {
      id: "1",
      name: "PinkPhone Pro Max 512GB - Rose Petal",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBA2GXiJcRcqVUwcuypmugwC3ASn4vn7O3dqrUk7YjvbsA8lfBsx5tvnMTXLasRzmfS6YlXJ2Dd_NzOX4-SUx8IjfPgNjvZV8qw3lz8xWTDTFXdQQ5s1xo40gRrj5EeVEA7BALyZxiP9qxLm_lGQ4Uw8P1FICOHXEtR5mAzY9y6joAGtsF9peE4B_r1VMQgd1KcFFAXcfkwov1ywgBuzqxrgrXAYsvJ7rTHDU5-7NeEXfKehLmnVHCL",
      rating: 5,
      status: "APPROVED",
      title: "Sản phẩm tuyệt vời!",
      content:
        "Tôi rất hài lòng với chiếc điện thoại này. Màu sắc Rose Petal thực sự rất sang trọng và đẳng cấp. Camera chụp ảnh ban đêm cực kỳ ấn tượng, pin cũng rất trâu, dùng cả ngày không hết.",
      date: "15/05/2024",
    },
    {
      id: "2",
      name: "PinkBuds Air Pro - Limited Edition",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBjmCyeVcTcZBbdLz13R-GLDCCkML4t9WjM0yq79oRYMSzq9LB8N4FT5NLItzX2c5qFG_jGFdxRBi233P1ow090BTi67ivITrKtKIkzwZTcDnJV2THr_HS_wjum1cNhDNBOHJvVEToCBnnEK5SUMg41cElLwRewGtqSHHkoUCoW7Irdf7zHF5bP8gvj3FK46Pfgr60LScr01fzIy5dClv8FIAYBoCaFvNFtwUmYrgzf6c6PygHwknAd",
      rating: 4,
      status: "PENDING",
      title: "Âm thanh hay, thiết kế đẹp",
      content:
        "Sản phẩm rất đẹp, đóng gói cẩn thận. Âm thanh trong trẻo và kết nối rất nhanh với PinkPhone. Sẽ giới thiệu cho bạn bè.",
      date: "18/05/2024",
    },
    {
      id: "3",
      name: "PinkBook M3 Ultra - Rose Gold",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAGj9it8FDS-yMSegAYrioGKAZSYOh79BviqDt52p2nJoVyuKLN--NLVgM3-coISkInf1_BY1MD9l51Xq8Iv4kXKwLVa8Qxj_gGKPfFjITHlScO8AUPO_JK6ijV6TqtQToOlvLmL7q9QBeaG0vKeMRfztoDYyUf8iOFWMFDXOZuYZuY4d8mWPN4MHjVfLFpifxnJINOTcc9cpfn7B6kzj09wRkm-beshxboDdtyZltRtOCug7mLWsVi",
      rating: 1,
      status: "REJECTED",
      title: "Quá tệ hại",
      content:
        "Giao hàng chậm trễ, nhân viên thái độ không tốt. Máy này không đáng mua chút nào, mọi người nên tránh xa...",
      date: "10/05/2024",
      rejectionReason:
        "Nội dung không phù hợp với quy định của cộng đồng (Đánh giá dịch vụ vận chuyển thay vì đánh giá sản phẩm).",
    },
  ];

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
            <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <p className="text-on-surface-variant font-bold">
                Không có đánh giá nào phù hợp với bộ lọc này.
              </p>
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
