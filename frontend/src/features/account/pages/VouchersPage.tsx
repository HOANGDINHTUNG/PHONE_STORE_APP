import React, { useEffect, useState } from "react";
import {
  Calendar,
  Info,
  Timer,
  Copy,
  ShoppingBag,
  SearchX,
  Check,
  Sparkles,
  Tag,
  Clock,
  ChevronRight,
  X
} from "lucide-react";
import { AccountShell } from "../components/AccountShell";
import { voucherService, Voucher } from "../../../api/voucherService";
import { useNavigate } from "react-router-dom";

const DEFAULT_MOCK_VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "WELCOME50",
    name: "Voucher Chào Mới Khách Hàng",
    type: "AMOUNT",
    discountValue: 50000,
    appliesToAll: true,
    minimumOrderValue: 200000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 12,
    isClaimed: true,
  },
  {
    id: "v2",
    code: "TECH10",
    name: "Giảm 10% Cho Smartphone Cao Cấp",
    type: "PERCENT",
    discountValue: 10,
    appliesToAll: true,
    minimumOrderValue: 5000000,
    maximumDiscountAmount: 500000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 84,
    isClaimed: true,
  },
  {
    id: "v3",
    code: "SAMSUNG300",
    name: "Ưu Đãi Đặc Quyền Samsung Galaxy",
    type: "AMOUNT",
    discountValue: 300000,
    appliesToAll: false,
    minimumOrderValue: 8000000,
    maximumDiscountAmount: 300000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 45,
    isClaimed: true,
  },
  {
    id: "v4",
    code: "FLASHSALE20",
    name: "Flash Sale 20% Cuối Tuần",
    type: "PERCENT",
    discountValue: 20,
    appliesToAll: true,
    minimumOrderValue: 10000000,
    maximumDiscountAmount: 1000000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 92,
    isClaimed: true,
  },
];

export function VouchersPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("AVAILABLE");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadVouchers(activeTab);
  }, [activeTab]);

  const loadVouchers = async (tab: TabValue) => {
    setLoading(true);
    try {
      const res = await voucherService.getMyWalletVouchers(tab);
      if (res.content && res.content.length > 0) {
        setVouchers(res.content);
      } else if (tab === "AVAILABLE") {
        setVouchers(DEFAULT_MOCK_VOUCHERS);
      } else {
        setVouchers([]);
      }
    } catch {
      setVouchers(tab === "AVAILABLE" ? DEFAULT_MOCK_VOUCHERS : []);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã giảm giá "${code}" vào khay nhớ tạm!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShopNow = (_v?: Voucher) => {
    navigate("/");
  };

  return (
    <AccountShell
      title="Kho Voucher của tôi"
      description="Quản lý danh sách các mã giảm giá và ưu đãi độc quyền dành riêng cho bạn. Sử dụng mã khi thanh toán để nhận chiết khấu tốt nhất."
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 hide-scrollbar">
        {[
          { key: "AVAILABLE", label: "Đang khả dụng" },
          { key: "EXPIRING_SOON", label: "Sắp hết hạn" },
          { key: "USED", label: "Đã sử dụng" },
          { key: "EXPIRED", label: "Đã hết hạn" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabValue)}
            className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.key
                ? "text-pink-600 border-pink-600 bg-pink-50/50"
                : "text-slate-500 border-transparent hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : vouchers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {vouchers.map((v) => {
            const isPercent = v.type === "PERCENT";
            const formattedDiscount = isPercent
              ? `Giảm ${v.discountValue}%`
              : `Giảm ${(v.discountValue / 1000).toLocaleString("vi-VN")}k`;

            const minSpend = v.minimumOrderValue
              ? `Đơn tối thiểu ${(v.minimumOrderValue / 1000000).toLocaleString("vi-VN")} triệu`
              : "Áp dụng cho mọi đơn hàng";

            const isAvailable = activeTab === "AVAILABLE" || activeTab === "EXPIRING_SOON";

            return (
              <div
                key={v.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                  activeTab === "EXPIRING_SOON"
                    ? "border-amber-400 ring-1 ring-amber-400/30"
                    : isAvailable
                    ? "border-pink-200 hover:border-pink-400"
                    : "border-slate-200 opacity-70 bg-slate-50"
                }`}
              >
                {/* Decorative Ticket Edge Cutouts */}
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-pink-200 bg-slate-50" />
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-pink-200 bg-slate-50" />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-md bg-pink-100 px-2 py-0.5 text-xs font-mono font-black text-pink-700">
                        {v.code}
                      </span>
                      <h3 className="mt-1 text-base font-extrabold text-slate-900 leading-snug">{v.name}</h3>
                    </div>
                    <span className="shrink-0 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1 text-sm font-black text-white shadow-sm">
                      {formattedDiscount}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-600">{minSpend}</p>
                  {v.maximumDiscountAmount && (
                    <p className="text-[11px] text-slate-500">
                      Tối đa {(v.maximumDiscountAmount / 1000).toLocaleString("vi-VN")}k
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-pink-500" />
                      HSD: {new Date(v.endTime).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setSelectedVoucher(v)}
                    className="p-2 text-xs font-semibold text-slate-500 hover:text-pink-600 flex items-center gap-1"
                  >
                    <Info className="h-3.5 w-3.5" />
                    Chi tiết
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(v.code)}
                      className="inline-flex items-center gap-1 rounded-xl border border-pink-300 bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-all active:scale-95"
                    >
                      {copiedCode === v.code ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCode === v.code ? "Đã chép" : "Sao chép"}
                    </button>

                    {isAvailable && (
                      <button
                        onClick={() => handleShopNow(v)}
                        className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-pink-700 hover:to-rose-700 transition-all active:scale-95"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Mua ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <SearchX className="h-16 w-16 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy voucher phù hợp</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Hiện tại bạn chưa có mã giảm giá nào trong mục này. Hãy săn thêm các deal Hot tại trang chủ!
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Chi tiết Voucher {selectedVoucher.code}</h3>
              <button onClick={() => setSelectedVoucher(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-bold text-pink-600 text-sm">{selectedVoucher.name}</p>
              <p className="text-slate-600">{selectedVoucher.description || "Không có mô tả chi tiết."}</p>
              <div className="rounded-xl bg-slate-50 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã voucher:</span>
                  <span className="font-mono font-bold">{selectedVoucher.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn sử dụng:</span>
                  <span className="font-semibold">{new Date(selectedVoucher.endTime).toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn tối thiểu:</span>
                  <span className="font-semibold">
                    {selectedVoucher.minimumOrderValue
                      ? `${selectedVoucher.minimumOrderValue.toLocaleString("vi-VN")}đ`
                      : "Không bắt buộc"}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedVoucher(null)} className="w-full rounded-xl bg-pink-600 py-2.5 text-sm font-bold text-white hover:bg-pink-700">
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-bounce">
          <Check className="h-5 w-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AccountShell>
  );
}
