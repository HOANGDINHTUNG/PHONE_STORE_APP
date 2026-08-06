import { AccountShell } from "../components/AccountShell";
import { useEffect, useState } from "react";
import {
  X,
  Star,
  Info,
  Loader2,
  ShoppingBag,
  Edit,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getReviewEligibilitiesApi,
  createReviewApi,
} from "../../../api/reviewService";
import { getDefaultProductImage } from "../../../api/productService";
import { message } from "antd";

interface PendingReviewItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  attributes: string;
  purchaseDate: string;
}

export function AccountReviewsPage() {
  const [selectedProduct, setSelectedProduct] =
    useState<PendingReviewItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<PendingReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await getReviewEligibilitiesApi();
      if (Array.isArray(data)) {
        const eligible = data
          .filter((e) => !e.hasReview)
          .map((e) => ({
            id: e.orderItemId,
            productId: e.productId,
            name: e.productName,
            image: e.imageUrl && e.imageUrl.trim() !== ""
              ? e.imageUrl
              : getDefaultProductImage(undefined, e.productName),
            attributes: e.orderCompletedAt
              ? `Đã mua ngày ${new Date(e.orderCompletedAt).toLocaleDateString("vi-VN")}`
              : "Đã hoàn thành",
            purchaseDate: e.orderCompletedAt
              ? new Date(e.orderCompletedAt).toLocaleDateString("vi-VN")
              : "",
          }));
        setPendingReviews(eligible);
      }
    } catch (err) {
      console.warn("Failed to fetch review eligibilities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      message.warning("Vui lòng chọn mức đánh giá sao.");
      return;
    }
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      await createReviewApi(selectedProduct.productId, {
        orderItemId: selectedProduct.id,
        rating,
        title: titleInput || undefined,
        comment: commentInput || undefined,
      });
      message.success("Cảm ơn bạn đã gửi đánh giá! Đánh giá sẽ được hiển thị sau khi duyệt.");
      closeModal();
      loadPending();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
      message.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setRating(0);
    setHoverRating(0);
    setTitleInput("");
    setCommentInput("");
    setIsSubmitting(false);
  };

  return (
    <>
      <AccountShell title="" description="">
        <div className="-mt-2">
          <div className="flex items-center gap-6 mb-6 border-b-2 border-outline-variant/30">
            <Link
              to="/account/reviews"
              className="pb-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-bold flex items-center gap-2 transition-colors"
            >
              <Star size={20} />
              Đã đánh giá
            </Link>
            <Link
              to="/account/reviews/pending"
              className="pb-3 border-b-2 border-primary text-primary font-bold flex items-center gap-2 translate-y-[2px]"
            >
              <Clock size={20} />
              Chờ đánh giá
            </Link>
          </div>

          <header className="mb-8 border-b-2 border-primary/20 pb-4">
            <h1
              className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary tracking-tight font-black"
              style={{ fontSize: "32px", lineHeight: "40px" }}
            >
              Sản phẩm chờ đánh giá
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-3xl mt-4">
              Chia sẻ trải nghiệm của bạn về các sản phẩm đã mua để giúp cộng
              đồng PinkPhone chọn được sản phẩm ưng ý nhất.
            </p>
          </header>

          {/* Pending Reviews List */}
          {pendingReviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {pendingReviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/50 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-32 h-32 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt={item.name}
                      src={item.image}
                    />
                  </div>
                  <div className="flex-grow flex flex-col gap-1 text-center md:text-left">
                    <span className="text-label-sm font-label-sm text-primary uppercase tracking-wider font-bold">
                      {item.id}
                    </span>
                    <h3 className="text-headline-md font-headline-md font-bold text-on-surface">
                      {item.name}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mt-1">
                      {item.attributes}
                    </p>
                    <p className="text-label-sm text-outline font-medium mt-1">
                      Ngày mua: {item.purchaseDate}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <button
                      onClick={() => setSelectedProduct(item)}
                      className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-sm"
                    >
                      Viết đánh giá
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            /* Empty State */
            <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center p-10 min-h-[500px]">
              <div className="mb-8 relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-30 animate-pulse"></div>
                <MessageSquare className="text-primary w-24 h-24 relative z-10" />
              </div>
              <h2 className="text-[24px] font-headline-md font-bold text-on-surface text-center mb-2">
                Bạn hiện không có sản phẩm nào chờ đánh giá.
              </h2>
              <p className="w-full text-body-md text-[16px] text-on-surface-variant text-center max-w-[450px] mx-auto mb-10">
                Hãy tiếp tục mua sắm để chia sẻ trải nghiệm của bạn với cộng
                đồng nhé!
              </p>
              <Link
                to="/store"
                className="bg-primary hover:bg-secondary text-on-primary font-bold px-8 py-3 rounded-full transition-all active:scale-95 shadow-sm flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Mua sắm ngay
              </Link>
            </div>
          )}
        </div>
      </AccountShell>

      {/* Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="bg-white text-slate-900 w-[92vw] sm:w-[520px] shrink-0 rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low rounded-t-2xl shrink-0">
              <div>
                <h2 className="text-body-lg font-bold text-on-surface">
                  Đánh giá sản phẩm
                </h2>
                <p className="text-[13px] font-bold text-primary mt-1">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full hover:bg-surface-variant/70 flex items-center justify-center transition-colors text-on-surface-variant"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 overflow-y-auto custom-scrollbar"
            >
              {/* Rating Component */}
              <div className="text-center">
                <p className="font-bold text-on-surface mb-3 text-[15px]">
                  Chất lượng sản phẩm <span className="text-error">*</span>
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 active:scale-95 p-1"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={40}
                        className={`transition-colors ${(hoverRating || rating) >= star ? "fill-primary text-primary" : "text-outline-variant"}`}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-2">
                  Tiêu đề đánh giá (Tùy chọn)
                </label>
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 text-body-md focus:ring-2 focus:ring-primary/40 focus:border-primary-fixed-dim outline-none transition-all placeholder-outline-variant"
                  placeholder="Tóm tắt ngắn gọn trải nghiệm của bạn"
                  type="text"
                />
              </div>

              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-2">
                  Nhận xét chi tiết (Tùy chọn)
                </label>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 text-body-md focus:ring-2 focus:ring-primary/40 focus:border-primary-fixed-dim outline-none transition-all resize-none placeholder-outline-variant"
                  placeholder="Chia sẻ thêm về hiệu năng, thiết kế hoặc dịch vụ giao hàng..."
                  rows={4}
                ></textarea>
              </div>

              <div className="bg-secondary-fixed/50 p-4 rounded-xl flex gap-3 items-start border border-secondary-fixed-dim/30">
                <Info className="text-secondary shrink-0 mt-0.5" size={18} />
                <p className="text-[12px] font-medium text-on-surface-variant leading-relaxed">
                  Lưu ý: Mỗi khách hàng chỉ có thể đánh giá một lần cho mỗi sản
                  phẩm đã mua.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-full font-bold text-[15px] shadow-sm hover:bg-secondary transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi đánh giá"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
