import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// ─── Mock Data ────────────────────────────────────────────────────────
const crossSellProducts = [
  {
    id: 401,
    name: "Ốp lưng Silicon Pink",
    price: "290.000đ",
    oldPrice: "450.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgVhGrTK8FAjbxpVELgY1Cgsbve3cEeK0qvbkku93xHrqZNUlrv-e_6yC1pkhGqKuMxqZ5Tqfc6NhD37tNlTNYHoR0mG6w0PUmll_O1q9L71mFCiz_-rpthmMYdawLkyd7f0V9KTcQIyHa5OswtJf0y5G4cBaGr2MWUq3ptq9Pxx06uo9mxL7YeJEZWoX2Fx8yzkzIM2ekKHWAx_1TJq2Kb5KYfpkgtYhVCXg--332FbdEjZvmPWP",
  },
  {
    id: 402,
    name: "Sạc nhanh 65W GaN",
    price: "650.000đ",
    oldPrice: "890.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCunfUrU13C6tq00FdY5aWre5hMKH46czzbmgu4DLTohnidabBtcx1zEhkeB_3oQqRvuuJXFMhzTKMt4j5LUSBpEIhhytX5yCweheH0piaaYsvLgJJaTcUBy9clH9jsh-pWeCciNAh7Cycf-mazYMzWX_aZOvcTkah_aHs3Uz-H7CCp_4GkZMHrLVQJK_VhSvdbF2RNVxvYB-CKkb9ZMcciRS9JSJ8s19_FOCCcNsUQQH5St8S7JDGo",
  },
  {
    id: 403,
    name: "PinkBuds Pro 2",
    price: "1.890.000đ",
    oldPrice: "2.490.000đ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUxChAtL4xh8TI_w6o3eSdgzd-uvCDECMs0XYNiZvHWSCveeM7YVo3CNX9ntmfTXktU9E7IeJ76bHt8K_a_wQgYXjoNsaMqsvbaeeOoGIaU4wen1In2SZjpyHyUeMnX29pZFLybX33h9BpodwuJ2-KEixkIy6ezbzNzddvwyOnO-GgU2630aGj7H6lN037ysIUgpCJVpPbJhYjRskrw6RDzW_xRuakRDAgOb8UDsdB6cDe9WaAVFLY",
  },
];

// ─── Cart Component ───────────────────────────────────────────────────
const Cart = () => {
  const { user, cart, removeFromCart, updateCartQuantity, addToCart } =
    useStore();
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    setLocalCart(cart.map((item) => ({ ...item, active: true })));
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
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
    updateCartQuantity(id, newQty);
  };

  const handleAddCrossSell = (prod: (typeof crossSellProducts)[0]) => {
    if (!localCart.some((item) => item.id === prod.id)) {
      const newItem: CartItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: 1,
        active: true,
      };
      setLocalCart((prev) => [...prev, newItem]);
      addToCart(newItem);
    }
  };

  const activeItems = localCart.filter((item) => !item.outOfStock);

  const subtotal = activeItems.reduce((acc, item) => {
    const priceStr = item.price || item.newPrice || "0đ";
    return acc + parseInt(priceStr.replace(/\D/g, "") || "0") * item.quantity;
  }, 0);

  const discountAmount = subtotal > 10000000 ? 2000000 : 0;
  const total = subtotal - discountAmount;

  const formatPrice = (num: number) => num.toLocaleString("vi-VN") + " ₫";

  const handleCheckout = () => {
    if (activeItems.length > 0) navigate("/checkout");
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
    const isOOS = !!item.outOfStock;

    if (mobile) {
      return (
        <div
          className={`bg-surface-container-lowest rounded-xl p-4 flex flex-col shadow-[0_4px_10px_rgba(214,51,108,0.08)] relative overflow-hidden transition-all ${isOOS ? "opacity-60 grayscale" : ""}`}
        >
          {isOOS && (
            <div className="absolute inset-0 bg-surface-dim/20 z-10 flex items-center justify-center">
              <span className="bg-on-surface/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Hết hàng
              </span>
            </div>
          )}
          <div className="flex gap-3">
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
              <p className="text-primary font-bold text-base">{item.price}</p>
            </div>
          </div>
          {!isOOS && (
            <div className="mt-3 pt-3 border-t border-outline-variant flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Số lượng
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
                    className="w-8 h-8 flex items-center justify-center text-primary active:scale-90 transition-all hover:bg-primary/10 rounded-md"
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
        className={`bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30 flex gap-6 relative transition-all group hover:border-primary/50 ${isOOS ? "opacity-60 grayscale" : ""}`}
      >
        {isOOS && (
          <div className="absolute inset-0 bg-surface-dim/20 z-10 flex items-center justify-center rounded-lg">
            <span className="bg-on-surface/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Hết hàng
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <input
            className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary"
            type="checkbox"
            checked={selectAll}
            readOnly
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
            </div>
            <p className="text-lg font-bold text-primary">{item.price}</p>
          </div>
          {!isOOS && (
            <div className="flex items-center justify-between mt-auto">
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
                  className="px-4 py-2 hover:bg-surface-container-highest transition-colors font-bold"
                >
                  +
                </button>
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
                return (
                  <div
                    key={prod.id}
                    className="min-w-[136px] w-36 bg-white rounded-xl p-2 shadow-sm border border-outline-variant flex flex-col gap-1 flex-shrink-0"
                  >
                    <div className="w-full aspect-square bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center mb-1">
                      <img
                        className="w-20 h-20 object-contain"
                        src={prod.image}
                        alt={prod.name}
                      />
                    </div>
                    <h4 className="text-xs font-semibold line-clamp-1 text-on-surface">
                      {prod.name}
                    </h4>
                    <p className="text-primary font-bold text-sm">
                      {prod.price}
                    </p>
                    <button
                      onClick={() => handleAddCrossSell(prod)}
                      disabled={added}
                      className={`w-full py-1.5 border rounded-lg text-xs font-bold active:scale-95 transition-all ${added ? "border-outline-variant text-on-surface-variant cursor-not-allowed" : "border-primary text-primary hover:bg-primary/10"}`}
                    >
                      {added ? "Đã thêm" : "Thêm"}
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
                  Tạm tính ({activeItems.length} sản phẩm):
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
                disabled={activeItems.length === 0}
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
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary accent-primary"
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                  />
                  <span className="text-sm font-semibold">
                    Chọn tất cả ({activeItems.length} sản phẩm)
                  </span>
                </label>
                <button className="text-error text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
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
                    return (
                      <div
                        key={prod.id}
                        className="flex flex-col items-center p-4 border border-outline-variant/30 rounded-lg group hover:border-primary hover:shadow-md transition-all bg-white"
                      >
                        <div className="w-24 h-24 mb-4">
                          <img
                            className="object-contain w-full h-full"
                            src={prod.image}
                            alt={prod.name}
                          />
                        </div>
                        <p className="text-sm font-semibold text-center mb-1 text-on-surface group-hover:text-primary transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-primary font-bold text-base">
                          {prod.price}
                        </p>
                        <p className="text-xs text-on-surface-variant line-through mb-4">
                          {prod.oldPrice}
                        </p>
                        <button
                          onClick={() => handleAddCrossSell(prod)}
                          disabled={added}
                          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${added ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : "bg-surface-container-low text-primary hover:bg-primary-fixed"}`}
                        >
                          {added ? "Đã thêm" : "Thêm ngay"}
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
                {/* Voucher */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="text-primary" size={20} />
                    <h4 className="text-sm font-bold text-on-surface">
                      Mã giảm giá / Voucher
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-grow border-outline-variant rounded-lg text-base focus:ring-primary focus:border-primary p-2 border outline-none"
                      placeholder="Nhập mã..."
                      type="text"
                    />
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary transition-all active:scale-95 whitespace-nowrap">
                      Áp dụng
                    </button>
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
                        Tạm tính ({activeItems.length} sản phẩm)
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
                    className="w-full bg-primary-container text-white py-4 rounded-lg text-lg font-bold mb-4 hover:bg-primary transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    TIẾN HÀNH THANH TOÁN
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
