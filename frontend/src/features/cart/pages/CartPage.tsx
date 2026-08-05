import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "../../home/components/SiteHeader";

// Note: Re-using Lucide React icons instead of Material Symbols to keep standard with rest of project, but mapping closely to the exact mockup symbols.
import {
  ArrowLeft,
  Trash2,
  UserCircle2,
  X,
  Info,
  Minus,
  Plus,
  AlertCircle,
  Tag,
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  Check,
} from "lucide-react";
import { CartVoucherModal } from "../components/CartVoucherModal";
import { voucherService } from "../../../api/voucherService";

type CartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  oldPrice?: number;
  image: string;
  outOfStock?: boolean;
  stockLeft?: number;
  isPriceDropped?: boolean;
};

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    variant: "Hồng | 256GB | SKU: IP15PM-PNK-256",
    price: 34990000,
    oldPrice: 41165000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDi5T4OQLGv0a_I1nC3k7I2txz0UHymXZu2c-uNr21CmeSXn77lv1UyxItkWstmlk3875sZRKu2CWS3WRrr5N-x8Cj-fQKZjzsmsLNT1RcYpOlfMypoMdXNYNbwlZDEYYM6r6Gkj0Grcws_VTJNQsC9YF9xJCzbD87mhJLGpZFOuxQdLP593W59B5WKjxXQQqu1nUZZSdGxLxQ6XogcsogIaNHKZTKLASIqqQscpNNXAQOS16XuKBiB",
    stockLeft: 2,
  },
  {
    id: 2,
    name: "PinkPod Wireless Over-ear Pro",
    variant: "Blush Pink | SKU: PP-WRL-PRO-PNK",
    price: 5490000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdSNYRGLrEuIyIg4uXBHMTESHXiF55FWFO26KpBpUGS-k0D3J660yYMjymvvWV4vDSUjx0-K_iznsGDq67YesiNbJmnAqoHg5jf0zy4WNt30ROwqmpdHeK6ksojbQGpRak2uHiYdIaDJTK-cNIqfdSRIYOLHreTNzXBzQfPrHyNCklygu4arFyM5AXEheuma3P-wkxJiVyt32xZqxt0H0T3P8yVJqnWjzLqQh9YhRfnsCQokGc4uGF",
    isPriceDropped: true,
  },
  {
    id: 3,
    name: "Sạc nhanh 20W USB-C",
    variant: "Trắng | SKU: CHG-20W-WHT",
    price: 450000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcFUzzLULP3esgWWIkKAOWabirSeRNlmKqupg8sahxG9NSIi6ctJN6qBjF0Cvik-Vi9zP55vWPq0V_fTvodzM_TGk5MqLpIT9sQkS3iAjIKOl0G_XWk7hr23SYr7Zelyohbq6OcCGq8SNL-Eox-SFKL8IA-xmq5TxfNVzdBsNPYXwQVx_eoYZeGpeiixh13Mar3mhEXjlbmv5aq3LIQ0GTfGLwnSBV6bYNGLCYRJuqKoQidUquzmTa",
    outOfStock: true,
  },
];

const upsellItems = [
  {
    id: 11,
    name: "Sạc nhanh 20W USB-C",
    price: 450000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcFUzzLULP3esgWWIkKAOWabirSeRNlmKqupg8sahxG9NSIi6ctJN6qBjF0Cvik-Vi9zP55vWPq0V_fTvodzM_TGk5MqLpIT9sQkS3iAjIKOl0G_XWk7hr23SYr7Zelyohbq6OcCGq8SNL-Eox-SFKL8IA-xmq5TxfNVzdBsNPYXwQVx_eoYZeGpeiixh13Mar3mhEXjlbmv5aq3LIQ0GTfGLwnSBV6bYNGLCYRJuqKoQidUquzmTa",
  },
  {
    id: 12,
    name: "Ốp Magsafe Clear",
    price: 890000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUr5urezHy2unJrFgljHk9TjuM7YXVlHJwiJ7Xd63Mj9_AH7yalgKddfHuSe14smMCQEMcBacbD2X6G9EqliofY2NOyVb7Ntz69Kl5fyk8KEdM-tq4o-Jm2UsvCuvIaPRqXulSkENSdi6yKXSLs_zY0jAC_ggrf0eqBhR8xz6JDX6clz7HOCaSSRVvYVOmW3HqppmmTqnwBa-2eabuV6Ii3JwMLTTW_gJiPwjA5qtnMjkyp6pXSlp5",
  },
  {
    id: 13,
    name: "PinkWatch Series 1",
    price: 6200000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANylJU0PY_Ynz4L8Zd9uTlYy3pu8d46w53kaPHn3TxYi5rhK7p6kIVMEYD4yyPWrF3e2JtAP2IzubnAMVB_lG_8nDWb-q4xesBubbZ6y5cyaAyD2O_lC2SA3ILouyrMUr0WMx0kCrDj1VgKCw2N3PgyURnnsrOfB4DrxTh20wSRjucjlqvyLIxLTEgmoqUZ8z9ZpFdpQyOkBshBAfA3_WHk0xE3dHrRBv9xrVT_Snpro3FZteZWuXp",
  },
];

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const [quantities, setQuantities] = useState<Record<number, number>>({
    1: 1,
    2: 2,
  });

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; name: string; discount: number } | null>({
    code: "WELCOME50",
    name: "Voucher Chào Mới",
    discount: 50000,
  });
  const [revocationNotice, setRevocationNotice] = useState<string | null>(null);

  const subtotal = useMemo(
    () =>
      items
        .filter((item) => !item.outOfStock)
        .reduce(
          (sum, item) => sum + item.price * (quantities[item.id] ?? 1),
          0,
        ),
    [items, quantities],
  );

  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = Math.max(subtotal - discount, 0);

  const handleApplyVoucher = async (code: string) => {
    try {
      const res = await voucherService.applyVoucher(code);
      const disc = res.discountAmount !== undefined ? res.discountAmount : 50000;
      setAppliedVoucher({
        code: res.appliedCouponCode || code,
        name: res.appliedCouponName || "Mã giảm giá",
        discount: disc,
      });
      setRevocationNotice(null);
    } catch (err: any) {
      // Demo fallback if backend cart not initialized
      if (code.toUpperCase() === "WELCOME50") {
        setAppliedVoucher({ code: "WELCOME50", name: "Voucher Chào Mới", discount: 50000 });
      } else if (code.toUpperCase() === "TECH10") {
        setAppliedVoucher({ code: "TECH10", name: "Giảm 10%", discount: Math.min(subtotal * 0.1, 500000) });
      } else {
        throw err;
      }
    }
  };

  const handleRemoveVoucher = async () => {
    try {
      await voucherService.removeVoucher();
    } catch {}
    setAppliedVoucher(null);
  };

  const changeQuantity = (id: number, delta: number) => {
    setQuantities((current) => {
      const nextVal = Math.max(1, Math.min(5, (current[id] ?? 1) + delta));
      const newQty = { ...current, [id]: nextVal };
      
      // Calculate new subtotal
      const newSubtotal = items
        .filter((item) => !item.outOfStock)
        .reduce((sum, item) => sum + item.price * (newQty[item.id] ?? 1), 0);

      // Auto revoke check if subtotal falls below requirement
      if (appliedVoucher && appliedVoucher.code === "TECH10" && newSubtotal < 5000000) {
        setAppliedVoucher(null);
        setRevocationNotice("Voucher TECH10 đã bị tự động hủy vì giá trị đơn hàng không còn đủ 5.000.000đ.");
      }
      return newQty;
    });
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?")) {
      setItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md relative overflow-x-hidden">
      {/* Desktop Global Header (hidden on mobile) */}
      <div className="hidden lg:block">
        <SiteHeader search="" onSearch={() => {}} />
      </div>

      {/* Mobile TopAppBar (visible only on mobile) */}
      <header className="lg:hidden bg-surface w-full top-0 sticky z-50 shadow-sm flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="active:scale-95 transition-transform duration-200 text-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-headline-md text-headline-md text-primary m-0 p-0 text-xl">
            Giỏ hàng
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearAll}
            className="active:scale-95 transition-transform duration-200 text-on-surface-variant hover:text-danger"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      {/* Main Responsive Container */}
      <main className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-4 lg:pt-10 pb-48 lg:pb-24">
        {items.length > 0 ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Left Column: Cart Items & Upsells */}
            <div className="space-y-6 lg:space-y-8 w-full min-w-0">
              {/* Login Promo */}
              <div className="bg-primary-container/10 p-4 rounded-xl flex items-center justify-between border border-primary/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <UserCircle2 size={24} className="text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">
                      Đăng nhập để nhận ưu đãi
                    </span>
                    <span className="text-[12px] text-on-surface-variant">
                      Tích điểm và sử dụng voucher cá nhân
                    </span>
                  </div>
                </div>
                <Link
                  to="/dang-nhap"
                  className="shrink-0 text-primary font-bold text-sm px-4 py-1.5 border border-primary bg-white rounded-lg active:scale-95 transition-transform hover:bg-primary-container/10"
                >
                  Đăng nhập
                </Link>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-surface-container-lowest rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(214,51,108,0.08)] transition-all ${
                      item.outOfStock
                        ? "opacity-60 grayscale relative overflow-hidden"
                        : "animate-fade-in"
                    }`}
                  >
                    {item.outOfStock && (
                      <div className="absolute inset-0 bg-surface-dim/20 z-10 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-on-surface/80 text-white px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest shadow-lg">
                          Hết hàng
                        </span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center border border-outline-variant/30">
                        <img
                          className="w-20 h-20 object-contain mix-blend-multiply"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-label-sm text-label-sm text-on-surface line-clamp-2 pr-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-on-surface-variant z-20 relative hover:bg-surface-container-low rounded-full p-1 -m-1 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <p className="text-[12px] text-on-surface-variant line-clamp-1">
                          {item.variant}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`font-bold text-lg ${item.outOfStock ? "text-on-surface-variant" : "text-primary"}`}
                          >
                            {formatCurrency(item.price)}
                          </p>
                          {item.oldPrice && !item.outOfStock && (
                            <span className="text-on-surface-variant text-[12px] line-through">
                              {formatCurrency(item.oldPrice)}
                            </span>
                          )}
                        </div>

                        {!item.outOfStock && item.stockLeft && (
                          <div className="flex items-center gap-1 text-error text-[10px] font-bold mt-1">
                            <AlertCircle size={14} />
                            <span>
                              Chỉ còn {item.stockLeft} sản phẩm trong kho
                            </span>
                          </div>
                        )}
                        {!item.outOfStock && item.isPriceDropped && (
                          <div className="flex items-center gap-1 text-secondary text-[10px] font-bold mt-1">
                            <Info size={14} />
                            <span>Giá vừa giảm 200.000đ</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!item.outOfStock && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/50 flex justify-between items-end">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide">
                            Số lượng
                          </span>
                          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg p-1 w-fit">
                            <button
                              onClick={() => changeQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-primary-container active:scale-90 transition-all hover:bg-primary-container/10 rounded-md"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-bold text-sm">
                              {quantities[item.id] ?? 1}
                            </span>
                            <button
                              onClick={() => changeQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-primary-container active:scale-90 transition-all hover:bg-primary-container/10 rounded-md"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wide mb-1">
                            Thành tiền
                          </p>
                          <p className="text-primary font-bold text-lg">
                            {formatCurrency(
                              item.price * (quantities[item.id] ?? 1),
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upsell Section */}
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-label-sm text-[14px] text-on-surface uppercase tracking-wider font-bold">
                    Mua kèm tiết kiệm hơn
                  </h2>
                  <button className="text-primary text-[12px] font-bold hover:underline transition-all">
                    Xem tất cả
                  </button>
                </div>
                {/* Horizontal scroll with negative margins to bleed out on mobile if needed, but safe on desktop */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                  {upsellItems.map((product) => (
                    <div
                      key={product.id}
                      className="min-w-[140px] w-[140px] bg-white rounded-xl p-3 shadow-sm border border-outline-variant/50 flex flex-col gap-2 hover:border-primary/50 transition-colors group cursor-pointer"
                    >
                      <div className="w-full aspect-square bg-surface-container-lowest rounded-lg mb-1 flex items-center justify-center overflow-hidden border border-outline-variant/20 p-2">
                        <img
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <h4 className="text-[12px] font-semibold line-clamp-2 text-on-surface group-hover:text-primary transition-colors flex-1 leading-tight">
                        {product.name}
                      </h4>
                      <p className="text-primary font-bold text-sm">
                        {formatCurrency(product.price)}
                      </p>
                      <button className="w-full py-1.5 border border-primary text-primary bg-white rounded-lg text-[12px] font-bold active:scale-95 transition-transform hover:bg-primary-container hover:text-white mt-1">
                        Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Desktop Sidebar & Mobile Sticky Bottom */}
            <div className="lg:sticky lg:top-36 space-y-4">
              {/* Revocation Warning Alert */}
              {revocationNotice && (
                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 border border-amber-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>{revocationNotice}</span>
                  </div>
                  <button onClick={() => setRevocationNotice(null)} className="text-amber-600 hover:text-amber-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Voucher Promotions Block */}
              {appliedVoucher ? (
                <div className="bg-pink-50/60 rounded-xl p-4 border border-pink-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600 text-white">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-pink-700 bg-white px-2 py-0.5 rounded border border-pink-200">
                          {appliedVoucher.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{appliedVoucher.name}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-rose-600">
                        Giảm -{formatCurrency(appliedVoucher.discount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsVoucherModalOpen(true)}
                      className="text-xs font-bold text-pink-600 hover:underline"
                    >
                      Đổi mã
                    </button>
                    <button
                      onClick={handleRemoveVoucher}
                      className="rounded-full p-1 text-slate-400 hover:bg-pink-100 hover:text-rose-600 transition-colors"
                      title="Xóa voucher"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between border border-dashed border-outline hover:border-primary transition-colors shadow-sm cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <Tag size={20} className="text-primary" />
                    <div>
                      <span className="font-label-sm text-sm font-bold text-on-surface block">
                        Mã giảm giá Pink Voucher
                      </span>
                      <span className="text-xs text-pink-600 font-medium">Bạn có voucher khả dụng</span>
                    </div>
                  </div>
                  <button className="text-primary font-bold text-sm flex items-center gap-0.5">
                    Chọn ngay <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Cart Voucher Selection Modal */}
              <CartVoucherModal
                isOpen={isVoucherModalOpen}
                onClose={() => setIsVoucherModalOpen(false)}
                onApplyVoucher={handleApplyVoucher}
                appliedCouponCode={appliedVoucher?.code}
                cartSubtotal={subtotal}
              />

              {/* Payment Summary Footer Bar 
                  - On Mobile: fixed bottom-0 w-full left-0 z-50
                  - On Desktop: relative, inline block with rounded corners
              */}
              <footer className="fixed bottom-0 left-0 w-full bg-surface-container-lowest shadow-[0_-4px_25px_rgba(214,51,108,0.15)] z-50 p-4 pb-safe lg:static lg:rounded-2xl lg:shadow-md lg:border lg:border-outline-variant/40 lg:pb-4 transition-all">
                <div className="max-w-[1200px] mx-auto space-y-4">
                  {/* Ledger Breakdown (Hidden on very small screens, visible slightly, always visible on Desktop) */}
                  <div className="hidden sm:block space-y-2 border-b border-outline-variant/40 pb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">Tạm tính:</span>
                      <span className="text-on-surface font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">
                        Giảm giá (Dự kiến):
                      </span>
                      <span className="text-secondary font-semibold">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant">
                        Phí vận chuyển:
                      </span>
                      <span className="text-on-surface-variant italic text-[13px]">
                        Tính tại bước thanh toán
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex flex-col">
                      <span className="text-on-surface font-extrabold text-base lg:text-lg">
                        Tổng cộng:
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        ({items.filter((i) => !i.outOfStock).length} sản phẩm)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-primary font-extrabold text-2xl lg:text-3xl tracking-tight">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    disabled={total === 0}
                    className="w-full bg-primary-container text-white font-bold py-3.5 lg:py-4 rounded-xl text-base lg:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary-container/30 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none hover:bg-primary"
                  >
                    <span>Tiến hành thanh toán</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </footer>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col w-full">
            <section className="w-full flex-col flex items-center justify-center text-center py-12 lg:py-16">
              <div className="empty-cart-animation mb-8">
                <svg
                  fill="none"
                  height="240"
                  viewBox="0 0 240 240"
                  width="240"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="120" cy="120" fill="#FFEBF1" r="100"></circle>
                  <path
                    d="M70 90H170L160 170H80L70 90Z"
                    stroke="#D6336C"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  ></path>
                  <path
                    d="M95 90C95 70 100 60 120 60C140 60 145 70 145 90"
                    stroke="#D6336C"
                    strokeLinecap="round"
                    strokeWidth="6"
                  ></path>
                  <circle cx="105" cy="125" fill="#D6336C" r="5"></circle>
                  <circle cx="135" cy="125" fill="#D6336C" r="5"></circle>
                  <path
                    d="M110 145C110 145 115 150 120 150C125 150 130 145 130 145"
                    stroke="#D6336C"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                  <rect
                    fill="#FFD9DF"
                    height="20"
                    rx="4"
                    transform="rotate(-15 50 150)"
                    width="20"
                    x="50"
                    y="150"
                  ></rect>
                  <rect
                    fill="#FFD9DF"
                    height="15"
                    rx="3"
                    transform="rotate(20 180 100)"
                    width="15"
                    x="180"
                    y="100"
                  ></rect>
                </svg>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2 text-2xl lg:text-3xl">
                Giỏ hàng của bạn đang trống
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-10 text-sm lg:text-base px-4">
                Hãy lựa chọn chiếc điện thoại phù hợp và quay lại đây để hoàn
                tất đơn hàng.
              </p>
              <Link
                to="/"
                className="bg-primary text-white px-10 py-3.5 rounded-full font-label-sm text-label-sm hover:bg-secondary transition-all duration-200 active:scale-95 shadow-md"
              >
                Tiếp tục mua sắm
              </Link>
            </section>

            <section className="bg-surface-container-low py-12 lg:py-16 mt-4 lg:mt-8 px-4 lg:px-8 -mx-4 lg:-mx-8 rounded-none lg:rounded-3xl border-t border-outline-variant/30">
              <div className="max-w-[1200px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-headline-md text-headline-md text-on-surface text-xl lg:text-3xl">
                    Sản phẩm bán chạy
                  </h2>
                  <Link
                    to="/"
                    className="text-primary font-label-sm text-label-sm hover:underline"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Suggested Card 1 */}
                  <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col hover-card transition-all duration-300">
                    <div className="aspect-square mb-4 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-sm border border-outline-variant/20">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3k5fJzI_h8VK2PD69quIkL8P1i7FjBQ3eOittJKvJZ5b3Pe0jC7qBfK7aozT0tFWCqjvj-Z3vCVnzGCM7YaBiqEuTwLHZO5dxOApvimbOXnoTd7wrigm-3Gzsye1gawmL8Vq0ZAYR6op2mv0qC91gJ1UQ9_9rpw_Poi4_MeWMIiF2En4MW-o4cGMgxxAO0f99flbAgmaFBt5MMpCIERYEx4UTRdXfkw_8x3qvTjZVJXswA4Xk-Wkx"
                        alt="iPhone 15 Pro Max"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="text-secondary font-label-sm text-[12px] uppercase tracking-wider mb-2 block font-bold">
                        Best Seller
                      </span>
                      <h3 className="font-body-lg text-[16px] font-semibold text-on-surface mb-1">
                        iPhone 15 Pro Max
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-primary font-bold text-lg">
                          29.490.000₫
                        </span>
                        <span className="text-on-surface-variant text-[12px] line-through">
                          34.990.000₫
                        </span>
                      </div>
                    </div>
                    <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary hover:text-white transition-colors duration-200">
                      Thêm vào giỏ
                    </button>
                  </div>
                  {/* Suggested Card 2 */}
                  <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col hover-card transition-all duration-300">
                    <div className="aspect-square mb-4 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-sm border border-outline-variant/20">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkR6n3yRT4qVXdd2qCuy0cc86tjLvi9Kf6IL_FYT_v4UeIoMDM8ksX6KL9asbFibfhjNXuAFTbHZrGH9ExGzDz7QYxY5YmKegUV6NCME8jRRKdAWrsHg9nqh9VkC5SAksZywkhgegtBFKY3w2u70baB8_DUNFYL7leWysT9Qq6FquYmMg7iHvNqwuogP2iciEueBwtLvfGAZZG62byPAGYixpR9-nKY9_O0gUX5_Ef5Ks37yGyTatP"
                        alt="Galaxy Z Flip5"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="text-secondary font-label-sm text-[12px] uppercase tracking-wider mb-2 block font-bold">
                        Mới về
                      </span>
                      <h3 className="font-body-lg text-[16px] font-semibold text-on-surface mb-1">
                        Galaxy Z Flip5
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-primary font-bold text-lg">
                          15.990.000₫
                        </span>
                        <span className="text-on-surface-variant text-[12px] line-through">
                          19.990.000₫
                        </span>
                      </div>
                    </div>
                    <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary hover:text-white transition-colors duration-200">
                      Thêm vào giỏ
                    </button>
                  </div>
                  {/* Suggested Card 3 */}
                  <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col hover-card transition-all duration-300">
                    <div className="aspect-square mb-4 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-sm border border-outline-variant/20">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHO_BzXD2bhokrkBlkCHJPePo9GzXhbxNRvO2Fu64joJfJiZOXy0YrbjnQb_ZGnAty645O0VhG1KS1BqDmJMZMvj9iJzminzafAGQSou9skRG36yCTicS1kq20Vk98_4Rn01-A6lZpixJ0KgejLkmZ5btqBGo2MppuuipPNRf0YHtE2c8-5n5EpHmDV_CfV0zA6Zz5uaJee-Y43Xjy1KtayIQuz1EbUa3SXhLpmL6fWIRPFEsjFAex"
                        alt="iPhone 15 Pink"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="invisible font-label-sm text-[12px] block mb-2 font-bold">
                        Spacer
                      </span>
                      <h3 className="font-body-lg text-[16px] font-semibold text-on-surface mb-1">
                        iPhone 15 Pink
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-primary font-bold text-lg">
                          22.190.000₫
                        </span>
                      </div>
                    </div>
                    <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary hover:text-white transition-colors duration-200">
                      Thêm vào giỏ
                    </button>
                  </div>
                  {/* Suggested Card 4 */}
                  <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col hover-card transition-all duration-300">
                    <div className="aspect-square mb-4 bg-white rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-sm border border-outline-variant/20">
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbKMmPKbLHe8hmOYpHbk_N8OTHKAY8g8IKunvBSFOrHHnGz5EIwuriEcSYzkuNTLjuRsEHLOSDDeEMsokirTlat-UDSgVT4H33ORY2SLnNcHIQuCILD3aoNKZWnPzxorvM-dKGxPG1Vc3jHUe_JYkT2B4AgA9z6j17i_mO0rB_BT9por-OA7cvKvvb9LYk0nJ2JYvyZApcjGfa44TXKEqorGOVaEU-1f4yxzMXlGttLKXjWkohl6-u"
                        alt="Xiaomi 14 Ultra"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="text-secondary font-label-sm text-[12px] uppercase tracking-wider mb-2 block font-bold">
                        Giảm giá sốc
                      </span>
                      <h3 className="font-body-lg text-[16px] font-semibold text-on-surface mb-1">
                        Xiaomi 14 Ultra
                      </h3>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-primary font-bold text-lg">
                          26.990.000₫
                        </span>
                        <span className="text-on-surface-variant text-[12px] line-through">
                          29.990.000₫
                        </span>
                      </div>
                    </div>
                    <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary hover:text-white transition-colors duration-200">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <style>{`
        /* Minimalist scrollbar for horizontal sections */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .empty-cart-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .hover-card:hover {
          box-shadow: 0 12px 24px rgba(214, 51, 108, 0.12);
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}
