import { XOctagon } from "lucide-react";
import { Link } from "react-router-dom";

export function OrderFailedView({
  transactionId,
  amount,
  errorCode,
}: {
  transactionId: string;
  amount: string;
  errorCode: string;
}) {
  return (
    <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(214,51,108,0.08)] p-8 md:p-12 text-center border border-border">
      {/* Status Icon */}
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-container text-error">
        <XOctagon size={40} />
      </div>

      {/* Headline */}
      <h1 className="text-2xl font-bold text-on-surface mb-4">
        Thanh toán chưa hoàn tất
      </h1>

      {/* Subtext */}
      <p className="text-base text-on-surface-variant mb-8 max-w-md mx-auto font-medium">
        Đã có lỗi xảy ra trong quá trình xử lý thanh toán VNPay hoặc giao dịch
        đã bị hủy. (Mã lỗi: {errorCode})
      </p>

      {/* Order Brief Card */}
      <div className="bg-surface-container-low rounded-lg p-6 mb-8 text-left max-w-md mx-auto border border-outline-variant">
        <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-4">
          <span className="text-base font-medium text-on-surface-variant">
            Mã giao dịch (TxnRef)
          </span>
          <span className="text-base font-bold text-on-surface">
            {transactionId || "Không xác định"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-on-surface-variant">
            Tổng tiền
          </span>
          <span className="text-2xl font-bold text-primary">
            {amount || "Chưa xác thực"}
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/cart"
          className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-bold hover:bg-secondary active:scale-95 transition-all duration-200 shadow-sm"
        >
          Thanh toán lại
        </Link>
        <button className="w-full sm:w-auto bg-surface text-primary border border-outline-variant px-8 py-3 rounded-lg text-sm font-bold hover:bg-surface-container-low active:scale-95 transition-all duration-200">
          Liên hệ hỗ trợ
        </button>
      </div>

      <div className="mt-6">
        <Link
          to="/"
          className="text-on-surface-variant hover:text-primary text-sm font-bold underline underline-offset-4 transition-colors"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    </div>
  );
}
