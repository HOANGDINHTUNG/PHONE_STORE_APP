import React, { useEffect, useState } from "react";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { Tag, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Radio } from "antd";
import { CheckoutData } from "./index";
import { useStore } from "../../context/StoreContext";
import { voucherService, Voucher } from "../../api/voucherService";
import { getCheckoutCartItems } from "../../utils/checkoutSelection";

type PaymentStepProps = {
  onNext: () => void;
  onBack: () => void;
  checkoutData: CheckoutData;
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData>>;
  isSubmitting: boolean;
};

const PaymentStep = ({
  onNext,
  onBack,
  checkoutData,
  setCheckoutData,
  isSubmitting,
}: PaymentStepProps) => {
  const { appliedVoucher, applyVoucher, cart } = useStore();
  const checkoutCart = getCheckoutCartItems(cart);
  const [inputCode, setInputCode] = useState(appliedVoucher?.code || "");
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    void voucherService.getPublicVouchers()
      .then(setAvailableVouchers)
      .catch(() => setAvailableVouchers([]));
  }, []);

  const getPriceNum = (val?: string | number): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseInt(val.replace(/\D/g, "")) || 0;
    return 0;
  };

  const subtotal = checkoutCart.reduce((sum, item) => {
    const priceNum = item.newPrice
      ? getPriceNum(item.newPrice)
      : getPriceNum(item.price);
    return sum + priceNum * item.quantity;
  }, 0);

  const handleApplyVoucher = () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) {
      setVoucherError("Vui lòng nhập mã giảm giá");
      return;
    }
    const voucher = availableVouchers.find(
      (item) => item.code.toUpperCase() === trimmed,
    );
    if (!voucher) {
      setVoucherError(
        `Mã giảm giá "${trimmed}" không tồn tại hoặc không hợp lệ`,
      );
      return;
    }
    if (voucher.minimumOrderValue && subtotal < voucher.minimumOrderValue) {
      setVoucherError(
        `Đơn hàng (${subtotal.toLocaleString("vi-VN")}đ) chưa đủ điều kiện tối thiểu ${voucher.minimumOrderValue.toLocaleString("vi-VN")}đ để dùng mã "${trimmed}"`,
      );
      return;
    }

    applyVoucher({
      id: voucher.id,
      code: voucher.code,
      name: voucher.name || voucher.code,
      type: voucher.type === "AMOUNT" ? "FIXED" : "PERCENT",
      discountValue: Number(voucher.discountValue),
      maximumDiscountAmount: voucher.maximumDiscountAmount == null ? undefined : Number(voucher.maximumDiscountAmount),
      minimumOrderValue: voucher.minimumOrderValue == null ? undefined : Number(voucher.minimumOrderValue),
      description: voucher.description || "Ưu đãi đang áp dụng",
    });
    setVoucherError(null);
  };

  const handleRemoveVoucher = () => {
    applyVoucher(null);
    setInputCode("");
    setVoucherError(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Thanh toán
        </h1>

        {/* Voucher Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Mã giảm giá / Voucher
          </h2>

          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Nhập mã giảm giá..."
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setVoucherError(null);
              }}
              disabled={!!appliedVoucher}
              className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm font-semibold focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors disabled:opacity-70 disabled:bg-gray-100 uppercase"
            />
            {appliedVoucher ? (
              <button
                onClick={handleRemoveVoucher}
                className="h-11 px-6 rounded-xl bg-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-300 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <X size={16} /> Bỏ mã
              </button>
            ) : (
              <button
                onClick={handleApplyVoucher}
                className="h-11 px-6 rounded-xl bg-[#C2185B] text-white font-bold text-sm hover:bg-[#AD1457] transition-colors whitespace-nowrap"
              >
                Áp dụng
              </button>
            )}
          </div>

          {voucherError && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span>{voucherError}</span>
            </div>
          )}
          {appliedVoucher && !voucherError && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>Áp dụng thành công mã {appliedVoucher.code}!</span>
            </div>
          )}
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Phương thức thanh toán
          </h2>

          <Radio.Group
            value={checkoutData.paymentMethod}
            onChange={(e) =>
              setCheckoutData((prev) => ({
                ...prev,
                paymentMethod: e.target.value,
              }))
            }
            className="w-full flex flex-col gap-3 custom-pink-radio-group"
          >
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${checkoutData.paymentMethod === "COD" ? "border-[#E91E63] bg-[#FFF5F7]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              <Radio value="COD" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-gray-900 text-[15px]">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${checkoutData.paymentMethod === "BANK_TRANSFER" ? "border-[#E91E63] bg-[#FFF5F7]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              <Radio
                value="BANK_TRANSFER"
                className="custom-pink-radio"
              ></Radio>
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-gray-700 text-[15px]">
                  Chuyển khoản ngân hàng
                </span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${checkoutData.paymentMethod === "MOMO" ? "border-[#E91E63] bg-[#FFF5F7]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              <Radio value="MOMO" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-gray-700 text-[15px]">
                  Ví MoMo (Chưa hỗ trợ)
                </span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${checkoutData.paymentMethod === "VNPAY" ? "border-[#E91E63] bg-[#FFF5F7]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              <Radio value="VNPAY" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <span className="font-semibold text-gray-700 text-[15px]">
                  Cổng thanh toán VNPay (Chưa hỗ trợ)
                </span>
              </div>
            </label>
          </Radio.Group>
        </section>
      </div>

      <OrderSummarySidebar
        buttonText={isSubmitting ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
        onNext={onNext}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default PaymentStep;
