import { Check, Headphones, MapPin, MessageCircle } from "lucide-react";
import { AccountShell } from "../components/AccountShell";

export function OrderTrackingPage() {
  return (
    <AccountShell
      title="Theo dõi đơn hàng | PinkPhone"
      description="Quản lý quá trình giao nhận sản phẩm"
    >
      <div className="flex-grow space-y-6">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-md text-2xl font-semibold text-on-surface mb-1">
              Đơn hàng #PP-99238
            </h1>
            <p className="text-on-surface-variant font-body-md text-base">
              Sẵn sàng giao tới bạn vào ngày mai
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-label-sm text-sm font-semibold text-on-surface-variant block">
                Đơn vị vận chuyển
              </span>
              <span className="font-bold text-secondary">
                Giao Hàng Nhanh (GHN)
              </span>
            </div>
            <div className="w-px h-10 bg-outline-variant"></div>
            <div className="text-right">
              <span className="font-label-sm text-sm font-semibold text-on-surface-variant block">
                Mã vận đơn
              </span>
              <span className="font-bold text-primary">#GHN123456789</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Shipping Timeline */}
          <div className="col-span-12 lg:col-span-8 bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-md text-2xl font-semibold text-on-surface">
                Hành trình đơn hàng
              </h2>
              <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed rounded-full font-bold text-sm">
                Đang vận chuyển
              </span>
            </div>
            <div className="space-y-0 relative">
              {/* Vertical line connecting the dots */}
              <div className="absolute left-[11px] top-6 bottom-8 w-[2px] bg-outline-variant"></div>

              {/* Timeline Items */}
              <div className="relative pb-8 flex gap-4">
                <div className="relative z-10 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-primary ring-4 ring-primary-fixed flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="flex-grow pt-[2px]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-on-surface text-lg">
                      Dự kiến giao hàng
                    </h4>
                    <span className="text-primary font-bold">
                      14:00 - 18:00, 24/10
                    </span>
                  </div>
                  <p className="text-on-surface-variant font-body-md text-base mt-1">
                    Shipper đang trên đường giao đến bạn.
                  </p>
                </div>
              </div>

              <div className="relative pb-8 flex gap-4">
                <div className="relative z-10 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-grow pt-[2px]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-on-surface text-base">
                      Đã đến kho phân loại HCM - Tân Bình
                    </h4>
                    <span className="text-on-surface-variant text-sm font-semibold">
                      08:45, 23/10
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-semibold mt-1">
                    Đơn hàng đã được nhập kho và đang chờ phân tuyến.
                  </p>
                </div>
              </div>

              <div className="relative pb-8 flex gap-4 opacity-70">
                <div className="relative z-10 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-grow pt-[2px]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-on-surface text-base">
                      Đang vận chuyển liên tỉnh
                    </h4>
                    <span className="text-on-surface-variant text-sm font-semibold">
                      22:30, 22/10
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-semibold mt-1">
                    Rời kho tổng Hà Nội, đang hướng về TP. Hồ Chí Minh.
                  </p>
                </div>
              </div>

              <div className="relative pb-0 flex gap-4 opacity-70">
                <div className="relative z-10 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-grow pt-[2px]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-on-surface text-base">
                      PinkPhone đã đóng gói
                    </h4>
                    <span className="text-on-surface-variant text-sm font-semibold">
                      15:20, 22/10
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm font-semibold mt-1">
                    Kiểm tra kỹ thuật và đóng gói chống sốc hoàn tất.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Bento Cards */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Receiver Info */}
            <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={24} className="text-primary" />
                <h3 className="font-bold text-on-surface">
                  Thông tin người nhận
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Họ và tên
                  </p>
                  <p className="font-medium text-on-surface">Nguyễn Minh Anh</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Số điện thoại
                  </p>
                  <p className="font-medium text-on-surface">090 * * * 1234</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Địa chỉ giao hàng
                  </p>
                  <p className="font-medium text-on-surface leading-tight mt-1">
                    123 Đường Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí
                    Minh
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white/80 backdrop-blur-xl border border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] rounded-xl overflow-hidden h-48 relative group">
              <div className="absolute inset-0 bg-surface-container-high flex flex-col items-center justify-center text-center">
                <div
                  className="w-full h-full bg-cover bg-center"
                  title="Ho Chi Minh City"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXNuVpa0MnNd2cVRhdBneHQj02VxblxV825rp_4O8cw9UWyheZQwWz6VlNaOy3HLqLY3Huo2pAxEbuF9Z60FzyqevwOuuScTB5iNx0Ti05MPTk8dIlnesxO7IqsGYaEXd25AYxl4z0VdYhJ-oaN8I5GI3UT7o4YQOlzytDCyiujJbCWGusDs4cP6GI6HD4SpNn_4UH0g0mJAItu8QUCTGqy1LGgf_f5Nhs_WKnxtWsZm1QSwqvKrL9')",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all pointer-events-none">
                  <button className="bg-white/90 backdrop-blur text-primary font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all">
                    Xem bản đồ trực tiếp
                  </button>
                </div>
              </div>
            </div>

            {/* Support Action */}
            <div className="bg-primary-container rounded-xl p-6 text-on-primary-container shadow-lg">
              <h3 className="font-bold mb-2">Cần giúp đỡ với đơn hàng?</h3>
              <p className="text-sm mb-4 opacity-90 leading-tight">
                Đội ngũ hỗ trợ của PinkPhone luôn sẵn sàng giải đáp thắc mắc của
                bạn 24/7.
              </p>
              <div className="space-y-2">
                <button className="w-full bg-white text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all active:scale-95">
                  <Headphones size={20} /> Liên hệ hỗ trợ ngay
                </button>
                <button className="w-full bg-primary-fixed-dim/20 border border-white/30 text-white font-medium py-2 rounded-lg hover:bg-primary-fixed-dim/30 transition-all active:scale-95">
                  Gửi khiếu nại đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB for quick contact (Mobile) */}
      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all group">
          <MessageCircle size={28} />
        </button>
      </div>
    </AccountShell>
  );
}
