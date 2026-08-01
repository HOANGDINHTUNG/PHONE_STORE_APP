import React from "react";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { Checkbox } from "antd";

type ShippingStepProps = {
  onNext: () => void;
};

const ShippingStep = ({ onNext }: ShippingStepProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Nhập thông tin
        </h1>

        <div className="space-y-6">
          {/* Contact Info */}
          <section className="bg-white rounded-2xl border border-[#FAFAFA] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] ring-1 ring-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Thông tin liên hệ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  defaultValue="Nguyễn Văn A"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  defaultValue="0901234567"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (Tuỳ chọn)
                </label>
                <input
                  type="email"
                  defaultValue="nguyenvana@example.com"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors text-gray-500"
                />
              </div>
            </div>
          </section>

          {/* Receiving Info */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-bold text-gray-900">
              Thông tin nhận hàng
            </h2>
            <Checkbox
              checked
              className="text-[#E91E63] font-semibold text-sm custom-pink-checkbox"
            >
              Giống thông tin liên hệ
            </Checkbox>
          </section>

          {/* Shipping Address */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Địa chỉ giao hàng
              </h2>
              <button className="text-[#E91E63] text-sm font-bold border-b border-[#E91E63] pb-0.5 hover:text-[#C2185B] hover:border-[#C2185B]">
                Sổ địa chỉ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tỉnh/Thành phố *
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm appearance-none focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors">
                    <option>Hồ Chí Minh</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quận/Huyện *
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm appearance-none focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors">
                    <option>Quận 1</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phường/Xã *
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm appearance-none focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors">
                    <option>Phường Bến Nghé</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số nhà, tên đường *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 123 Lê Lợi"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors text-gray-50"
                defaultValue=""
              />
            </div>

            <div className="space-y-3">
              <Checkbox
                checked
                className="text-gray-700 text-sm font-semibold flex items-center gap-2 custom-pink-checkbox"
              >
                Lưu địa chỉ này cho lần sau
              </Checkbox>
              <Checkbox className="text-gray-700 text-sm font-semibold flex items-center gap-2 custom-pink-checkbox">
                Đặt làm địa chỉ mặc định
              </Checkbox>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              Ghi chú đơn hàng
            </h2>
            <textarea
              placeholder="Ghi chú về thời gian giao hàng, hướng dẫn tìm nhà... (Tuỳ chọn)"
              className="w-full h-24 p-4 rounded-xl border border-gray-200 bg-[#FAFAFA] text-sm focus:outline-none focus:border-[#E91E63] focus:bg-white transition-colors resize-none placeholder-gray-400"
            ></textarea>
          </section>
        </div>
      </div>

      <OrderSummarySidebar
        buttonText="Tiếp tục đến thanh toán"
        onNext={onNext}
      />
    </div>
  );
};

export default ShippingStep;
