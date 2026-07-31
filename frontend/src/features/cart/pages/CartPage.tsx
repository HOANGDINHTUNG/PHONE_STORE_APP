import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  CircleUserRound,
  Gift,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";

type CartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  oldPrice?: number;
  imageIndex: number;
};

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "PinkPhone Ultra X 2024",
    variant: "12GB · 256GB · Hồng",
    price: 28_490_000,
    oldPrice: 32_990_000,
    imageIndex: 4,
  },
  {
    id: 2,
    name: "PinkPhone Lite S",
    variant: "8GB · 128GB · Trắng",
    price: 12_490_000,
    imageIndex: 0,
  },
];

export function CartPage() {
  const [items, setItems] = useState(initialItems);
  const [quantities, setQuantities] = useState<Record<number, number>>({ 1: 1, 2: 1 });
  const [selected, setSelected] = useState<number[]>([1, 2]);
  const [voucher, setVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [shipping, setShipping] = useState<"delivery" | "pickup">("delivery");
  const [accepted, setAccepted] = useState(false);

  const subtotal = useMemo(
    () =>
      items
        .filter((item) => selected.includes(item.id))
        .reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 1), 0),
    [items, quantities, selected],
  );
  const discount = voucherApplied ? 500_000 : 0;
  const total = Math.max(subtotal - discount, 0);

  const changeQuantity = (id: number, delta: number) => {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(1, Math.min(5, (current[id] ?? 1) + delta)),
    }));
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelected((current) => current.filter((itemId) => itemId !== id));
  };

  const toggleAll = () => {
    setSelected((current) =>
      current.length === items.length ? [] : items.map((item) => item.id),
    );
  };

  return (
    <StorePageLayout title="Giỏ hàng - PinkPhone">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 text-sm font-semibold">
            <CircleUserRound size={20} className="text-primary" />
            Đăng nhập để nhận thêm ưu đãi và đồng bộ giỏ hàng.
          </p>
          <Link to="/dang-nhap" className="text-sm font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>

        <div className="mt-6">
          <Breadcrumbs current="Giỏ hàng" parent="Mua sắm" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Giỏ hàng của bạn
          </h1>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_23rem]">
          <div className="grid gap-5">
            <section className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
                <label className="flex items-center gap-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={selected.length === items.length && items.length > 0}
                    onChange={toggleAll}
                    className="size-4 accent-primary"
                  />
                  Chọn tất cả ({items.length} sản phẩm)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setItems((current) => current.filter((item) => !selected.includes(item.id)));
                    setSelected([]);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-danger hover:underline"
                >
                  <Trash2 size={17} /> Xóa sản phẩm đã chọn
                </button>
              </div>

              {items.length ? (
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <article key={item.id} className="grid gap-4 p-5 sm:grid-cols-[auto_8rem_1fr_auto]">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() =>
                          setSelected((current) =>
                            current.includes(item.id)
                              ? current.filter((id) => id !== item.id)
                              : [...current, item.id],
                          )
                        }
                        className="mt-2 size-4 accent-primary"
                        aria-label={`Chọn ${item.name}`}
                      />
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-soft">
                        <PhoneStripImage index={item.imageIndex} />
                      </div>
                      <div>
                        <h2 className="font-extrabold">{item.name}</h2>
                        <p className="mt-2 text-sm text-muted">{item.variant}</p>
                        <div className="mt-4 inline-flex items-center rounded-xl border border-border">
                          <button
                            type="button"
                            className="grid size-10 place-items-center text-muted hover:text-primary"
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Giảm số lượng ${item.name}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="grid size-10 place-items-center text-sm font-bold">
                            {quantities[item.id] ?? 1}
                          </span>
                          <button
                            type="button"
                            className="grid size-10 place-items-center text-muted hover:text-primary"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Tăng số lượng ${item.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-5 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className="font-extrabold text-primary">
                            {formatCurrency(item.price)}
                          </p>
                          {item.oldPrice && (
                            <p className="mt-1 text-xs text-muted line-through">
                              {formatCurrency(item.oldPrice)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-soft hover:text-primary"
                            aria-label={`Yêu thích ${item.name}`}
                          >
                            <Heart size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-soft hover:text-danger"
                            aria-label={`Xóa ${item.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <ShoppingCart className="mx-auto text-tertiary" size={40} />
                  <p className="mt-4 font-bold">Bạn đã xóa hết sản phẩm</p>
                  <Link to="/" className="mt-2 inline-flex text-sm font-bold text-primary hover:underline">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-xl font-extrabold">Khuyến mãi hấp dẫn</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  [Gift, "Giảm thêm 500.000đ khi thanh toán qua PinkPay"],
                  [ShieldCheck, "Tặng bảo hành rơi vỡ 12 tháng"],
                  [Truck, "Miễn phí giao hàng hỏa tốc nội thành"],
                ].map(([Icon, text]) => {
                  const PromoIcon = Icon as typeof Gift;
                  return (
                    <div key={String(text)} className="flex gap-3 rounded-xl border border-border bg-surface-soft p-4">
                      <PromoIcon size={20} className="shrink-0 text-primary" />
                      <p className="text-sm font-semibold leading-5">{String(text)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <ChevronLeft size={18} /> Tiếp tục mua sắm
            </Link>
          </div>

          <aside className="grid gap-5 lg:sticky lg:top-36">
            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="flex items-center gap-2 font-extrabold">
                <Tag size={19} className="text-primary" /> Mã giảm giá
              </h2>
              <div className="mt-4 flex gap-2">
                <input
                  value={voucher}
                  onChange={(event) => setVoucher(event.target.value)}
                  placeholder="Nhập mã..."
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-primary"
                />
                <Button
                  onClick={() => setVoucherApplied(Boolean(voucher.trim()))}
                  disabled={!voucher.trim()}
                >
                  Áp dụng
                </Button>
              </div>
              {voucherApplied && (
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-success">
                  <Check size={14} /> Đã áp dụng mã giảm 500.000đ
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="font-extrabold">Thông tin nhận hàng</h2>
              <div className="mt-4 grid gap-3">
                <ShippingOption
                  active={shipping === "delivery"}
                  onClick={() => setShipping("delivery")}
                  icon={Truck}
                  title="Giao hàng tận nơi"
                  note="Dự kiến nhận 1–3 ngày"
                />
                <ShippingOption
                  active={shipping === "pickup"}
                  onClick={() => setShipping("pickup")}
                  icon={MapPin}
                  title="Nhận tại cửa hàng"
                  note="Miễn phí, có hàng sau 2h"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-xl font-extrabold">Tóm tắt đơn hàng</h2>
              <dl className="mt-5 grid gap-4 text-sm">
                <SummaryRow label={`Tạm tính (${selected.length} sản phẩm)`} value={formatCurrency(subtotal)} />
                <SummaryRow label="Phí vận chuyển" value="Miễn phí" highlight />
                <SummaryRow label="Giảm giá" value={discount ? `-${formatCurrency(discount)}` : "0đ"} highlight={discount > 0} />
              </dl>
              <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
                <p className="font-extrabold">Tổng tiền</p>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">{formatCurrency(total)}</p>
                  <p className="mt-1 text-xs text-muted">Đã bao gồm VAT</p>
                </div>
              </div>
              <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-muted">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className="mt-0.5 size-4 accent-primary"
                />
                Tôi đồng ý với Điều khoản mua hàng tại PinkPhone.
              </label>
              <Button className="mt-5 w-full" disabled={!accepted || !selected.length}>
                Tiến hành thanh toán
              </Button>
            </section>
          </aside>
        </div>
      </div>
    </StorePageLayout>
  );
}

function ShippingOption({
  active,
  onClick,
  icon: Icon,
  title,
  note,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Truck;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left ${
        active ? "border-primary bg-surface-soft" : "border-border hover:border-primary"
      }`}
    >
      <Icon size={19} className={active ? "text-primary" : "text-muted"} />
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-1 block text-xs text-muted">{note}</span>
      </span>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-semibold ${highlight ? "text-primary" : ""}`}>{value}</dd>
    </div>
  );
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}
