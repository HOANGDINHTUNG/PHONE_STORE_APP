import { AccountShell } from "../components/AccountShell";
import { useState } from "react";
import { X, Star, Info, Loader2, ShoppingBag, Edit, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface PendingReviewItem {
  id: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock pending reviews
  const pendingReviews: PendingReviewItem[] = [
    {
      id: "#PKP-882941",
      name: "PinkPhone 15 Pro Max",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAvo-d0SWq2bHilgAtF8u_rHorsGUtfYHvITKUrdnUOpKEdhaKGPSiP3CjkF5iQ3GTGkND1bXCOH2cN8pAuk6QiFkH58Piqwvi6nP4PIrjXT3BaqzcVkQ4Qi_bZbd0IkcjQ1eqKKMOeiI9MJNADLKr67KRoBGY0x3mmDHRnoSLzl77Bg583900iHGBVic3XFvgD4qtkUlzceVUH70u0BpPQBoNJ1_i28ESPAUM-Aqq3k4y8tnbJ0ptA",
      attributes: "Màu sắc: Rose Gold | Dung lượng: 512GB",
      purchaseDate: "15/10/2023",
    },
    {
      id: "#PKP-901235",
      name: "PinkPods Max - Noise Canceling",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrgtstTwRD9hw5CxygBQukSzs79oyb5koB9VB-GAsKgL5FY2tiiWZuS1ypkoY6Ix-e1jywXO00aLrjTo3_7AOHafSdaQEEIFBUGAvOGXKl22o1wmsQb8vIHbV5yJwvvdiYXSdPTrTvzymETxr8ljM5j3mQOL5B9XVJhyohebmOLSAPGTb6Gn1U8ueh6F7NJwDR9cih8ZnalcFnNf6aEvEIlQEeQz2cpiYTIBIzZ7tU1qC-ijJT2hBX",
      attributes: "Màu sắc: Sakura Pink",
      purchaseDate: "02/11/2023",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Vui lòng chọn mức đánh giá sao.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Cảm ơn bạn đã gửi đánh giá!");
      closeModal();
    }, 1500);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setRating(0);
    setHoverRating(0);
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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
              <div className="w-24 h-24 bg-secondary-fixed rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="text-secondary" size={48} />
              </div>
              <h2 className="text-headline-md font-bold mb-2 text-on-surface">
                Bạn đã đánh giá hết sản phẩm!
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-sm mb-8">
                Cảm ơn bạn đã đóng góp ý kiến. Hãy tiếp tục mua sắm để nhận thêm
                nhiều ưu đãi đặc biệt.
              </p>
              <button className="bg-primary text-white px-10 py-3.5 rounded-full font-bold hover:bg-secondary transition-all active:scale-95 shadow-sm">
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>
      </AccountShell>

      {/* Review Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-on-background/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={closeModal}
          ></div>

          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-[slideUp_0.3s_ease-out]">
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
