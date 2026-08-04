import React from "react";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { Tag, X, AlertCircle } from "lucide-react";
import { Radio } from "antd";
import { CheckoutData } from "./index";

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

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Nhập mã giảm giá..."
              className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors"
            />
            <button className="h-11 px-6 rounded-xl bg-[#C2185B] text-white font-bold text-sm hover:bg-[#AD1457] transition-colors whitespace-nowrap">
              Áp dụng
            </button>
          </div>
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
