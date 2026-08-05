import { CheckCircle2, Receipt, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export function OrderSuccessView({
  transactionId,
  amount,
}: {
  transactionId: string;
  amount: string;
}) {
  return (
    <div className="max-w-2xl w-full text-center fade-in">
      {/* Success Icon */}
      <div className="mb-6 m-auto flex justify-center">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center animate-bounce shadow-md">
          <CheckCircle2 size={48} className="text-on-primary-container" />
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-5xl font-bold text-primary mb-2 tracking-tight">
        Đặt hàng thành công!
      </h1>

      {/* Helper Text */}
      <p className="text-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
        Cảm ơn bạn đã tin tưởng PinkPhone. Thông tin đơn hàng đã được gửi vào
        email của bạn.
      </p>

      {/* Order Info Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(214,51,108,0.08)] p-6 mb-10 text-left border border-border">
        <h2 className="text-xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant">
          Thông tin giao dịch
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-on-surface-variant">
              Mã đơn hàng:
            </span>
            <span className="text-base font-bold text-on-surface">
              {transactionId || "#PP-WAITING"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-on-surface-variant">
              Tổng tiền:
            </span>
            <span className="text-2xl font-bold text-primary">{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-on-surface-variant">
              Trạng thái thanh toán:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
              <CheckCircle2 size={16} />
              Đã thanh toán (00)
            </span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/account/orders"
          className="w-full sm:w-auto bg-primary hover:bg-secondary text-on-primary text-sm font-bold py-3 px-6 rounded-lg transition-colors active:scale-95 duration-200 shadow-sm flex items-center justify-center gap-2"
        >
          <Receipt size={20} />
          Xem chi tiết đơn hàng
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto bg-surface text-primary border-2 border-outline-variant hover:border-primary text-sm font-bold py-3 px-6 rounded-lg transition-colors active:scale-95 duration-200 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={20} />
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
