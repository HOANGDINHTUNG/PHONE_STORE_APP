import React, { useEffect, useState } from "react";
import { Ticket, X, Sparkles, Check, AlertCircle, Copy, Clock, Tag } from "lucide-react";
import { voucherService, Voucher } from "../../../api/voucherService";

interface CartVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher: (code: string) => Promise<void>;
  appliedCouponCode?: string;
  cartSubtotal: number;
}

const DEFAULT_CART_VOUCHERS: Voucher[] = [
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
  },
];

export const CartVoucherModal: React.FC<CartVoucherModalProps> = ({
  isOpen,
  onClose,
  onApplyVoucher,
  appliedCouponCode,
  cartSubtotal,
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [applyingCode, setApplyingCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAvailableVouchers();
    }
  }, [isOpen]);

  const loadAvailableVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherService.getMyWalletVouchers("AVAILABLE");
      const list = (res.content && res.content.length > 0) ? res.content : DEFAULT_CART_VOUCHERS;

      // Calculate best voucher
      let maxDiscount = 0;
      let bestId = "";
      list.forEach((v) => {
        let disc = 0;
        if (v.type === "PERCENT") {
          disc = (cartSubtotal * v.discountValue) / 100;
          if (v.maximumDiscountAmount && disc > v.maximumDiscountAmount) {
            disc = v.maximumDiscountAmount;
          }
        } else {
          disc = v.discountValue;
        }
        if (disc > maxDiscount) {
          maxDiscount = disc;
          bestId = v.id;
        }
      });

      setVouchers(
        list.map((v) => ({
          ...v,
          isBestVoucher: v.id === bestId && maxDiscount > 0,
        }))
      );
    } catch {
      setVouchers(
        DEFAULT_CART_VOUCHERS.map((v, idx) => ({
          ...v,
          isBestVoucher: idx === 0,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (code: string) => {
    setApplyingCode(code);
    setErrorMessage(null);
    try {
      await onApplyVoucher(code);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể áp dụng mã giảm giá này";
      setErrorMessage(msg);
    } finally {
      setApplyingCode(null);
    }
  };

  const handleManualApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setErrorMessage("Vui lòng nhập mã giảm giá");
      return;
    }
    handleApply(manualCode.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-600 text-white shadow-md shadow-pink-500/20">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Chọn Mã Giảm Giá</h3>
              <p className="text-xs text-slate-500">Áp dụng mã ưu đãi để nhận chiết khấu trực tiếp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Manual Coupon Input Form */}
        <form onSubmit={handleManualApply} className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập mã voucher (vd: WELCOME50)..."
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value.toUpperCase());
                  setErrorMessage(null);
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim() || applyingCode !== null}
              className="rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-pink-700 active:scale-95 disabled:opacity-50 transition-all"
            >
              {applyingCode === manualCode.trim() ? "Đang xử lý..." : "Áp dụng"}
            </button>
          </div>

          {/* Explicit Backend Error Message Display */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>

        {/* Available Vouchers List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Voucher Khả Dụng ({vouchers.length})
          </h4>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : vouchers.length > 0 ? (
            vouchers.map((v) => {
              const isApplied = appliedCouponCode === v.code;
              const isPercent = v.type === "PERCENT";
              const formattedDiscount = isPercent
                ? `Giảm ${v.discountValue}%`
                : `Giảm ${(v.discountValue / 1000).toLocaleString("vi-VN")}k`;

              const isUnmet = v.minimumOrderValue && cartSubtotal < v.minimumOrderValue;

              return (
                <div
                  key={v.id}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                    isApplied
                      ? "border-pink-600 bg-pink-50/40 ring-2 ring-pink-600/20"
                      : v.isBestVoucher
                      ? "border-amber-400 bg-amber-50/20 ring-1 ring-amber-400/40"
                      : isUnmet
                      ? "border-slate-200 bg-slate-50/60 opacity-60"
                      : "border-slate-200 bg-white hover:border-pink-300"
                  }`}
                >
                  {v.isBestVoucher && (
                    <div className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      Voucher Tốt Nhất
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-extrabold text-pink-700 bg-pink-100/60 px-2 py-0.5 rounded">
                        {v.code}
                      </span>
                      <h4 className="mt-1 text-sm font-bold text-slate-900">{v.name}</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {v.minimumOrderValue
                          ? `Đơn tối thiểu ${(v.minimumOrderValue / 1000000).toLocaleString("vi-VN")}tr`
                          : "Không giới hạn đơn hàng"}
                      </p>
                    </div>

                    <span className="text-sm font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                      {formattedDiscount}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="h-3 w-3 text-pink-500" />
                      HSD: {new Date(v.endTime).toLocaleDateString("vi-VN")}
                    </span>

                    <button
                      onClick={() => handleApply(v.code)}
                      disabled={isApplied || (isUnmet as boolean) || applyingCode === v.code}
                      className={`inline-flex items-center gap-1 rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all ${
                        isApplied
                          ? "bg-emerald-600 cursor-default"
                          : isUnmet
                          ? "bg-slate-300 cursor-not-allowed"
                          : "bg-pink-600 hover:bg-pink-700 active:scale-95 shadow-pink-500/20"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Đã áp dụng
                        </>
                      ) : isUnmet ? (
                        "Chưa đủ điều kiện"
                      ) : applyingCode === v.code ? (
                        "Đang áp dụng..."
                      ) : (
                        "Áp dụng"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center py-6 text-xs text-slate-500">Không có voucher khả dụng trong ví của bạn.</p>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
