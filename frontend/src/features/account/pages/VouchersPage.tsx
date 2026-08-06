import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Info,
  Timer,
  Copy,
  ShoppingBag,
  SearchX,
  Check,
  Star,
  Eye,
  X,
  Frown,
  Search,
} from "lucide-react";
import { AccountShell } from "../components/AccountShell";
import { voucherService, Voucher } from "../../../api/voucherService";
import { useNavigate } from "react-router-dom";

const DEFAULT_MOCK_VOUCHERS: Voucher[] = [
  {
    id: "v1",
    code: "WELCOME50",
    name: "Voucher Chào Mới",
    type: "AMOUNT",
    discountValue: 500000,
    appliesToAll: true,
    minimumOrderValue: 15000000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 12,
    isClaimed: true,
  },
  {
    id: "v2",
    code: "TECH10",
    name: "Giảm Phụ Kiện Chính Hãng",
    type: "PERCENT",
    discountValue: 10,
    appliesToAll: true,
    minimumOrderValue: 500000,
    maximumDiscountAmount: 500000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2027-01-15T23:59:59",
    status: "ACTIVE",
    usedCount: 84,
    isClaimed: true,
  },
  {
    id: "v3",
    code: "FLASHSALE20",
    name: "Flash Sale Cuối Tuần",
    type: "AMOUNT",
    discountValue: 1200000,
    appliesToAll: false,
    minimumOrderValue: 10000000,
    maximumDiscountAmount: 1200000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 45,
    isClaimed: true,
  },
  {
    id: "v4",
    code: "FIRSTORDER",
    name: "Ưu đãi thành viên mới",
    type: "AMOUNT",
    discountValue: 200000,
    appliesToAll: true,
    minimumOrderValue: 2000000,
    maximumDiscountAmount: 200000,
    startTime: "2026-01-01T00:00:00",
    endTime: "2026-12-31T23:59:59",
    status: "ACTIVE",
    usedCount: 92,
    isClaimed: true,
  },
];

type TabValue = "AVAILABLE" | "EXPIRING_SOON" | "USED" | "EXPIRED";

export function VouchersPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("AVAILABLE");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // UI states for new layout
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState("NEWEST");

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
      } else if (tab === "AVAILABLE" || tab === "EXPIRING_SOON") {
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
    showToast(`Đã sao chép mã giảm giá "${code}"!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShopNow = (_v?: Voucher) => {
    navigate("/");
  };

  // Filter & Sort
  const filteredVouchers = vouchers
    .filter(
      (v) =>
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortMethod === "DISCOUNT_DESC")
        return b.discountValue - a.discountValue;
      if (sortMethod === "EXPIRING_SOON")
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      return 0; // Default NEWEST
    });

  const getCardThemeConfig = (index: number) => {
    const themes = [
      {
        border: "border-primary",
        tagBg: "bg-secondary-fixed text-on-secondary-fixed",
        textClass: "text-primary",
      },
      {
        border: "border-tertiary",
        tagBg: "bg-tertiary-fixed text-on-tertiary-fixed",
        textClass: "text-tertiary",
      },
      {
        border: "border-secondary",
        tagBg: "bg-error-container text-on-error-container",
        textClass: "text-secondary",
      },
      {
        border: "border-primary",
        tagBg: "bg-primary-fixed text-on-primary-fixed",
        textClass: "text-primary",
      },
      {
        border: "border-outline",
        tagBg: "bg-surface-container-highest text-on-surface-variant",
        textClass: "text-on-surface",
      },
    ];
    return themes[index % themes.length];
  };

  return (
    <AccountShell>
      {/* Dynamic Scoped Styles for the Coupon rendering */}
      <style>{`
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }
        .coupon-card {
            background: linear-gradient(135deg, #ffffff 0%, #fcf8f9 100%);
            position: relative;
            overflow: hidden;
            border-left: 6px solid;
        }
        .coupon-card::before, .coupon-card::after {
            content: '';
            position: absolute;
            left: -12px;
            width: 24px;
            height: 24px;
            background: #f0edee;
            border-radius: 50%;
            z-index: 10;
        }
        .coupon-card::before { top: -12px; }
        .coupon-card::after { bottom: -12px; }
        .coupon-separator {
            border-left: 2px dashed #e0bec4;
            height: 100%;
            margin: 0 1rem;
            position: relative;
        }
      `}</style>

      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[48px] font-black tracking-tight text-primary mb-2">
            Kho mã giảm giá
          </h1>
          <p className="text-on-surface-variant text-[16px] max-w-2xl">
            Khám phá các ưu đãi độc quyền dành riêng cho thành viên PinkPhone.
            Áp dụng ngay để nhận mức giá tốt nhất cho chiếc smartphone mơ ước.
          </p>
        </div>

        {/* Tabs Section */}
        <div className="flex items-center gap-2 border-b border-outline-variant mb-8 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { key: "AVAILABLE", label: "Có thể sử dụng" },
            { key: "EXPIRING_SOON", label: "Sắp hết hạn" },
            { key: "USED", label: "Đã sử dụng" },
            { key: "EXPIRED", label: "Đã hết hạn" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabValue)}
              className={`px-6 py-3 font-bold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-secondary font-medium"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-on-surface-variant">
              Sắp xếp theo:
            </span>
            <select
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
              className="bg-surface-container border-none rounded-lg text-[14px] font-bold py-1.5 focus:ring-primary text-on-surface outline-none cursor-pointer"
            >
              <option value="NEWEST">Mới nhất</option>
              <option value="DISCOUNT_DESC">Giá trị giảm cao nhất</option>
              <option value="EXPIRING_SOON">Thời gian hết hạn gần nhất</option>
            </select>
          </div>
          <div className="w-full md:w-auto relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-4 pr-12 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-fixed-dim text-[16px] outline-none"
              placeholder="Nhập mã voucher..."
              type="text"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded text-[14px] font-bold active:scale-95 transition-transform">
              Áp dụng
            </button>
          </div>
        </div>

        {/* Coupon Bento Grid */}
        {loading ? (
          <div className="bento-grid">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-56 rounded-xl bg-surface-container-low animate-pulse"
              />
            ))}
          </div>
        ) : filteredVouchers.length > 0 ? (
          <div className="bento-grid">
            {filteredVouchers.map((v, idx) => {
              const theme = getCardThemeConfig(idx);
              const isPercent = v.type === "PERCENT";
              const formattedDiscount = isPercent
                ? `Giảm ${v.discountValue}%`
                : `Giảm ${(v.discountValue / 1000).toLocaleString("vi-VN")}k`;

              const minSpend = v.minimumOrderValue
                ? `Cho đơn hàng từ ${(v.minimumOrderValue / 1000).toLocaleString("vi-VN")}đ`
                : "Cho tất cả đơn hàng";

              const isAvailable =
                activeTab === "AVAILABLE" || activeTab === "EXPIRING_SOON";

              return (
                <div
                  key={v.id}
                  className={`coupon-card rounded-xl shadow-sm hover:shadow-md transition-all group ${theme.border} ${!isAvailable ? "opacity-60 grayscale-[0.3]" : ""}`}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`${theme.tagBg} px-3 py-1 rounded-full text-[14px] font-bold`}
                      >
                        {v.code}
                      </div>
                      {isAvailable && (
                        <Star size={20} className="text-primary fill-primary" />
                      )}
                    </div>

                    <h2
                      className={`text-[32px] font-black tracking-tight mb-1 ${theme.textClass}`}
                    >
                      {formattedDiscount}
                    </h2>
                    <p className="text-on-surface-variant text-[14px] font-bold mb-4">
                      {minSpend}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
                        <Calendar size={18} />
                        <span className="text-[12px] font-medium">
                          Hạn dùng:{" "}
                          {new Date(v.endTime).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
                        <Info size={18} />
                        <span className="text-[12px] font-medium">
                          {v.appliesToAll ? "Tất cả sản phẩm" : v.name}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() =>
                            isAvailable ? handleShopNow(v) : null
                          }
                          className={`flex-1 ${isAvailable ? "bg-primary hover:bg-secondary" : "bg-surface-variant text-on-surface-variant cursor-not-allowed"} text-white py-2.5 rounded-lg font-bold transition-all active:scale-95`}
                        >
                          {isAvailable ? "Dùng ngay" : "Không khả dụng"}
                        </button>
                        <button
                          onClick={() => setSelectedVoucher(v)}
                          className="px-3 border border-outline text-on-surface-variant rounded-lg hover:bg-surface-container transition-all active:scale-95"
                          title="Xem thông tin chi tiết"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Frown className="h-16 w-16 text-outline mb-4" strokeWidth={1.5} />
            <h3 className="text-[24px] font-bold text-on-surface mb-2">
              Không tìm thấy mã giảm giá
            </h3>
            <p className="text-on-surface-variant text-[16px]">
              Hiện tại bạn chưa có mã giảm giá nào trong mục này.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedVoucher && document.body
        ? createPortal(
            <div
              className="fixed z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: "fixed",
                width: "100vw",
                height: "100vh",
              }}
            >
              <div className="rounded-[24px] bg-surface-container-lowest p-6 sm:p-8 shadow-2xl overflow-y-auto w-[90%] max-w-[420px] max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
                  <h3 className="text-[20px] font-black text-on-surface">
                    Chi tiết Voucher
                  </h3>
                  <button
                    onClick={() => setSelectedVoucher(null)}
                    className="rounded-full p-2 text-on-surface-variant hover:bg-surface-variant transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <span className="inline-block bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-[16px] font-black font-mono tracking-wider mb-2">
                      {selectedVoucher.code}
                    </span>
                    <p className="text-[18px] font-bold text-primary leading-tight">
                      {selectedVoucher.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-container-low p-4 space-y-3 border border-outline-variant/30">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[14px] text-on-surface-variant font-medium shrink-0">
                        Hạn sử dụng:
                      </span>
                      <span className="text-[14px] font-bold text-right">
                        {new Date(selectedVoucher.endTime).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[14px] text-on-surface-variant font-medium shrink-0">
                        Đơn tối thiểu:
                      </span>
                      <span className="text-[14px] font-bold text-right">
                        {selectedVoucher.minimumOrderValue
                          ? `${selectedVoucher.minimumOrderValue.toLocaleString("vi-VN")}đ`
                          : "Không giới hạn"}
                      </span>
                    </div>
                    {selectedVoucher.maximumDiscountAmount && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-[14px] text-on-surface-variant font-medium shrink-0">
                          Giảm tối đa:
                        </span>
                        <span className="text-[14px] font-bold text-primary text-right">
                          {selectedVoucher.maximumDiscountAmount.toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => handleCopy(selectedVoucher.code)}
                    className="w-full rounded-xl border-2 border-primary text-primary py-3 text-[14px] font-bold hover:bg-primary-fixed/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy size={18} /> Sao chép mã
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVoucher(null);
                      handleShopNow(selectedVoucher);
                    }}
                    className="w-full rounded-xl bg-primary text-white py-3 text-[14px] font-bold hover:bg-secondary transition-colors"
                  >
                    Dùng ngay
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl bg-inverse-surface px-5 py-3.5 text-[14px] font-bold text-inverse-on-surface shadow-2xl animate-[slideUp_0.3s_ease-out]">
          <Check size={20} className="text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AccountShell>
  );
}
