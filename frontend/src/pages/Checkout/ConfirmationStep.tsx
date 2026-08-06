import React from "react";
import {
  User,
  MapPin,
  AlignLeft,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { PhoneStripImage } from "../../features/storefront/components/PhoneStripImage";
import { useStore } from "../../context/StoreContext";
import { checkoutApi, createPaymentAttemptApi } from "../../api/orderService";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { CheckoutData } from "./index";

type ConfirmationStepProps = {
  onBack: () => void;
  checkoutData: CheckoutData;
};

const ConfirmationStep = ({ onBack, checkoutData }: ConfirmationStepProps) => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const getPriceNum = (val?: string | number): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseInt(val.replace(/\D/g, "")) || 0;
    return 0;
  };

  const subtotal = cart.reduce((sum, item) => {
    const priceNum = item.newPrice
      ? getPriceNum(item.newPrice)
      : getPriceNum(item.price);
    return sum + priceNum * item.quantity;
  }, 0);

  const discount = subtotal > 20000000 ? 500000 : 0;
  const total = subtotal - discount;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderIdempotencyKey = crypto.randomUUID();

      const orderResponse = await checkoutApi({
        idempotencyKey: orderIdempotencyKey,
        guestName: checkoutData.guestName,
        guestPhone: checkoutData.guestPhone,
        guestEmail: checkoutData.guestEmail,
        guestProvinceCode: checkoutData.guestProvinceCode,
        guestProvinceName:
          checkoutData.guestProvinceName || checkoutData.guestProvinceCode,
        guestDistrictCode: checkoutData.guestDistrictCode,
        guestDistrictName:
          checkoutData.guestDistrictName || checkoutData.guestDistrictCode,
        guestWardCode: checkoutData.guestWardCode,
        guestWardName: checkoutData.guestWardName || checkoutData.guestWardCode,
        guestDetailAddress: checkoutData.guestDetailAddress,
        note: checkoutData.note,
        items: cart.map((item) => {
          const selectedStorageGb = Number(item.selectedStorage?.replace(/[^\d]/g, ""));
          const selectedVariant = item.variants?.find(
            (variant) =>
              (!selectedStorageGb || variant.storageGb === selectedStorageGb) &&
              (!item.selectedColor || variant.color === item.selectedColor),
          );

          return {
            // Older cart entries may still contain a product ID. Prefer the
            // matching variant ID, because the checkout API accepts variants only.
            productVariantId:
              selectedVariant?.id || item.variants?.[0]?.id || item.id.toString(),
            quantity: item.quantity,
          };
        }),
      });

      if (!orderResponse || !orderResponse.orderCode) {
        throw new Error("Tạo đơn hàng thất bại, thiếu mã đơn hàng.");
      }

      const paymentIdempotencyKey = crypto.randomUUID();
      const paymentAttempt = await createPaymentAttemptApi(
        orderResponse.orderCode,
        paymentIdempotencyKey,
        {
          method: checkoutData.paymentMethod,
        },
      );

      if (!paymentAttempt) {
        message.warning(
          "Tạo đơn hàng thành công nhưng khởi tạo thanh toán thất bại.",
        );
      } else {
        clearCart();
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
        if (
          checkoutData.paymentMethod === "VNPAY" &&
          paymentAttempt.redirectUrl
        ) {
          window.location.href = paymentAttempt.redirectUrl;
          return;
        } else {
          message.success("Đặt hàng thành công!");
          navigate("/");
        }
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Lỗi đặt hàng, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Kiểm tra & Xác nhận
        </h1>

        <div className="space-y-6">
          {/* Contact Info Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-[#E91E63]" /> Thông tin liên hệ
              </h2>
              <button
                onClick={onBack}
                className="text-sm font-bold text-[#E91E63] hover:underline cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">
                  Người nhận
                </p>
                <p className="text-sm text-gray-900">
                  {checkoutData.guestName}
                </p>
                <p className="text-sm text-gray-900">
                  {checkoutData.guestPhone}
                </p>
                {checkoutData.guestEmail && (
                  <p className="text-sm text-gray-900">
                    {checkoutData.guestEmail}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Address Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#E91E63]" /> Địa chỉ giao
                hàng
              </h2>
              <button
                onClick={onBack}
                className="text-sm font-bold text-[#E91E63] hover:underline cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </div>
            <p className="text-sm text-gray-900">
              {checkoutData.guestDetailAddress}, {checkoutData.guestWardCode},{" "}
              {checkoutData.guestDistrictCode}, {checkoutData.guestProvinceCode}
            </p>
          </section>

          {/* Note Card */}
          {checkoutData.note && (
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlignLeft size={18} className="text-[#E91E63]" /> Ghi chú
                </h2>
              </div>
              <p className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-3">
                "{checkoutData.note}"
              </p>
            </section>
          )}

          {/* Payment Method Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-[#E91E63]" /> Phương thức
                thanh toán
              </h2>
              <button
                onClick={onBack}
                className="text-sm font-bold text-[#E91E63] hover:underline cursor-pointer"
              >
                Thay đổi
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-bold text-gray-800">
                {checkoutData.paymentMethod}
              </span>
            </div>
          </section>

          {/* Product List Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#E91E63]" /> Danh sách
                sản phẩm
              </h2>
            </div>
            <div className="space-y-0 divide-y divide-gray-100 border-t border-gray-100 pt-2">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="py-6 first:pt-4 last:pb-2 flex gap-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <PhoneStripImage index={idx % 5} />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Màu sắc: {item.selectedColor || "Mặc định"} | Lưu trữ:{" "}
                        {item.selectedStorage || "Mặc định"}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-3 text-sm">
                      <span className="text-gray-600 font-semibold">
                        SL: {item.quantity}
                      </span>
                      <span className="font-extrabold text-gray-900">
                        {item.newPrice ||
                          formatCurrency(getPriceNum(item.price))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Order Summary Sidebar */}
      <aside className="w-full lg:w-[380px] shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Tổng quan đơn hàng
          </h2>

          <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                Tạm tính ({cart.length} sản phẩm)
              </span>
              <span className="text-gray-900 font-medium">
                {formatCurrency(subtotal)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#E91E63] font-medium">Giảm giá</span>
                <span className="text-[#E91E63] font-semibold">
                  -{formatCurrency(discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Phí giao hàng</span>
              <span className="text-gray-900 font-medium">Miễn phí</span>
            </div>
          </div>

          <div className="flex justify-between items-start mb-6">
            <span className="text-lg font-bold text-gray-900 pt-1">
              Tổng cộng
            </span>
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
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-[#C2185B] text-white py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#AD1457] disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ConfirmationStep;
