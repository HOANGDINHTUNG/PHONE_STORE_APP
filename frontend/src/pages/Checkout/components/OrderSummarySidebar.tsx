import React from "react";
import { PhoneStripImage } from "../../../features/storefront/components/PhoneStripImage";
import { useStore } from "../../../context/StoreContext";
import { StockBadge } from "../../../components/common/StockBadge";
import { resolveProductStock } from "../../../utils/stock";
import { getCheckoutCartItems } from "../../../utils/checkoutSelection";

type OrderSummarySidebarProps = {
  buttonText: string;
  onNext: () => void;
  disabled?: boolean;
};

export const OrderSummarySidebar = ({
  buttonText,
  onNext,
  disabled = false,
}: OrderSummarySidebarProps) => {
  const { cart, appliedVoucher } = useStore();
  const checkoutCart = getCheckoutCartItems(cart);

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

  let discount = 0;
  if (
    appliedVoucher &&
    (!appliedVoucher.minimumOrderValue ||
      subtotal >= appliedVoucher.minimumOrderValue)
  ) {
    if (appliedVoucher.type === "PERCENT") {
      discount = (subtotal * appliedVoucher.discountValue) / 100;
      if (
        appliedVoucher.maximumDiscountAmount &&
        discount > appliedVoucher.maximumDiscountAmount
      ) {
        discount = appliedVoucher.maximumDiscountAmount;
      }
    } else {
      discount = appliedVoucher.discountValue;
    }
  }
  discount = Math.min(discount, subtotal);

  const total = subtotal - discount;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Đơn hàng của bạn
        </h2>

        <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 max-h-[300px] overflow-y-auto">
          {checkoutCart.map((item, idx) => {
            const stock = resolveProductStock(item);
            const oos = stock <= 0 || !!item.outOfStock;
            const overStock = !oos && stock > 0 && item.quantity > stock;
            return (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`max-h-full max-w-full object-contain p-1 ${oos ? "opacity-50 grayscale" : ""}`}
                    />
                  ) : (
                    <PhoneStripImage index={idx % 5} />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <span className="font-bold text-[#E91E63] shrink-0">
                      {item.newPrice || formatCurrency(getPriceNum(item.price))}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                  <div className="mt-1.5">
                    <StockBadge stock={stock} outOfStock={oos} variant="inline" />
                  </div>
                  {overStock && (
                    <p className="text-[11px] font-semibold text-amber-700 mt-1">
                      Vượt tồn kho (còn {stock}) — vui lòng giảm số lượng
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính ({checkoutCart.length} SP)</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-[#E91E63]">
                Giảm giá {appliedVoucher && `(${appliedVoucher.code})`}
              </span>
              <span className="font-semibold text-[#E91E63]">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}
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
          disabled={disabled || checkoutCart.length === 0}
          className={`w-full text-white py-3.5 rounded-xl font-bold text-[15px] transition-colors ${
            disabled || checkoutCart.length === 0
              ? "bg-gray-300 cursor-not-allowed border border-gray-300"
              : "bg-[#C2185B] hover:bg-[#AD1457] shadow-sm"
          }`}
          onClick={onNext}
        >
          {buttonText}
        </button>
      </div>
    </aside>
  );
};
