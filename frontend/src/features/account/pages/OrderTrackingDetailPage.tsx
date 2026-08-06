import { useParams, Link } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { Check, MapPin, Headphones, MessageCircle } from "lucide-react";

export function OrderTrackingDetailPage() {
  const { id } = useParams();

  return (
    <AccountShell
      title={`Chi tiết đơn hàng #${id || "PP-99238"}`}
      description="Chi tiết theo dõi từng kiện hàng của bạn."
    >
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(214, 51, 108, 0.1);
          box-shadow: 0 4px 20px rgba(214, 51, 108, 0.08);
        }
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: #e0bec4;
        }
        .timeline-item:last-child .timeline-line::before {
          display: none;
        }
      `}</style>

      <div className="flex-grow space-y-6">
        {/* Header Card */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-2">
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Đơn hàng #{id || "PP-99238"}
          </h1>
          <p className="text-on-surface-variant font-body-md">
            Đơn hàng này được chia thành{" "}
            <span className="font-bold text-primary">2 kiện hàng</span> do xuất
            từ các kho khác nhau.
          </p>
        </div>

        <div className="bento-grid">
          {/* Shipping Timeline List */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Shipment 1 */}
            <div className="glass-card rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-outline-variant pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                      Kiện hàng 1{" "}
                      <span className="text-body-md text-on-surface-variant font-normal">
                        (#SHP-99238-1)
                      </span>
                    </h2>
                    <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed rounded-full font-label-sm whitespace-nowrap">
                      Đang vận chuyển
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-label-sm">
                    Dự kiến giao:{" "}
                    <span className="font-bold text-primary">
                      14:00 - 18:00, 24/10
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Đơn vị vận chuyển
                    </span>
                    <span className="font-bold text-secondary">
                      Giao Hàng Nhanh (GHN)
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Mã vận đơn
                    </span>
                    <span className="font-bold text-primary">
                      #GHN123456789
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-on-surface mb-3">
                  Sản phẩm trong kiện này
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <div className="flex-grow">
                      <p className="font-semibold text-on-surface text-sm">
                        iPhone 15 Pro Max 256GB - Titan Tự nhiên
                      </p>
                    </div>
                    <div className="font-bold text-on-surface">SL: 1</div>
                  </div>
                  <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <div className="flex-grow">
                      <p className="font-semibold text-on-surface text-sm">
                        Ốp lưng trong suốt Magsafe
                      </p>
                    </div>
                    <div className="font-bold text-on-surface">SL: 1</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-4">
                  Hành trình đơn hàng
                </h3>
                <div className="space-y-0">
                  <div className="timeline-item relative pb-8 flex gap-4">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-primary border-4 border-primary-fixed flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-on-surface text-body-lg">
                          Đang vận chuyển (IN_TRANSIT)
                        </h4>
                        <span className="text-primary font-bold">
                          14:00 - 18:00, 24/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md mt-1">
                        Shipper đang trên đường giao đến bạn.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-item relative pb-8 flex gap-4">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-on-surface text-body-md">
                          Đã đến kho phân loại HCM - Tân Bình
                        </h4>
                        <span className="text-on-surface-variant text-label-sm">
                          08:45, 23/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">
                        Đơn hàng đã được nhập kho và đang chờ phân tuyến.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-item relative pb-8 flex gap-4 opacity-70">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-on-surface text-body-md">
                          Đã xuất kho (SHIPPED)
                        </h4>
                        <span className="text-on-surface-variant text-label-sm">
                          22:30, 22/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">
                        Rời kho tổng Hà Nội, đang hướng về TP. Hồ Chí Minh.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-item relative pb-0 flex gap-4 opacity-70">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-on-surface text-body-md">
                          Đang đóng gói (PACKING)
                        </h4>
                        <span className="text-on-surface-variant text-label-sm">
                          15:20, 22/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">
                        Kiểm tra kỹ thuật và đóng gói chống sốc hoàn tất.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment 2 */}
            <div className="glass-card rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-outline-variant pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">
                      Kiện hàng 2{" "}
                      <span className="text-body-md text-on-surface-variant font-normal">
                        (#SHP-99238-2)
                      </span>
                    </h2>
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-label-sm whitespace-nowrap">
                      Đang đóng gói
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-label-sm">
                    Dự kiến giao:{" "}
                    <span className="font-bold text-primary">26/10</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Đơn vị vận chuyển
                    </span>
                    <span className="font-bold text-secondary">
                      Viettel Post
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div>
                    <span className="font-label-sm text-sm text-on-surface-variant block">
                      Mã vận đơn
                    </span>
                    <span className="font-bold text-primary">
                      #VTP987654321
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-on-surface mb-3">
                  Sản phẩm trong kiện này
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                    <div className="flex-grow">
                      <p className="font-semibold text-on-surface text-sm">
                        Tai nghe AirPods Pro Gen 2
                      </p>
                    </div>
                    <div className="font-bold text-on-surface">SL: 1</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-4">
                  Hành trình đơn hàng
                </h3>
                <div className="space-y-0">
                  <div className="timeline-item relative pb-8 flex gap-4">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-surface-variant border-4 border-outline-variant flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-on-surface text-body-lg">
                          Đang đóng gói (PACKING)
                        </h4>
                        <span className="text-on-surface-variant text-label-sm">
                          09:00, 24/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md mt-1">
                        Đang xử lý tại kho xuất hàng.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-item relative pb-0 flex gap-4 opacity-70">
                    <div className="timeline-line relative z-10">
                      <div className="w-6 h-6 rounded-full bg-outline-variant flex items-center justify-center">
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-on-surface text-body-md">
                          Chờ lấy hàng (PENDING)
                        </h4>
                        <span className="text-on-surface-variant text-label-sm">
                          08:00, 24/10
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mt-1">
                        Đơn hàng đã được xác nhận, chờ đơn vị vận chuyển lấy
                        hàng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Bento Cards */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Receiver Info */}
            <div className="glass-card rounded-xl p-6">
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
                  <p className="font-medium text-on-surface mt-1">
                    123 Đường Cách Mạng Tháng 8, Phường 11, Quận 3, TP. Hồ Chí
                    Minh
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="glass-card rounded-xl overflow-hidden h-48 relative group">
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
                  <button className="bg-white/90 backdrop-blur text-primary font-bold px-4 py-2 rounded-full shadow-lg">
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
                <button className="w-full bg-white text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all active:scale-95 shadow-sm">
                  <Headphones size={20} />
                  Liên hệ hỗ trợ ngay
                </button>
                <button className="w-full bg-primary-fixed-dim/20 border border-white/30 text-white font-medium py-2 rounded-lg hover:bg-primary-fixed-dim/30 transition-all shadow-sm">
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
