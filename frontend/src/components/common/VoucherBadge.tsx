import React from "react";
import { Tag, Flame, Gift, Sparkles } from "lucide-react";

interface VoucherBadgeProps {
  badgeText?: string;
  type?: "PERCENT" | "AMOUNT";
  discountValue?: number;
  variant?: "primary" | "gradient" | "flash" | "compact";
  className?: string;
}

export const VoucherBadge: React.FC<VoucherBadgeProps> = ({
  badgeText,
  type,
  discountValue,
  variant = "primary",
  className = "",
}) => {
  const displayText = badgeText || (type === "PERCENT"
    ? `Giảm ${discountValue}%`
    : `Giảm ${discountValue ? (discountValue / 1000).toLocaleString("vi-VN") : 0}k`);

  const isFlash = displayText.toLowerCase().includes("flash") || displayText.toLowerCase().includes("sale");

  if (variant === "compact") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-rose-500 to-pink-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105 ${className}`}>
        <Tag className="h-3 w-3" />
        {displayText}
      </span>
    );
  }

  if (isFlash) {
    return (
      <div className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 px-2.5 py-1 text-xs font-black text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-rose-500/30 ${className}`}>
        <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Flame className="h-3.5 w-3.5 animate-bounce text-yellow-300" />
        <span className="tracking-wide uppercase">{displayText}</span>
      </div>
    );
  }

  return (
    <div className={`group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-gradient-to-r from-pink-600 to-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-pink-500/20 ${className}`}>
      <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {type === "AMOUNT" ? <Gift className="h-3.5 w-3.5 text-pink-200" /> : <Sparkles className="h-3.5 w-3.5 text-amber-300" />}
      <span>{displayText}</span>
    </div>
  );
};
