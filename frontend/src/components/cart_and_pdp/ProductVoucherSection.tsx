import React, { useEffect, useState } from "react";
import { Ticket, Copy, Check, Info, Bookmark, Sparkles, Clock, Users, ChevronRight, X } from "lucide-react";
import { voucherService, Voucher } from "../../api/voucherService";
import { useNavigate } from "react-router-dom";

interface ProductVoucherSectionProps {
  productId: string;
}

export const ProductVoucherSection: React.FC<ProductVoucherSectionProps> = ({ productId }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [selectedTermsVoucher, setSelectedTermsVoucher] = useState<Voucher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      loadProductVouchers();
    }
  }, [productId]);

  const loadProductVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherService.getProductVouchers(productId);
      setVouchers(data);
    } catch {
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã giảm giá "${code}"!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClaim = async (v: Voucher) => {
    if (v.isClaimed) return;
    setClaimingId(v.id);
    try {
      await voucherService.claimVoucher(v.id);
      showToast(`Đã lưu mã ${v.code} vào Kho Voucher của bạn!`);
      setVouchers((prev) =>
        prev.map((item) => (item.id === v.id ? { ...item, isClaimed: true } : item))
      );
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.data?.code === "AUTH_REQUIRED") {
        showToast("Vui lòng đăng nhập để lưu voucher!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(err?.response?.data?.message || "Không thể lưu voucher");
      }
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-rose-50/30 p-4 animate-pulse space-y-3">
        <div className="h-5 w-40 rounded bg-pink-200" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-24 rounded-xl bg-pink-100" />
          <div className="h-24 rounded-xl bg-pink-100" />
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return null;
  }

  return (
    <div className="relative rounded-2xl border border-pink-200/80 bg-gradient-to-br from-pink-50/80 via-white to-rose-50/50 p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-600 text-white shadow-sm shadow-pink-500/30">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Mã giảm giá khả dụng
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-extrabold text-pink-700">
                {vouchers.length} ưu đãi
              </span>
            </h3>
            <p className="text-xs text-slate-500">Lưu hoặc sao chép mã để dùng khi thanh toán</p>
          </div>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        {vouchers.map((v) => {
          const isBest = v.isBestVoucher;
          const isPercent = v.type === "PERCENT";
          const formattedDiscount = isPercent
            ? `Giảm ${v.discountValue}%`
            : `Giảm ${(v.discountValue / 1000).toLocaleString("vi-VN")}k`;

          const maxDiscountText = v.maximumDiscountAmount
            ? `Giảm tối đa ${(v.maximumDiscountAmount / 1000).toLocaleString("vi-VN")}k`
            : null;

          const minSpendText = v.minimumOrderValue
            ? `Đơn từ ${(v.minimumOrderValue / 1000000).toLocaleString("vi-VN")}tr`
            : "Cho mọi đơn";

          return (
            <div
              key={v.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-300 ${isBest
                  ? "border-pink-500 bg-white ring-2 ring-pink-500/20 shadow-md shadow-pink-500/10"
                  : "border-pink-200/70 bg-white/90 hover:border-pink-400 hover:shadow-md"
                }`}
            >
              {isBest && (
                <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Voucher Tốt Nhất
                </div>
              )}

              <div>
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {v.code}
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 leading-snug">{v.name}</h4>
                  </div>
                  <span className="shrink-0 text-sm font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                    {formattedDiscount}
                  </span>
                </div>

                {/* Conditions Tags */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                    {minSpendText}
                  </span>
                  {maxDiscountText && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium">
                      {maxDiscountText}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3 text-pink-500" />
                    HSD: {new Date(v.endTime).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Users className="h-3 w-3 text-emerald-500" />
                    Đã dùng {v.usedCount} lần
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <button
                  onClick={() => setSelectedTermsVoucher(v)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  Điều kiện
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-2xs"
                  >
                    Dùng ngay
                  </button>

                  <button
                    onClick={() => handleCopyCode(v.code)}
                    className="inline-flex items-center gap-1 rounded-lg border border-pink-300 bg-pink-50/50 px-2.5 py-1 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-all"
                  >
                    {copiedCode === v.code ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedCode === v.code ? "Đã chép" : "Sao chép"}
                  </button>

                  <button
                    onClick={() => handleClaim(v)}
                    disabled={v.isClaimed || claimingId === v.id}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold text-white shadow-sm transition-all ${v.isClaimed
                        ? "bg-slate-400 cursor-not-allowed opacity-80"
                        : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 active:scale-95 shadow-pink-500/20"
                      }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {claimingId === v.id ? "Đang lưu..." : v.isClaimed ? "Đã Lưu" : "Lưu Voucher"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terms Modal */}
      {selectedTermsVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-pink-600" />
                Điều kiện Voucher {selectedTermsVoucher.code}
              </h3>
              <button
                onClick={() => setSelectedTermsVoucher(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="font-semibold text-pink-600">{selectedTermsVoucher.name}</p>
              <p className="text-xs text-slate-600">{selectedTermsVoucher.description || "Không có mô tả thêm."}</p>

              <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã Coupon:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTermsVoucher.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức giảm:</span>
                  <span className="font-bold text-rose-600">
                    {selectedTermsVoucher.type === "PERCENT"
                      ? `${selectedTermsVoucher.discountValue}%`
                      : `${selectedTermsVoucher.discountValue?.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                {selectedTermsVoucher.maximumDiscountAmount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giảm tối đa:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedTermsVoucher.maximumDiscountAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn tối thiểu:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTermsVoucher.minimumOrderValue
                      ? `${selectedTermsVoucher.minimumOrderValue.toLocaleString("vi-VN")}đ`
                      : "Không có"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn sử dụng:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(selectedTermsVoucher.startTime).toLocaleDateString("vi-VN")} -{" "}
                    {new Date(selectedTermsVoucher.endTime).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTermsVoucher(null)}
              className="w-full rounded-xl bg-pink-600 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
            >
              Đã hiểu
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
    </div>
  );
};
