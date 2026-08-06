import {
  Award,
  Gift,
  Truck,
  PartyPopper,
  ShieldCheck,
  Ticket,
  Info,
  HelpCircle,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AccountShell } from "../components/AccountShell";
import { fetchMyOrders } from "../../../api/profileService";
import { useStore } from "../../../context/StoreContext";

const TIERS = [
  { name: "Thành viên", minSpend: 0 },
  { name: "Bạc", minSpend: 5_000_000 },
  { name: "Vàng", minSpend: 15_000_000 },
  { name: "Bạch Kim", minSpend: 30_000_000 },
  { name: "Kim Cương", minSpend: 100_000_000 },
  { name: "Thẻ Đen", minSpend: 500_000_000 },
];

export function MembershipTierPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchMyOrders();
        if (active && Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.warn("Failed to load my orders for tier calculation:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  // ── Calculate dynamic spending and tier ──
  const validOrders = orders.filter((o) => o.status !== "CANCELLED");
  const totalSpending = validOrders.reduce(
    (sum, o) => sum + (o.grandTotalAmount || o.totalAmount || o.subtotalAmount || 0),
    0,
  );

  let currentTierIdx = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalSpending >= TIERS[i].minSpend) {
      currentTierIdx = i;
      break;
    }
  }

  const currentTier = TIERS[currentTierIdx];
  const nextTier = currentTierIdx < TIERS.length - 1 ? TIERS[currentTierIdx + 1] : null;

  let progressPercent = 0;
  let remainingSpend = 0;
  if (nextTier) {
    const rangeSize = nextTier.minSpend - currentTier.minSpend;
    const spentInRange = totalSpending - currentTier.minSpend;
    progressPercent = Math.min(100, Math.max(0, (spentInRange / rangeSize) * 100));
    remainingSpend = nextTier.minSpend - totalSpending;
  } else {
    progressPercent = 100;
    remainingSpend = 0;
  }

  // 1 point per 100,000 VND spent
  const points = Math.floor(totalSpending / 100_000);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  return (
    <AccountShell
      title="Hạng thành viên | PinkPhone"
      description="Chi tiết Hạng Khách hàng và các đặc quyền đi kèm."
    >
      <main className="flex-1 flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : (
          <>
            {/* Tier Summary Card (Bento Style) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Card */}
              <div
                className="md:col-span-2 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-[0_10px_40px_rgba(214,51,108,0.12)]"
                style={{
                  background:
                    "radial-gradient(at 0% 0%, #ffd9df 0%, transparent 50%), radial-gradient(at 100% 0%, #ffb1c2 0%, transparent 50%), radial-gradient(at 50% 100%, #fcf8f9 0%, transparent 50%)",
                }}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                        Hạng hiện tại
                      </span>
                      <h1 className="text-5xl font-black text-primary mt-2">
                        {currentTier.name}
                      </h1>
                      <p className="text-on-surface-variant font-medium mt-1 italic">
                        Tổng chi tiêu tích lũy: {formatVND(totalSpending)}
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-white/30 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/50 shadow-md">
                      <Award className="text-primary" size={48} />
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-8">
                  <div className="flex justify-between mb-2 items-end">
                    <span className="text-sm font-semibold text-on-surface-variant">
                      {nextTier ? (
                        <>
                          Tiến trình lên hạng{" "}
                          <span className="text-primary font-bold">{nextTier.name}</span>
                        </>
                      ) : (
                        <span className="text-primary font-bold">Bạn đã đạt hạng cao nhất!</span>
                      )}
                    </span>
                    <span className="text-xs text-on-surface-variant font-bold">
                      {formatVND(totalSpending)} / {nextTier ? formatVND(nextTier.minSpend) : "Tối đa"}
                    </span>
                  </div>
                  <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="mt-4 text-sm text-on-surface-variant/80 max-w-[28rem]">
                    {nextTier ? (
                      <>
                        Chỉ cần tích lũy thêm <strong>{formatVND(remainingSpend)}</strong> để mở khóa đặc
                        quyền {nextTier.name} cao cấp.
                      </>
                    ) : (
                      "Bạn đang tận hưởng tất cả đặc quyền cao cấp nhất của PinkPhone!"
                    )}
                  </p>
                </div>
                {/* Abstract decorative elements */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>

              {/* Points Card */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(214,51,108,0.08)] flex flex-col items-center justify-center text-center border-2 border-primary/10 transition-transform duration-300 hover:-translate-y-1">
                <span className="text-sm font-medium text-on-surface-variant mb-2">
                  Điểm tích lũy hiện có
                </span>
                <div className="text-5xl font-black text-secondary mb-4">
                  {points.toLocaleString("vi-VN")}
                </div>
                <button className="w-full bg-secondary-container text-on-secondary-container py-3 rounded-xl font-bold hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Gift size={20} />
                  Đổi quà ngay
                </button>
                <p className="mt-4 text-xs text-on-surface-variant font-medium">
                  Tỷ lệ tích lũy: 1 điểm / 100.000 đ
                </p>
              </div>
            </section>

            {/* Current Perks */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                  Quyền lợi hạng {currentTier.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-primary hover:-translate-y-1 transition-all group">
                  <Truck
                    className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <h4 className="font-bold text-on-surface mb-1">
                    Miễn phí vận chuyển
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    Cho mọi đơn hàng trên toàn quốc, không giới hạn giá trị.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-primary hover:-translate-y-1 transition-all group">
                  <PartyPopper
                    className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <h4 className="font-bold text-on-surface mb-1">Quà sinh nhật</h4>
                  <p className="text-sm text-on-surface-variant">
                    Voucher quà tặng đặc biệt mừng sinh nhật khách hàng.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-primary hover:-translate-y-1 transition-all group">
                  <ShieldCheck
                    className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <h4 className="font-bold text-on-surface mb-1">Bảo hành VIP</h4>
                  <p className="text-sm text-on-surface-variant">
                    Ưu tiên xử lý bảo hành nhanh chóng 24/7.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-primary hover:-translate-y-1 transition-all group">
                  <Ticket
                    className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <h4 className="font-bold text-on-surface mb-1">
                    Voucher độc quyền
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    Mã ưu đãi giảm giá riêng theo từng hạng thành viên.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Tier Comparison Table */}
        <section className="bg-white rounded-3xl p-8 border-2 border-primary/10 shadow-[0_4px_20px_rgba(214,51,108,0.08)] overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">
              So sánh quyền lợi các hạng
            </h2>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant font-bold bg-surface-container-high px-3 py-1.5 rounded-lg">
              <Info size={16} className="text-primary" />
              Chu kỳ xét hạng: 12 tháng
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-4 font-bold text-on-surface min-w-[200px]">
                    Đặc quyền
                  </th>
                  <th className="py-4 font-bold text-on-surface-variant min-w-[120px]">
                    Thành viên
                  </th>
                  <th className="py-4 font-bold text-on-surface-variant min-w-[120px]">
                    Bạc
                  </th>
                  <th className="py-4 font-bold text-primary text-lg min-w-[150px]">
                    Vàng
                  </th>
                  <th className="py-4 font-bold text-secondary text-lg min-w-[150px]">
                    Bạch Kim
                  </th>
                  <th className="py-4 font-bold text-secondary text-xl min-w-[150px]">
                    Kim Cương
                  </th>
                  <th className="py-4 font-bold text-secondary text-xl min-w-[150px]">
                    Thẻ Đen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-medium">Chi tiêu tích lũy</td>
                  <td className="py-6 text-on-surface-variant">0 - 5tr</td>
                  <td className="py-6 text-on-surface-variant">5tr - 15tr</td>
                  <td className="py-6 font-bold text-primary text-lg">15tr - 30tr</td>
                  <td className="py-6 font-bold text-secondary">30tr - 100tr</td>
                  <td className="py-6 font-bold text-secondary">100tr - 500tr</td>
                  <td className="py-6 font-bold text-secondary">Trên 500tr</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-medium">Tích lũy điểm</td>
                  <td className="py-6 text-on-surface-variant">0.5%</td>
                  <td className="py-6 text-on-surface-variant">1%</td>
                  <td className="py-6 font-bold text-primary text-lg">2%</td>
                  <td className="py-6 font-bold text-secondary">3%</td>
                  <td className="py-6 font-bold text-secondary">4%</td>
                  <td className="py-6 font-bold text-secondary">5%</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-medium">Vệ sinh máy miễn phí</td>
                  <td className="py-6">
                    <X size={20} className="text-on-surface-variant/30" />
                  </td>
                  <td className="py-6 text-on-surface-variant">1 lần/năm</td>
                  <td className="py-6 font-bold text-primary">Vô hạn</td>
                  <td className="py-6 font-bold text-secondary">Vô hạn</td>
                  <td className="py-6 font-bold text-secondary">Vô hạn</td>
                  <td className="py-6 font-bold text-secondary">Vô hạn</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-medium">Thu cũ đổi mới</td>
                  <td className="py-6 text-on-surface-variant">+100k</td>
                  <td className="py-6 text-on-surface-variant">+200k</td>
                  <td className="py-6 font-bold text-primary text-lg">+500k</td>
                  <td className="py-6 font-bold text-secondary">+700k</td>
                  <td className="py-6 font-bold text-secondary">+1tr</td>
                  <td className="py-6 font-bold text-secondary">+1.5tr</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="py-6 font-medium">Hỗ trợ kỹ thuật tại nhà</td>
                  <td className="py-6">
                    <X size={20} className="text-on-surface-variant/30" />
                  </td>
                  <td className="py-6">
                    <X size={20} className="text-on-surface-variant/30" />
                  </td>
                  <td className="py-6">
                    <X size={20} className="text-on-surface-variant/30" />
                  </td>
                  <td className="py-6 font-bold text-secondary flex items-center gap-1">
                    <Award size={16} /> Có
                  </td>
                  <td className="py-6 font-bold text-secondary flex items-center gap-1">
                    <Award size={16} /> Có
                  </td>
                  <td className="py-6 font-bold text-secondary flex items-center gap-1">
                    <Award size={16} /> Có
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-secondary rounded-full"></span>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">
              Câu hỏi thường gặp
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-2xl border-2 border-outline-variant/30 shadow-[0_4px_20px_rgba(214,51,108,0.04)] hover:shadow-[0_4px_20px_rgba(214,51,108,0.1)] transition-all">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary shrink-0" />
                Làm sao để thăng hạng nhanh nhất?
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Bạn có thể thăng hạng bằng cách mua sắm thiết bị mới, phụ kiện
                hoặc sử dụng dịch vụ sửa chữa tại hệ thống PinkPhone. Các chương
                trình X2 điểm vào cuối tuần cũng là cơ hội tốt.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-2 border-outline-variant/30 shadow-[0_4px_20px_rgba(214,51,108,0.04)] hover:shadow-[0_4px_20px_rgba(214,51,108,0.1)] transition-all">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary shrink-0" />
                Hạng thành viên có bị giảm không?
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Hạng thành viên được xét lại sau mỗi 12 tháng. Nếu chi tiêu
                trong năm không đạt mức duy trì, hạng của bạn sẽ được điều chỉnh
                về mức tương ứng.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-2 border-outline-variant/30 shadow-[0_4px_20px_rgba(214,51,108,0.04)] hover:shadow-[0_4px_20px_rgba(214,51,108,0.1)] transition-all">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary shrink-0" />
                Điểm tích lũy dùng để làm gì?
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Điểm tích lũy có thể dùng để trừ trực tiếp vào hóa đơn mua hàng
                (1 điểm = 1 VNĐ) hoặc đổi lấy các voucher quà tặng và dịch vụ
                độc quyền trong kho quà.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-2 border-outline-variant/30 shadow-[0_4px_20px_rgba(214,51,108,0.04)] hover:shadow-[0_4px_20px_rgba(214,51,108,0.1)] transition-all">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary shrink-0" />
                Xét hạng diễn ra khi nào?
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Hệ thống sẽ tự động cập nhật hạng ngay khi bạn đạt đủ điều kiện
                chi tiêu tích lũy. Chu kỳ duy trì hạng sẽ bắt đầu tính từ ngày
                thăng hạng.
              </p>
            </div>
          </div>
        </section>
      </main>
    </AccountShell>
  );
}
