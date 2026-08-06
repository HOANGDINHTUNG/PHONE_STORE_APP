import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import {
  X,
  Minus,
  Plus,
  AlertCircle,
  ChevronRight,
  Tag,
  User,
  Trash2,
  Heart,
  CheckCircle2,
  Gift,
  CreditCard,
  ShieldCheck,
  Shield,
  ArrowRight,
} from "lucide-react";
import EmptyCartState from "../../components/cart_and_pdp/EmptyCartState";
import { useStore } from "../../context/StoreContext";
import { CartItem } from "../../types";
import { StockBadge } from "../../components/common/StockBadge";
import { resolveProductStock } from "../../utils/stock";
import { saveCheckoutSelectedIds } from "../../utils/checkoutSelection";

// ─── Mock Data ────────────────────────────────────────────────────────
const crossSellProducts = [
  {
    id: 401,
    name: "Ốp lưng Silicon Pink",
    price: "290.000đ",
    oldPrice: "450.000đ",
    stock: 30,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgVhGrTK8FAjbxpVELgY1Cgsbve3cEeK0qvbkku93xHrqZNUlrv-e_6yC1pkhGqKuMxqZ5Tqfc6NhD37tNlTNYHoR0mG6w0PUmll_O1q9L71mFCiz_-rpthmMYdawLkyd7f0V9KTcQIyHa5OswtJf0y5G4cBaGr2MWUq3ptq9Pxx06uo9mxL7YeJEZWoX2Fx8yzkzIM2ekKHWAx_1TJq2Kb5KYfpkgtYhVCXg--332FbdEjZvmPWP",
  },
  {
    id: 402,
    name: "Sạc nhanh 65W GaN",
    price: "650.000đ",
    oldPrice: "890.000đ",
    stock: 4,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCunfUrU13C6tq00FdY5aWre5hMKH46czzbmgu4DLTohnidabBtcx1zEhkeB_3oQqRvuuJXFMhzTKMt4j5LUSBpEIhhytX5yCweheH0piaaYsvLgJJaTcUBy9clH9jsh-pWeCciNAh7Cycf-mazYMzWX_aZOvcTkah_aHs3Uz-H7CCp_4GkZMHrLVQJK_VhSvdbF2RNVxvYB-CKkb9ZMcciRS9JSJ8s19_FOCCcNsUQQH5St8S7JDGo",
  },
  {
    id: 403,
    name: "PinkBuds Pro 2",
    price: "1.890.000đ",
    oldPrice: "2.490.000đ",
    stock: 0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUxChAtL4xh8TI_w6o3eSdgzd-uvCDECMs0XYNiZvHWSCveeM7YVo3CNX9ntmfTXktU9E7IeJ76bHt8K_a_wQgYXjoNsaMqsvbaeeOoGIaU4wen1In2SZjpyHyUeMnX29pZFLybX33h9BpodwuJ2-KEixkIy6ezbzNzddvwyOnO-GgU2630aGj7H6lN037ysIUgpCJVpPbJhYjRskrw6RDzW_xRuakRDAgOb8UDsdB6cDe9WaAVFLY",
  },
];

import { AvailableVoucher } from "../../utils/vouchers";
import { voucherService, Voucher } from "../../api/voucherService";

// ─── Cart Component ───────────────────────────────────────────────────
const Cart = () => {
  const {
    user,
    cart,
    removeFromCart,
    updateCartQuantity,
    addToCart,
    appliedVoucher,
    applyVoucher,
  } = useStore();
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  // Default true so mobile (no terms checkbox in sticky bar) can checkout
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Voucher Selection State
  const selectedVoucherCode = appliedVoucher?.code || null;
  const [inputCouponCode, setInputCouponCode] = useState(
    appliedVoucher?.code || "",
  );
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);

  // Sync from global cart; preserve per-item selection (active)
  useEffect(() => {
    setLocalCart((prev) => {
      const prevById = new Map(prev.map((item) => [String(item.id), item]));
      return cart.map((item) => {
        const stock = resolveProductStock(item);
        const outOfStock = stock <= 0 || !!item.outOfStock;
        const existing = prevById.get(String(item.id));
        return {
          ...item,
          stock,
          outOfStock,
          // New items selected by default; OOS cannot be selected
          active: outOfStock ? false : (existing?.active ?? true),
        };
      });
    });
  }, [cart]);

  const handleRemove = (id: number | string) => {
    setLocalCart((prev) => prev.filter((item) => item.id !== id));
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: number | string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }
    const target = localCart.find((item) => item.id === id);
    const maxStock = resolveProductStock(target);
    if (maxStock > 0 && newQty > maxStock) {
      message.warning(`Chỉ còn ${maxStock} sản phẩm trong kho`);
      newQty = maxStock;
    }
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
    updateCartQuantity(id, newQty);
  };

  const toggleItemSelected = (id: number | string) => {
    setLocalCart((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.outOfStock) return item;
        return { ...item, active: !item.active };
      }),
    );
  };

  const selectableItems = localCart.filter((item) => !item.outOfStock);
  const selectedItems = localCart.filter(
    (item) => !!item.active && !item.outOfStock,
  );
  const selectAllChecked =
    selectableItems.length > 0 &&
    selectableItems.every((item) => !!item.active);

  const toggleSelectAll = () => {
    const next = !selectAllChecked;
    setLocalCart((prev) =>
      prev.map((item) =>
        item.outOfStock
          ? { ...item, active: false }
          : { ...item, active: next },
      ),
    );
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      message.warning("Chưa có sản phẩm nào được chọn");
      return;
    }
    const ids = selectedItems.map((item) => item.id);
    const idSet = new Set(ids.map(String));
    ids.forEach((id) => removeFromCart(id));
    setLocalCart((prev) => prev.filter((item) => !idSet.has(String(item.id))));
    message.success(`Đã xóa ${ids.length} sản phẩm khỏi giỏ`);
  };

  const handleAddCrossSell = (prod: (typeof crossSellProducts)[0]) => {
    const stock = resolveProductStock(prod);
    if (stock <= 0) {
      message.warning("Sản phẩm đã hết hàng");
      return;
    }
    if (!localCart.some((item) => item.id === prod.id)) {
      const newItem: CartItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: 1,
        active: true,
        stock,
        outOfStock: false,
      };
      setLocalCart((prev) => [...prev, newItem]);
      addToCart(newItem);
    }
  };

  // Totals only for selected, in-stock items
  const subtotal = selectedItems.reduce((acc, item) => {
    const priceStr = item.price || item.newPrice || "0đ";
    return acc + parseInt(priceStr.replace(/\D/g, "") || "0") * item.quantity;
  }, 0);

  // Always load the active campaigns from the database. Checkout validates the
  // selected code again, so a cached campaign can never be used after expiry.
  useEffect(() => {
    let cancelled = false;
    const loadVouchers = async () => {
      setVouchersLoading(true);
      try {
        const vouchers = await voucherService.getPublicVouchers();
        if (!cancelled) setAvailableVouchers(vouchers);
      } catch {
        if (!cancelled) {
          setAvailableVouchers([]);
          setVoucherError("Không thể tải mã giảm giá. Vui lòng thử lại.");
        }
      } finally {
        if (!cancelled) setVouchersLoading(false);
      }
    };
    void loadVouchers();
    return () => { cancelled = true; };
  }, []);

  const toStoreVoucher = (voucher: Voucher): AvailableVoucher => ({
    id: voucher.id,
    code: voucher.code,
    name: voucher.name || voucher.code,
    type: voucher.type === "AMOUNT" ? "FIXED" : "PERCENT",
    discountValue: Number(voucher.discountValue),
    maximumDiscountAmount: voucher.maximumDiscountAmount == null ? undefined : Number(voucher.maximumDiscountAmount),
    minimumOrderValue: voucher.minimumOrderValue == null ? undefined : Number(voucher.minimumOrderValue),
    description: voucher.description || "Ưu đãi đang áp dụng",
  });

  useEffect(() => {
    if (!vouchersLoading && appliedVoucher && !availableVouchers.some(
      (voucher) => voucher.code.toUpperCase() === appliedVoucher.code.toUpperCase(),
    )) {
      applyVoucher(null);
      setVoucherError(`Mã giảm giá "${appliedVoucher.code}" không còn hiệu lực.`);
    }
  }, [availableVouchers, appliedVoucher, applyVoucher, vouchersLoading]);

  const discountAmount = React.useMemo(() => {
    const voucher = appliedVoucher;
    if (!voucher || (voucher.minimumOrderValue && subtotal < voucher.minimumOrderValue)) return 0;
    const discount = voucher.type === "PERCENT"
      ? Math.min((subtotal * voucher.discountValue) / 100, voucher.maximumDiscountAmount ?? Number.MAX_SAFE_INTEGER)
      : voucher.discountValue;
    return Math.min(discount, subtotal);
  }, [appliedVoucher, subtotal]);

  // Auto revoke check when subtotal changes
  useEffect(() => {
    if (appliedVoucher) {
      if (
        appliedVoucher.minimumOrderValue &&
        subtotal < appliedVoucher.minimumOrderValue
      ) {
        setVoucherError(
          `Voucher "${appliedVoucher.code}" đã bị hủy vì đơn hàng (${subtotal.toLocaleString("vi-VN")}đ) chưa đạt tối thiểu ${appliedVoucher.minimumOrderValue.toLocaleString("vi-VN")}đ.`,
        );
        applyVoucher(null);
      }
    }
  }, [subtotal, appliedVoucher]);

  const total = Math.max(subtotal - discountAmount, 0);

  const handleApplyManualCode = (codeToApply: string) => {
    const trimmed = codeToApply.trim().toUpperCase();
    if (!trimmed) {
      setVoucherError("Vui lòng nhập mã giảm giá");
      return;
    }
    const voucher = availableVouchers.find(
      (item) => item.code.toUpperCase() === trimmed,
    );
    if (!voucher) {
      setVoucherError(
        `Mã giảm giá "${trimmed}" không tồn tại hoặc không hợp lệ`,
      );
      return;
    }
    if (voucher.minimumOrderValue && subtotal < voucher.minimumOrderValue) {
      setVoucherError(
        `Đơn hàng (${subtotal.toLocaleString("vi-VN")}đ) chưa đủ điều kiện tối thiểu ${voucher.minimumOrderValue.toLocaleString("vi-VN")}đ để dùng mã "${trimmed}"`,
      );
      return;
    }

    applyVoucher(toStoreVoucher(voucher));
    setInputCouponCode(voucher.code);
    setVoucherError(null);
  };

  const formatPrice = (num: number) => num.toLocaleString("vi-VN") + " ₫";

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
      return;
    }
    if (!agreedToTerms) {
      message.warning(
        "Vui lòng đồng ý với Điều khoản & Điều kiện mua hàng tại PinkPhone trước khi thanh toán.",
      );
      return;
    }
    // Persist selection so checkout only bills selected lines
    saveCheckoutSelectedIds(selectedItems.map((item) => item.id));
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (localCart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-8 pb-16">
        <EmptyCartState />
      </div>
    );
  }

  // ── Shared Cart Item Card props ────────────────────────────────────
  const CartItemCard = ({
    item,
    mobile,
  }: {
    item: CartItem;
    mobile: boolean;
  }) => {
    const priceStr = item.price || item.newPrice || "0đ";
    const priceNum = parseInt(priceStr.replace(/\D/g, "") || "0");
    const itemTotal = priceNum * item.quantity;
    const stock = resolveProductStock(item);
    const isOOS = !!item.outOfStock || stock <= 0;
    const atMax = !isOOS && stock > 0 && item.quantity >= stock;

    const isSelected = !!item.active && !isOOS;

    if (mobile) {
      return (
        <div
          className={`bg-surface-container-lowest rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(214,51,108,0.08)] relative overflow-hidden transition-all ${isOOS ? "opacity-60 grayscale" : ""} ${!isSelected && !isOOS ? "ring-0 opacity-90" : ""}`}
        >
          {isOOS && (
            <div className="absolute inset-0 bg-surface-dim/20 z-10 flex items-center justify-center pointer-events-none">
              <span className="bg-on-surface/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Hết hàng
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <label className="flex items-start pt-1 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-outline text-primary accent-primary disabled:opacity-40"
                checked={isSelected}
                disabled={isOOS}
                onChange={() => toggleItemSelected(item.id)}
                aria-label={`Chọn ${item.name} để thanh toán`}
              />
            </label>
            <div
              className="w-24 h-24 flex-shrink-0 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => navigate(`/product/${item.slug || item.id}`)}
            >
              <img
                className="w-20 h-20 object-contain mix-blend-multiply"
                src={item.image}
                alt={item.name}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h3
                  className="text-sm font-bold text-on-surface line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/product/${item.slug || item.id}`)}
                >
                  {item.name}
                </h3>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-on-surface-variant hover:text-error transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant">
                SKU: PP-ITM-{item.id}
              </p>
              <StockBadge stock={stock} outOfStock={isOOS} variant="inline" />
              <p className="text-primary font-bold text-base">{item.price || item.newPrice}</p>
            </div>
          </div>
          {!isOOS && (
            <div className="mt-3 pt-3 border-t border-outline-variant flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Số lượng {stock > 0 ? `(tối đa ${stock})` : ""}
                </span>
                <div className="flex items-center bg-surface-container rounded-lg p-1">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-all hover:bg-primary/10 rounded-md"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-bold text-sm min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={atMax}
                    className={`w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-all hover:bg-primary/10 rounded-md ${atMax ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Thành tiền
                </p>
                <p className="text-primary font-bold text-base">
                  {formatPrice(itemTotal)}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Desktop card
    return (
      <div
        className={`bg-surface-container-lowest p-6 rounded-lg shadow-sm border flex gap-6 relative transition-all group ${
          isOOS
            ? "opacity-60 grayscale border-outline-variant/30"
            : isSelected
              ? "border-primary/40 hover:border-primary/60"
              : "border-outline-variant/30 opacity-80 hover:border-outline"
        }`}
      >
        {isOOS && (
          <div className="absolute inset-0 bg-surface-dim/20 z-10 flex items-center justify-center rounded-lg pointer-events-none">
            <span className="bg-on-surface/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Hết hàng
            </span>
          </div>
        )}
        <div className="flex items-start pt-1 shrink-0 z-20">
          <input
            className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            type="checkbox"
            checked={isSelected}
            disabled={isOOS}
            onChange={() => toggleItemSelected(item.id)}
            aria-label={`Chọn ${item.name} để thanh toán`}
          />
        </div>
        <div className="flex-shrink-0 w-32 h-32 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center p-4">
          <img
            className="object-contain w-full h-full mix-blend-multiply"
            src={item.image}
            alt={item.name}
          />
        </div>
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3
                className="text-lg font-bold text-on-surface cursor-pointer hover:text-primary transition-colors"
                onClick={() => navigate(`/product/${item.slug || item.id}`)}
              >
                {item.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                SKU: PP-ITM-{item.id}
              </p>
              <div className="mt-2">
                <StockBadge stock={stock} outOfStock={isOOS} variant="detail" />
              </div>
            </div>
            <p className="text-lg font-bold text-primary">{item.price || item.newPrice}</p>
          </div>
          {!isOOS && (
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Số lượng {stock > 0 ? `(tối đa ${stock})` : ""}
                </span>
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-4 py-2 hover:bg-surface-container-highest transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={atMax}
                    className={`px-4 py-2 hover:bg-surface-container-highest transition-colors font-bold ${atMax ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-on-surface-variant">Thành tiền</p>
                <p className="text-base font-bold text-on-surface">
                  {formatPrice(itemTotal)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => handleRemove(item.id)}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors"
          >
            <Trash2 size={20} />
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT (< md)
      ══════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden">
        <main className="px-4 pt-4 pb-56 space-y-4">
          {/* Login CTA */}
          {!user && (
            <div className="bg-primary-container/10 p-4 rounded-xl flex items-center justify-between border border-primary/20">
              <div className="flex items-center gap-2">
                <User size={20} className="text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-on-surface">
                    Đăng nhập để nhận ưu đãi
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Tích điểm và sử dụng voucher cá nhân
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="text-primary font-bold text-sm px-4 py-1.5 border border-primary rounded-lg active:scale-95 transition-transform shrink-0"
              >
                Đăng nhập
              </button>
            </div>
          )}

          {/* Selection bar (mobile) */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex items-center justify-between border border-outline-variant/30">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                className="w-5 h-5 rounded border-outline text-primary accent-primary cursor-pointer"
                type="checkbox"
                checked={selectAllChecked}
                onChange={toggleSelectAll}
                disabled={selectableItems.length === 0}
              />
              <span className="text-sm font-semibold">
                Chọn tất cả ({selectedItems.length}/{selectableItems.length})
              </span>
            </label>
            <button
              type="button"
              onClick={handleRemoveSelected}
              disabled={selectedItems.length === 0}
              className="text-error text-xs font-semibold disabled:opacity-40"
            >
              Xóa đã chọn
            </button>
          </div>

          {/* Product Cards */}
          <div className="space-y-3">
            {localCart.map((item) => (
              <CartItemCard key={item.id} item={item} mobile={true} />
            ))}
          </div>

          {/* Upsell Horizontal Scroll */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Mua kèm tiết kiệm hơn
              </h2>
              <span className="text-primary text-xs font-bold">Xem tất cả</span>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
              style={{ scrollbarWidth: "none" }}
            >
              {crossSellProducts.map((prod) => {
                const added = localCart.some((i) => i.id === prod.id);
                const cStock = resolveProductStock(prod);
                const cOos = cStock <= 0;
                return (
                  <div
                    key={prod.id}
                    className="min-w-[136px] w-36 bg-white rounded-xl p-2 shadow-sm border border-outline-variant flex flex-col gap-1 flex-shrink-0"
                  >
                    <div className="w-full aspect-square bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center mb-1">
                      <img
                        className={`w-20 h-20 object-contain ${cOos ? "opacity-50 grayscale" : ""}`}
                        src={prod.image}
                        alt={prod.name}
                      />
                    </div>
                    <h4 className="text-xs font-semibold line-clamp-1 text-on-surface">
                      {prod.name}
                    </h4>
                    <StockBadge stock={cStock} outOfStock={cOos} variant="inline" showIcon={false} />
                    <p className="text-primary font-bold text-sm">
                      {prod.price}
                    </p>
                    <button
                      onClick={() => handleAddCrossSell(prod)}
                      disabled={added || cOos}
                      className={`w-full py-1.5 border rounded-lg text-xs font-bold active:scale-95 transition-all ${added || cOos ? "border-outline-variant text-on-surface-variant cursor-not-allowed" : "border-primary text-primary hover:bg-primary/10"}`}
                    >
                      {cOos ? "Hết hàng" : added ? "Đã thêm" : "Thêm"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Voucher */}
          <div className="bg-surface-container rounded-xl p-4 flex items-center justify-between border border-dashed border-outline">
            <div className="flex items-center gap-2">
              <Tag size={20} className="text-primary shrink-0" />
              <span className="text-sm font-semibold text-on-surface">
                Mã giảm giá Pink Voucher
              </span>
            </div>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline shrink-0">
              Chọn ngay <ChevronRight size={16} />
            </button>
          </div>
        </main>

        {/* Sticky Bottom Payment Bar (Mobile only) */}
        <footer className="fixed bottom-0 left-0 right-0 w-full bg-surface shadow-[0_-4px_15px_rgba(214,51,108,0.12)] z-50 p-4">
          <div className="space-y-3">
            <div className="space-y-1.5 border-b border-outline-variant pb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">
                  Tạm tính ({selectedItems.length} sản phẩm):
                </span>
                <span className="text-on-surface font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Giảm giá:</span>
                  <span className="text-error font-semibold">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Phí vận chuyển:</span>
                <span className="text-on-surface-variant italic text-xs">
                  Tính tại bước thanh toán
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1">
                <span className="text-xs text-on-surface-variant">
                  Tổng cộng
                </span>
                <span className="text-primary font-extrabold text-2xl leading-tight">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="flex-1 bg-primary-container text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg hover:bg-primary disabled:opacity-50"
              >
                <span>Thanh toán</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP LAYOUT (>= md) — 2-column 70/30 grid
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <main className="max-w-[1200px] mx-auto px-6 pt-5 pb-10 min-h-screen">
          {/* Login CTA */}
          {!user && (
            <div className="bg-primary-fixed/30 border border-primary-fixed p-4 rounded-lg mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="text-primary" size={24} />
                <p className="text-sm font-semibold text-on-surface">
                  Đăng nhập để nhận thêm nhiều ưu đãi và đồng bộ giỏ hàng.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="text-primary font-bold text-sm hover:underline shrink-0"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Breadcrumb */}
          <nav className="flex text-sm font-semibold text-on-surface-variant mb-4 items-center gap-1">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={16} />
            <span className="text-primary font-bold">Giỏ hàng</span>
          </nav>

          <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-8">
            Giỏ hàng của bạn
          </h1>

          <div className="grid grid-cols-10 gap-6 items-start">
            {/* Left Column (70%) */}
            <div className="col-span-7 space-y-4">
              {/* Selection Bar */}
              <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm flex items-center justify-between border border-outline-variant/30">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary cursor-pointer"
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={toggleSelectAll}
                    disabled={selectableItems.length === 0}
                  />
                  <span className="text-sm font-semibold">
                    Chọn tất cả ({selectedItems.length}/{selectableItems.length} sản phẩm)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                  className="text-error text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} /> Xóa sản phẩm đã chọn
                </button>
              </div>

              {/* Product Cards */}
              {localCart.map((item) => (
                <CartItemCard key={item.id} item={item} mobile={false} />
              ))}

              {/* Promotions */}
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="text-primary" size={24} />
                  <h4 className="text-2xl font-semibold text-on-surface">
                    Khuyến mãi hấp dẫn
                  </h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      icon: (
                        <Gift className="text-primary shrink-0" size={24} />
                      ),
                      text: "Tặng ngay Ốp lưng Clear Case & Sạc nhanh 45W",
                    },
                    {
                      icon: (
                        <CreditCard
                          className="text-primary shrink-0"
                          size={24}
                        />
                      ),
                      text: "Giảm thêm 500.000đ khi thanh toán qua ví PinkPay",
                    },
                    {
                      icon: (
                        <ShieldCheck
                          className="text-primary shrink-0"
                          size={24}
                        />
                      ),
                      text: "Tặng gói bảo hành rơi vỡ 12 tháng tại hệ thống",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-primary-fixed/30 border border-primary-fixed flex items-start gap-4 hover:-translate-y-1 transition-transform"
                    >
                      {item.icon}
                      <p className="text-sm font-semibold text-on-surface">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PinkCare+ */}
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0">
                    <Shield
                      className="text-secondary"
                      size={24}
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">
                      Bảo hành mở rộng PinkCare+
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Bảo vệ tối đa cho chiếc PinkPhone của bạn trước mọi sự cố.
                    </p>
                  </div>
                </div>
                <button className="border-2 border-primary text-primary px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all active:scale-95 whitespace-nowrap ml-2">
                  Chọn gói
                </button>
              </div>

              {/* Upsell Grid */}
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30">
                <h4 className="text-2xl font-semibold text-on-surface mb-6">
                  Mua kèm tiết kiệm hơn
                </h4>
                <div className="grid grid-cols-3 gap-6">
                  {crossSellProducts.map((prod) => {
                    const added = localCart.some((i) => i.id === prod.id);
                    const cStock = resolveProductStock(prod);
                    const cOos = cStock <= 0;
                    return (
                      <div
                        key={prod.id}
                        className="flex flex-col items-center p-4 border border-outline-variant/30 rounded-lg group hover:border-primary hover:shadow-md transition-all bg-white"
                      >
                        <div className="w-24 h-24 mb-3">
                          <img
                            className={`object-contain w-full h-full ${cOos ? "opacity-50 grayscale" : ""}`}
                            src={prod.image}
                            alt={prod.name}
                          />
                        </div>
                        <p className="text-sm font-semibold text-center mb-1 text-on-surface group-hover:text-primary transition-colors">
                          {prod.name}
                        </p>
                        <StockBadge stock={cStock} outOfStock={cOos} className="mb-2" />
                        <p className="text-primary font-bold text-base">
                          {prod.price}
                        </p>
                        <p className="text-xs text-on-surface-variant line-through mb-4">
                          {prod.oldPrice}
                        </p>
                        <button
                          onClick={() => handleAddCrossSell(prod)}
                          disabled={added || cOos}
                          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${added || cOos ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : "bg-surface-container-low text-primary hover:bg-primary-fixed"}`}
                        >
                          {cOos ? "Hết hàng" : added ? "Đã thêm" : "Thêm ngay"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (30%) — Sticky Summary */}
            <div className="col-span-3">
              <div className="sticky top-[100px] space-y-4">
                {/* Voucher Selection & Application Block */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="text-primary" size={20} />
                      <h4 className="text-sm font-bold text-on-surface">
                        Mã giảm giá / Voucher của bạn
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded-full">
                      {vouchersLoading ? "..." : availableVouchers.length} mã khả dụng
                    </span>
                  </div>

                  {/* Manual Code Input */}
                  <div className="flex gap-2">
                    <input
                      className="flex-grow border border-outline-variant/80 rounded-lg text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary p-2.5 outline-none bg-white"
                      placeholder="Nhập mã giảm giá..."
                      type="text"
                      value={inputCouponCode}
                      onChange={(e) => {
                        setInputCouponCode(e.target.value.toUpperCase());
                        setVoucherError(null);
                      }}
                    />
                    <button
                      onClick={() => handleApplyManualCode(inputCouponCode)}
                      className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-secondary transition-all active:scale-95 whitespace-nowrap shadow-sm"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {/* Error / Warning Alert */}
                  {voucherError && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 border border-rose-200">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{voucherError}</span>
                    </div>
                  )}

                  {/* User's Available Vouchers List for Direct Selection */}
                  <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                    <p className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider">
                      Chọn mã để trừ tiền trực tiếp:
                    </p>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {availableVouchers.map((v) => {
                        const isSelected = selectedVoucherCode === v.code;
                        const isEligible =
                          !v.minimumOrderValue ||
                          subtotal >= v.minimumOrderValue;

                        let estimatedDisc = 0;
                        if (v.type === "PERCENT") {
                          estimatedDisc = (subtotal * v.discountValue) / 100;
                          if (
                            v.maximumDiscountAmount &&
                            estimatedDisc > v.maximumDiscountAmount
                          ) {
                            estimatedDisc = v.maximumDiscountAmount;
                          }
                        } else {
                          estimatedDisc = v.discountValue;
                        }

                        return (
                          <div
                            key={v.id}
                            onClick={() => {
                              if (isEligible) {
                                if (isSelected) {
                                  applyVoucher(null);
                                  setInputCouponCode("");
                                } else {
                                  applyVoucher(toStoreVoucher(v));
                                  setInputCouponCode(v.code);
                                }
                                setVoucherError(null);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? "border-primary bg-pink-50/70 ring-2 ring-primary/20 shadow-sm"
                                : !isEligible
                                  ? "border-outline-variant/30 bg-slate-50 opacity-50 cursor-not-allowed"
                                  : "border-outline-variant/60 bg-white hover:border-primary/60 hover:bg-pink-50/20"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="radio"
                                checked={isSelected}
                                disabled={!isEligible}
                                readOnly
                                className="w-4 h-4 accent-primary shrink-0 cursor-pointer"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono text-xs font-black text-primary bg-white px-2 py-0.5 rounded border border-primary/30 shrink-0">
                                    {v.code}
                                  </span>
                                  <span className="text-xs font-bold text-on-surface truncate">
                                    {v.name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-1">
                                  {v.description}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-rose-600 block">
                                -{estimatedDisc.toLocaleString("vi-VN")}đ
                              </span>
                              {isSelected ? (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                  Đã áp dụng
                                </span>
                              ) : !isEligible ? (
                                <span className="text-[10px] font-semibold text-gray-400">
                                  Chưa đủ điều kiện
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-primary hover:underline">
                                  Chọn mã
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30">
                  <h4 className="text-sm font-bold text-on-surface mb-4">
                    Thông tin nhận hàng
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Giao hàng tận nơi",
                        sub: "Dự kiến nhận 1-3 ngày",
                        defaultChecked: true,
                      },
                      {
                        label: "Nhận tại cửa hàng",
                        sub: "Miễn phí, có hàng sau 2h",
                        defaultChecked: false,
                      },
                    ].map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-center gap-4 p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-fixed/20"
                      >
                        <input
                          defaultChecked={opt.defaultChecked}
                          className="w-4 h-4 accent-primary"
                          name="delivery"
                          type="radio"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {opt.label}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {opt.sub}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30">
                  <h4 className="text-sm font-bold text-on-surface mb-6">
                    Tóm tắt đơn hàng
                  </h4>
                  <div className="space-y-4 border-b border-outline-variant/30 pb-4 mb-4">
                    <div className="flex justify-between text-base">
                      <span className="text-on-surface-variant">
                        Tạm tính ({selectedItems.length} sản phẩm)
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-base">
                        <span className="text-on-surface-variant">
                          Giảm giá trực tiếp
                        </span>
                        <span className="text-error">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-base">
                      <span className="text-on-surface-variant">
                        Phí bảo hành
                      </span>
                      <span>0 ₫</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-lg font-bold text-on-surface">
                      Tổng tiền
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary leading-tight">
                        {formatPrice(total)}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        (Đã bao gồm VAT)
                      </p>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 mb-6 cursor-pointer">
                    <input
                      className="mt-1 flex-shrink-0 w-4 h-4 rounded border-outline accent-primary"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="text-xs text-on-surface-variant leading-relaxed">
                      Tôi đã đọc và đồng ý với{" "}
                      <Link
                        to="/"
                        className="text-primary hover:underline font-medium"
                      >
                        Điều khoản & Điều kiện
                      </Link>{" "}
                      mua hàng tại PinkPhone.
                    </span>
                  </label>
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className="w-full bg-primary-container text-white py-4 rounded-lg text-lg font-bold mb-4 hover:bg-primary transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedItems.length === 0
                      ? "CHỌN SẢN PHẨM ĐỂ THANH TOÁN"
                      : `TIẾN HÀNH THANH TOÁN (${selectedItems.length})`}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full border-2 border-primary text-primary py-2 rounded-lg text-sm font-semibold hover:bg-primary-fixed/20 transition-all active:scale-95"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cart;
