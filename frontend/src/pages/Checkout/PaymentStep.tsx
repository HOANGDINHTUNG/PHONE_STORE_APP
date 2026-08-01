import React from "react";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { Tag, X, Check, AlertCircle } from "lucide-react";
import { Radio } from "antd";

type PaymentStepProps = {
  onNext: () => void;
  onBack: () => void;
};

const PaymentStep = ({ onNext, onBack }: PaymentStepProps) => {
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

          <div className="bg-[#FFF5F7] border border-[#FFE4EB] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#E91E63]" />
                <span className="font-bold text-[#E91E63]">PINKPHONE2024</span>
                <span className="font-bold text-[#E91E63]">-500.000đ</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Giảm 10% cho đơn hàng từ 20 triệu, tối đa 500.000đ
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Mã không tồn tại",
              "Hết lượt sử dụng",
              "Chưa đến thời gian áp dụng",
              "Đơn hàng không đủ điều kiện tối thiểu",
            ].map((err) => (
              <div
                key={err}
                className="flex items-center gap-2 text-sm text-[#D32F2F]"
              >
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Phương thức thanh toán
          </h2>

          <Radio.Group
            defaultValue="cod"
            className="w-full flex flex-col gap-3 custom-pink-radio-group"
          >
            <label className="flex items-center gap-4 p-4 rounded-xl border border-[#E91E63] bg-[#FFF5F7] cursor-pointer">
              <Radio
                value="cod"
                className="text-[#E91E63] custom-pink-radio"
              ></Radio>
              <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center text-gray-500">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 11h14v8H5v-8z M19 11v-4l-3-3H8L5 7v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8"
                      cy="19"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="16"
                      cy="19"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 text-[15px]">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition-colors">
              <Radio value="bank" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 flex justify-center text-gray-500">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v4 M12 14v4 M16 14v4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 text-[15px]">
                  Chuyển khoản ngân hàng
                </span>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition-colors">
              <Radio value="momo" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 flex justify-center text-gray-500 font-bold bg-pink-100 text-pink-600 rounded text-[10px] h-6 items-center">
                  Mo
                </div>
                <span className="font-semibold text-gray-700 text-[15px]">
                  Ví MoMo
                </span>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition-colors">
              <Radio value="vnpay" className="custom-pink-radio"></Radio>
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 flex justify-center text-gray-500 font-bold bg-blue-100 text-blue-600 rounded text-[10px] h-6 items-center">
                  VN
                </div>
                <span className="font-semibold text-gray-700 text-[15px]">
                  Cổng thanh toán VNPay
                </span>
              </div>
            </label>
          </Radio.Group>
        </section>
      </div>

      <OrderSummarySidebar buttonText="Xem lại đơn hàng" onNext={onNext} />
    </div>
  );
};

export default PaymentStep;
