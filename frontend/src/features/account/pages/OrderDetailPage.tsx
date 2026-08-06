import { Link, useParams } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import {
  ArrowLeft,
  Clock,
  ThumbsUp,
  FileText,
  Truck,
  CheckCircle2,
  MapPin,
  CreditCard,
  HeadphonesIcon,
  ShoppingBag,
  Star,
  Undo2,
  Wallet,
} from "lucide-react";

export function OrderDetailPage() {
  const { id } = useParams();

  return (
    <AccountShell
      title={`Chi tiết đơn hàng #${id}`}
      description="Theo dõi trạng thái và chi tiết sản phẩm của đơn hàng."
    >
      <style>{`
        .timeline-step::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e0bec4;
          z-index: -1;
        }
        .timeline-step:last-child::after {
          display: none;
        }
        .active-step::after {
          background: #b41254; /* bg-primary */
        }
      `}</style>

      <div className="flex-grow space-y-6">
        {/* Order Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/account/orders"
                className="hover:text-primary transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="font-headline-md text-headline-md text-on-surface">
                Chi tiết đơn hàng #{id || "PP-20240915"}
              </h1>
            </div>
            <p className="text-on-surface-variant font-body-md pl-8">
              Ngày đặt: 15 Tháng 9, 2024
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pl-8 md:pl-0 justify-end">
            <button className="px-4 py-2 bg-primary text-white font-label-sm text-label-sm rounded-lg hover:bg-secondary-container hover:text-white transition-colors flex items-center gap-2 shadow-sm">
              <ShoppingBag size={18} /> Mua lại
            </button>
            <button className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm text-label-sm rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <Star size={18} /> Đánh giá
            </button>
            <button className="px-4 py-2 border border-outline text-on-surface-variant font-label-sm text-label-sm rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <Undo2 size={18} /> Yêu cầu trả hàng
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] hidden md:block">
          <div className="relative flex justify-between">
            {/* Pending */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center timeline-step active-step">
                <Clock size={20} />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface text-center">
                Chờ xác nhận
              </span>
              <span className="text-[11px] text-on-surface-variant">
                15/09 - 09:00
              </span>
            </div>
            {/* Confirmed */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center timeline-step active-step">
                <ThumbsUp size={20} />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface text-center">
                Đã xác nhận
              </span>
              <span className="text-[11px] text-on-surface-variant">
                15/09 - 09:15
              </span>
            </div>
            {/* Processing */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center timeline-step active-step">
                <FileText size={20} />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface text-center">
                Đang xử lý
              </span>
              <span className="text-[11px] text-on-surface-variant">
                15/09 - 10:30
              </span>
            </div>
            {/* Shipping */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center timeline-step active-step">
                <Truck size={20} />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface text-center">
                Đang giao hàng
              </span>
              <span className="text-[11px] text-on-surface-variant">
                16/09 - 14:20
              </span>
            </div>
            {/* Completed */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/5">
              <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center timeline-step">
                <CheckCircle2 size={24} className="fill-primary text-white" />
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold text-center">
                Hoàn thành
              </span>
              <span className="text-[11px] text-primary font-bold">
                Hôm nay - 09:15
              </span>
            </div>
          </div>
        </section>

        {/* Mobile Status Timeline fallback */}
        <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] block md:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <CheckCircle2 size={28} className="fill-primary text-white" />
            </div>
            <div>
              <h3 className="font-bold text-primary">Hoàn thành</h3>
              <p className="text-on-surface-variant font-medium text-sm">
                Cập nhật lúc: Hôm nay - 09:15
              </p>
            </div>
          </div>
        </section>

        {/* Receiver & Payment Summary Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receiver Info */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)]">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={20} />
              <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thông tin nhận hàng
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[12px] text-on-surface-variant uppercase font-bold mb-1">
                  Thông liên hệ
                </p>
                <p className="font-bold text-on-surface">Alex Nguyen</p>
                <p className="text-on-surface-variant font-medium">
                  (+84) 901 234 567
                </p>
              </div>
              <div>
                <p className="text-[12px] text-on-surface-variant uppercase font-bold mb-1">
                  Địa chỉ giao hàng
                </p>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  Tầng 15, Tòa nhà Bitexco Financial Tower
                  <br />
                  Phường Bến Nghé
                  <br />
                  Quận 1<br />
                  Thành phố Hồ Chí Minh
                </p>
              </div>
            </div>
          </div>
          {/* Payment Summary */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)]">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-primary" size={20} />
              <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Chi tiết thanh toán
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-on-surface-variant font-medium">
                <span>Tạm tính (2 sản phẩm)</span>
                <span>42.980.000đ</span>
              </div>
              <div className="flex justify-between text-primary font-bold">
                <span>Giảm giá (Voucher GOLD2024)</span>
                <span>-2.000.000đ</span>
              </div>
              <div className="flex justify-between text-on-surface-variant font-medium">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-bold">0đ</span>
              </div>
              <div className="pt-3 border-t border-outline-variant flex justify-between items-center">
                <span className="font-bold text-on-surface">Tổng cộng</span>
                <span className="font-headline-md text-headline-md font-bold text-primary">
                  40.980.000đ
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 py-2 px-3 bg-surface-container-low rounded-lg text-[12px] font-medium">
                <CreditCard className="text-primary" size={16} />
                <span className="text-on-surface-variant">
                  Thanh toán qua Thẻ tín dụng (**** 4242)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-headline-md text-[20px] text-on-surface font-bold">
              Danh sách sản phẩm
            </h2>
            <Link
              to="/account/support"
              className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1"
            >
              <HeadphonesIcon size={18} /> Liên hệ hỗ trợ
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-4 py-4 text-left font-label-sm text-label-sm text-on-surface-variant">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-4 text-left font-label-sm text-label-sm text-on-surface-variant">
                    SKU
                  </th>
                  <th className="px-4 py-4 text-left font-label-sm text-label-sm text-on-surface-variant">
                    Phiên bản
                  </th>
                  <th className="px-4 py-4 text-center font-label-sm text-label-sm text-on-surface-variant">
                    Bảo hành
                  </th>
                  <th className="px-4 py-4 text-right font-label-sm text-label-sm text-on-surface-variant">
                    Đơn giá
                  </th>
                  <th className="px-4 py-4 text-center font-label-sm text-label-sm text-on-surface-variant">
                    SL
                  </th>
                  <th className="px-4 py-4 text-right font-label-sm text-label-sm text-on-surface-variant">
                    Giảm giá
                  </th>
                  <th className="px-4 py-4 text-right font-label-sm text-label-sm text-on-surface-variant">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {/* Product 1 */}
                <tr>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center p-2 border border-outline-variant/30 flex-shrink-0">
                        <img
                          className="w-full h-full object-contain"
                          alt="Product image"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBpoJMFGduHzmJDspEwUlrM4fTwdz42eJO--BG6HplIFLwUfJt_NSrdwnj1kpOwi8YqJ9xhiEQHIh4leSsF8ukIjLWD-UlQCAtw3ACp2gFBkIGNi02ncsUJNThxhGULCblGv6ucVmMLiaHt_DyiAatfGPYsCodhLoObWgxod6jt7Jfp9b3qxtB1Is8lmE9eqW8fX71DvcnQ_KopsrkRO_10QxPZp9qd7n7EcEK22WKhQox3N8sP_PL"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm max-w-[150px]">
                          PinkPhone Ultra Z
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-on-surface-variant text-sm font-medium">
                    PP-UZ-256-PNK
                  </td>
                  <td className="px-4 py-6 text-on-surface-variant text-sm font-medium">
                    256GB / 12GB RAM
                    <br />
                    Màu: Sakura Pink
                  </td>
                  <td className="px-4 py-6 text-center text-on-surface-variant text-sm font-medium">
                    12 tháng
                  </td>
                  <td className="px-4 py-6 text-right text-on-surface font-medium whitespace-nowrap">
                    32.990.000đ
                  </td>
                  <td className="px-4 py-6 text-center text-on-surface font-medium">
                    1
                  </td>
                  <td className="px-4 py-6 text-right text-on-surface-variant font-medium">
                    -
                  </td>
                  <td className="px-4 py-6 text-right font-bold text-primary whitespace-nowrap">
                    32.990.000đ
                  </td>
                </tr>
                {/* Product 2 */}
                <tr>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center p-2 border border-outline-variant/30 flex-shrink-0">
                        <img
                          className="w-full h-full object-contain"
                          alt="Product image"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBglxf94wpi1RdndYiUz9AAhcQ7DumEmDOm8uaimVhM4OLYrPR9-WcAORQDnYuMRV8wKWSxBXvsu-7VFKVCUTfif6LJUGw2KLSQ7kk_LtSPr5Wnlwjr5zrtWq7wVfFLymnzLjSUeddWew_xqbMj2kfnceZDkmBRw9kUGCFHoc9ui__QKRKNXZQUJ1AlUlU0C-l0pVRMTCX-XJl0nphkOAguKTPSZT5Qyp1zx7DWVM2IeubI3faMg0qJ"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface text-sm max-w-[150px]">
                          PinkAudio Buds Pro
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-on-surface-variant text-sm font-medium">
                    PA-BP-STD-PNK
                  </td>
                  <td className="px-4 py-6 text-on-surface-variant text-sm font-medium">
                    Standard
                  </td>
                  <td className="px-4 py-6 text-center text-on-surface-variant text-sm font-medium">
                    6 tháng
                  </td>
                  <td className="px-4 py-6 text-right text-on-surface font-medium whitespace-nowrap">
                    9.990.000đ
                  </td>
                  <td className="px-4 py-6 text-center text-on-surface font-medium">
                    1
                  </td>
                  <td className="px-4 py-6 text-right text-on-surface-variant font-medium">
                    -
                  </td>
                  <td className="px-4 py-6 text-right font-bold text-primary whitespace-nowrap">
                    9.990.000đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AccountShell>
  );
}
