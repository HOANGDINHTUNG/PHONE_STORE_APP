import React from "react";
import { PhoneStripImage } from "../../../features/storefront/components/PhoneStripImage";

type OrderSummarySidebarProps = {
  buttonText: string;
  onNext: () => void;
};

const mockItems = [
  {
    id: 1,
    name: "PinkPhone Pro Max 256GB - Titanium Pink",
    price: 24_990_000,
    qty: 1,
    imageIndex: 4,
  },
  {
    id: 2,
    name: "PinkPods Pro Thế hệ 2",
    price: 4_590_000,
    qty: 1,
    imageIndex: 2,
  },
];

export const OrderSummarySidebar = ({
  buttonText,
  onNext,
}: OrderSummarySidebarProps) => {
  const subtotal = 29_580_000;
  const discount = 500_000;
  const total = 29_080_000;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Đơn hàng của bạn
        </h2>

        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
          {mockItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden relative">
                <PhoneStripImage index={item.imageIndex} />
              </div>
              <div className="flex-1 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                    {item.name}
                  </h3>
                  <span className="font-bold text-[#E91E63] shrink-0">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">Số lượng: {item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#E91E63]">Giảm giá</span>
            <span className="font-semibold text-[#E91E63]">
              -{formatCurrency(discount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span className="font-semibold text-gray-900">Miễn phí</span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6 pt-6 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-[#E91E63]">
              {new Intl.NumberFormat("vi-VN").format(total)}
            </span>
            <span className="text-2xl font-bold text-[#E91E63] border-b-2 border-[#E91E63] ml-1 pb-0.5">
              đ
            </span>
          </div>
        </div>

        <button
          className="w-full bg-[#C2185B] text-white py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#AD1457] transition-colors"
          onClick={onNext}
        >
          {buttonText}
        </button>
      </div>
    </aside>
  );
};
