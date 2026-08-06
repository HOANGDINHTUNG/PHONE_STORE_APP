import {
  getStockDetailLabel,
  getStockShortLabel,
  getStockTone,
  type StockTone,
} from "../../utils/stock";

type StockBadgeProps = {
  stock?: number | null;
  outOfStock?: boolean;
  /** compact = card chips; detail = full sentence; inline = text-only row */
  variant?: "compact" | "detail" | "inline";
  className?: string;
  showIcon?: boolean;
};

const toneClass: Record<StockTone, string> = {
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
  low: "bg-amber-50 text-amber-800 border-amber-200",
  out: "bg-rose-50 text-rose-700 border-rose-200",
  unknown: "bg-slate-50 text-slate-600 border-slate-200",
};

const toneDot: Record<StockTone, string> = {
  ok: "bg-emerald-500",
  low: "bg-amber-500",
  out: "bg-rose-500",
  unknown: "bg-slate-400",
};

const toneText: Record<StockTone, string> = {
  ok: "text-emerald-700",
  low: "text-amber-700",
  out: "text-rose-600",
  unknown: "text-slate-500",
};

export function StockBadge({
  stock,
  outOfStock,
  variant = "compact",
  className = "",
  showIcon = true,
}: StockBadgeProps) {
  const tone = getStockTone(stock, outOfStock);
  const label =
    variant === "detail"
      ? getStockDetailLabel(stock, outOfStock)
      : getStockShortLabel(stock, outOfStock);

  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${toneText[tone]} ${className}`}
      >
        {showIcon && (
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} />
        )}
        {label}
      </span>
    );
  }

  if (variant === "detail") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${toneClass[tone]} ${className}`}
        role="status"
      >
        {showIcon && (
          <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${toneDot[tone]}`} />
        )}
        <span>{label}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${toneClass[tone]} ${className}`}
      role="status"
      title={getStockDetailLabel(stock, outOfStock)}
    >
      {showIcon && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} />
      )}
      {label}
    </span>
  );
}

export default StockBadge;
