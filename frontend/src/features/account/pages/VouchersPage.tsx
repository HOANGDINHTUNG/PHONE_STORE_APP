import React, { useState } from "react";
import {
  Calendar,
  Info,
  Timer,
  Copy,
  ShoppingBag,
  SearchX,
} from "lucide-react";
import { AccountShell } from "../components/AccountShell";

type TabValue = "active" | "used" | "expired";

interface Voucher {
  id: string;
  code: string;
  badge: {
    label: string;
    bgColor: string;
    textColor: string;
  };
  title: string;
  borderColor: string;
  subtitle: string;
  expiryIcon: React.ReactNode;
  expiryText: string;
  info: string;
  status: TabValue;
}

const MOCK_VOUCHERS: Voucher[] = [
  {
    id: "1",
    code: "PP500K",
    badge: {
      label: "Hotsale",
      bgColor: "bg-secondary-fixed",
      textColor: "text-on-secondary-fixed",
    },
    borderColor: "border-primary",
    title: "Giảm 500.000 ₫",
    subtitle: "Đơn tối thiểu 15.000.000 ₫",
    expiryIcon: <Calendar className="w-4 h-4" />,
    expiryText: "Hạn dùng: 31/12/2024",
    info: "Phạm vi: iPhone 15 Series",
    status: "active",
  },
  {
    id: "2",
    code: "ACC10",
    badge: {
      label: "Phụ kiện",
      bgColor: "bg-tertiary-fixed",
      textColor: "text-on-tertiary-fixed",
    },
    borderColor: "border-tertiary",
    title: "Giảm 10%",
    subtitle: "Đơn tối thiểu 500.000 ₫ • Tối đa 200.000 ₫",
    expiryIcon: <Calendar className="w-4 h-4" />,
    expiryText: "Hạn dùng: 15/01/2025",
    info: "Phạm vi: Toàn bộ phụ kiện chính hãng",
    status: "active",
  },
  {
    id: "3",
    code: "FOLD12M",
    badge: {
      label: "Flash Deal",
      bgColor: "bg-error-container",
      textColor: "text-on-error-container",
    },
    borderColor: "border-secondary",
    title: "Giảm 1.200.000 ₫",
    subtitle: "Đơn tối thiểu 29.990.000 ₫",
    expiryIcon: <Timer className="w-4 h-4" />,
    expiryText: "Còn lại 02:45:12",
    info: "Phạm vi: Galaxy Z Fold5 | Flip5",
    status: "active",
  },
];

export function VouchersPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("active");

  const filteredVouchers = MOCK_VOUCHERS.filter((v) => v.status === activeTab);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Đã sao chép mã: " + code);
  };

  return (
    <AccountShell
      title="Ưu đãi & mã giảm giá"
      description="Khám phá các ưu đãi độc quyền dành riêng cho thành viên PinkPhone. Áp dụng ngay để nhận mức giá tốt nhất cho chiếc smartphone mơ ước."
    >
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
          border-left: 6px solid #d6336c;
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
      `}</style>

      {/* Tabs Section */}
      <div className="flex items-center gap-4 border-b border-outline-variant mb-6 overflow-x-auto pb-1 hide-scrollbar">
        <button
          onClick={() => setActiveTab("active")}
          className={
            "px-6 py-3 font-bold whitespace-nowrap transition-all " +
            (activeTab === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-secondary font-medium")
          }
        >
          Có thể sử dụng
        </button>
        <button
          onClick={() => setActiveTab("used")}
          className={
            "px-6 py-3 font-bold whitespace-nowrap transition-all " +
            (activeTab === "used"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-secondary font-medium")
          }
        >
          Đã sử dụng
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={
            "px-6 py-3 font-bold whitespace-nowrap transition-all " +
            (activeTab === "expired"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-secondary font-medium")
          }
        >
          Hết hạn/Không còn hiệu lực
        </button>
      </div>

      {filteredVouchers.length > 0 ? (
        <div className="bento-grid">
          {filteredVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className={
                "coupon-card rounded-xl shadow-sm hover:shadow-md transition-all group " +
                voucher.borderColor
              }
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={
                      voucher.badge.bgColor +
                      " " +
                      voucher.badge.textColor +
                      " px-3 py-1 rounded-full text-xs font-semibold"
                    }
                  >
                    {voucher.badge.label}
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                    Mã: {voucher.code}
                  </span>
                </div>
                <h2 className="text-2xl text-primary font-black mb-1">
                  {voucher.title}
                </h2>
                <p className="text-on-surface-variant text-sm font-semibold mb-4">
                  {voucher.subtitle}
                </p>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
                    {voucher.expiryIcon}
                    <span className="text-xs font-medium">
                      {voucher.expiryText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant opacity-80">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-medium">{voucher.info}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(voucher.code)}
                      className="flex-1 border-2 border-primary-container text-primary-container py-2 rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-all text-sm active:scale-95"
                    >
                      Sao chép mã
                    </button>
                    <button className="flex-1 bg-primary-container text-on-primary-container py-2 rounded-lg font-bold hover:opacity-90 transition-all text-sm active:scale-95">
                      Mua sắm ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center w-full">
          <SearchX className="text-outline mb-4 w-16 h-16 opacity-30" />
          <h3 className="font-headline-md font-bold text-on-surface mb-2">
            Không có mã giảm giá nào
          </h3>
          <p className="text-on-surface-variant max-w-sm">
            Hiện tại mục này trống. Hãy tiếp tục mua sắm để nhận thêm nhiều ưu
            đãi!
          </p>
        </div>
      )}
    </AccountShell>
  );
}
