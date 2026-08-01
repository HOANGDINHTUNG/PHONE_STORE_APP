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
import { checkoutApi } from "../../api/orderService";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

type ConfirmationStepProps = {
  onBack: () => void;
};

const ConfirmationStep = ({ onBack }: ConfirmationStepProps) => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const subtotal = cart.reduce((sum, item) => {
    // try use newPrice if it's string or number, parse if necessary. Assuming price is a string like "25.000.0s000đ" in mock, wait, earlier productService returns `newPrice` as string "28.490.000đ". Let's clean it up for math.
    const priceNum =
      typeof item.newPrice === "string"
        ? parseInt(item.newPrice.replace(/\D/g, "")) || 0
        : item.price || 0; // fallback
    return sum + priceNum * item.quantity;
  }, 0);

  const discount = subtotal > 20000000 ? 500000 : 0;
  const total = subtotal - discount;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const handlePlaceOrder = async () => {
    setLoading(true);
    const success = await checkoutApi({
      items: cart.map((c) => ({ productId: c.id, quantity: c.quantity })),
      totalAmount: total,
    });
    setLoading(false);

    if (success) {
      clearCart();
      message.success("Đặt hàng thành công!");
      navigate("/");
    } else {
      message.error("Lỗi đặt hàng, vui lòng thử lại.");
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
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-200 cursor-default flex items-center gap-2">
                <User size={18} className="text-[#E91E63]" /> Thông tin liên hệ
                & Nhận hàng
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
                  Người gửi
                </p>
                <p className="text-sm text-gray-900">Nguyễn Văn A</p>
                <p className="text-sm text-gray-900">0901234567</p>
                <p className="text-sm text-gray-900">nguyenvana@email.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold mb-1">
                  Người nhận
                </p>
                <p className="text-sm text-gray-900">Trần Thị B</p>
                <p className="text-sm text-gray-900">0987654321</p>
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
              123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
            </p>
          </section>

          {/* Note Card */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlignLeft size={18} className="text-[#E91E63]" /> Ghi chú
              </h2>
            </div>
            <p className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-3">
              "Giao hàng giờ hành chính. Xin vui lòng gọi trước 30 phút."
            </p>
          </section>

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
              <div className="w-8 flex justify-center font-bold bg-blue-50 text-blue-600 rounded text-[10px] h-6 items-center px-1 border border-blue-100">
                VN
              </div>
              <span className="text-sm text-gray-800">
                Thanh toán qua VNPAY
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
                      <p className="text-xs text-[#E91E63] mt-1.5 flex items-center gap-1 font-medium">
                        <ShieldCheck size={14} /> Bảo hành chính hãng
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-3 text-sm">
                      <span className="text-gray-600 font-semibold">
                        SL: {item.quantity}
                      </span>
                      <span className="font-extrabold text-gray-900">
                        {item.newPrice || formatCurrency(item.price as number)}
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
                Tạm tính (2 sản phẩm)
              </span>
              <span className="text-gray-900 font-medium">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E91E63] font-medium">
                Giảm giá (Mã: PINKNEW)
              </span>
              <span className="text-[#E91E63] font-semibold">
                -{formatCurrency(discount)}
              </span>
            </div>
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
              <p className="text-[11px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                (Đã bao gồm VAT)
              </p>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-[#C2185B] text-white py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#AD1457] disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4 px-2 leading-relaxed font-medium">
            Bằng cách nhấn Đặt hàng, bạn đồng ý với các{" "}
            <a
              href="#"
              className="text-[#E91E63] hover:underline cursor-pointer decoration-[#E91E63]"
            >
              điều khoản của PinkPhone
            </a>
            .
          </p>
        </div>
      </aside>
    </div>
  );
};

export default ConfirmationStep;
