import {
  CheckCircle2,
  CreditCard,
  Headphones,
  Home,
  MapPin,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { AccountShell } from "../components/AccountShell";

export function OrderDetailPage() {
  return (
    <AccountShell
      title="Chi tiết đơn hàng #PP123"
      description="Xem trạng thái và thông tin chi tiết đơn hàng của bạn."
    >
      <section className="flex-1 space-y-6">
        {/* Order Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-headline-md text-2xl text-on-background">
                Mã đơn #PP123
              </h1>
              <span className="bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-2 py-1 rounded-full uppercase">
                Đang giao
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant">
              Ngày đặt: 15/10/2023 14:30
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-lg font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
              <Headphones size={18} /> Hỗ trợ
            </button>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:bg-secondary transition-all flex items-center gap-2 shadow-md">
              <Truck size={18} /> Theo dõi đơn
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant/30 overflow-x-auto no-scrollbar">
          <div className="min-w-[500px]">
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-highest z-0"></div>
              <div className="absolute top-5 left-0 w-2/3 h-[2px] bg-primary z-0"></div>
              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-label-sm text-primary">Đặt hàng</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-label-sm text-primary">Xác nhận</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-4 ring-primary-fixed">
                  <Truck size={20} />
                </div>
                <span className="font-label-sm text-primary font-bold">
                  Đang giao
                </span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                  <Home size={20} />
                </div>
                <span className="font-label-sm text-on-surface-variant">
                  Đã giao
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid: Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-lg mb-4 flex items-center gap-2">
              <MapPin size={22} className="text-primary" /> Thông tin nhận hàng
            </h3>
            <div className="space-y-2">
              <p className="font-bold text-on-background">Nguyễn Văn A</p>
              <p className="font-body-md text-on-surface-variant">
                090 123 4567
              </p>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                123 Đường Lê Lợi, Phường Bến Thành,
                <br />
                Quận 1, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-lg mb-4 flex items-center gap-2">
              <CreditCard size={22} className="text-primary" /> Thanh toán &amp;
              Giao hàng
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Phương thức:</span>
                <span className="font-medium">Thẻ tín dụng (VISA)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Trạng thái:</span>
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-green-600" /> Đã thanh
                  toán
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">
                  Đơn vị vận chuyển:
                </span>
                <span className="font-medium">PinkExpress Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30">
            <h3 className="font-headline-md text-lg">Sản phẩm trong đơn</h3>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {/* Item 1 */}
            <div className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-32 bg-surface-container-low rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  className="w-24 h-24 object-contain"
                  alt="iPhone 15 Pro Max 256GB - Pink Edition"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxP4dATdSNvSBjrmrlCabx-4jMNz7sTBgjYzAPJ5V8THrFaJw8_SOuTrdwqt0s3ps5pqeyf7v781mQfL3zqjNRXk9tcVkfTreuA6XWexckkhmHjx5_uyiLH8ueHU7vYR3PJgb-JkhYhlvntp68ZNO_yJTX5NXfES8oxdRquDlqZCjVxr-Yun-4FnVTr4eHn0IcPbHlBF2RON5PuMPipmuQLDe5CbV3bcdb13F2_Lilz2KEyfyPhi4N"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-lg text-on-background">
                      iPhone 15 Pro Max 256GB - Pink Edition
                    </h4>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Màu sắc: Titan Hồng | Bảo hành 24 tháng
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-xl">
                      29.990.000₫
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Số lượng: 01
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-32 bg-surface-container-low rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  className="w-24 h-24 object-contain"
                  alt="Samsung Galaxy Z Flip5 Pink Sapphire"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXH7YiBT-PwkZYSM_kU7x9uVHqXJOswvfHkZOAJCXvl5wm1zFPLvuVY6qYVj13XOJ0M9XVzTFDWbEefeW49gzNE55wz8OH8CUaXchJv6xUo0a4s7VBpH1_X7nGHcTZTIWUO1Jm7ueZDZiY9HORG5MIE2ec5EBBvrJquFqx4Rc5v8r_lg71q-H9QOwnrp6_HkSfDYvYR5RBZup5tGguJGgTUcbrEKlQfdloLpSa7FCzh2D_VxJWotCm"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-lg text-on-background">
                      Samsung Galaxy Z Flip5 Pink Sapphire
                    </h4>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Màu sắc: Hồng Sapphire | Tặng kèm ốp lưng
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-xl">
                      18.500.000₫
                    </p>
                    <p className="text-on-surface-variant text-sm">
                      Số lượng: 01
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table & Bottom Actions */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Tạm tính (2 sản phẩm)</span>
              <span>48.490.000₫</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Giảm giá khuyến mãi</span>
              <span className="text-error font-medium">-2.500.000₫</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="border-t border-outline-variant/30 my-2 pt-4 flex justify-between items-center">
              <span className="font-headline-md text-xl">Tổng thanh toán</span>
              <span className="font-headline-md text-2xl text-primary font-black">
                45.990.000₫
              </span>
            </div>
          </div>
          <div className="md:w-64 flex flex-col gap-3">
            <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-black text-lg shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              MUA LẠI ĐƠN NÀY
            </button>
            <button className="w-full py-3 bg-white text-on-surface border-2 border-outline-variant rounded-xl font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 active:scale-95">
              <X size={18} /> Hủy đơn hàng
            </button>
            <p className="text-[10px] text-center text-on-surface-variant px-4">
              Lưu ý: Chỉ có thể hủy đơn khi đơn hàng chưa vào trạng thái "Đang
              giao".
            </p>
          </div>
        </div>
      </section>
    </AccountShell>
  );
}
