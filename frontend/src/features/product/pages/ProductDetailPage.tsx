import { useEffect, useMemo, useState } from "react";

import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  Cpu,
  Heart,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import {
  formatVnd,
  getProductDetailBySlug,
} from "../../catalog/selectors/catalogSelectors";
import type { ProductImage } from "../../catalog/types/catalog";
import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";
import { fetchProductBySlug } from "../../../api/productService";
import { Product } from "../../../types";

export type ProductAvailability = "available" | "out-of-stock";

type ProductDetailPageProps = {
  availability?: ProductAvailability;
};

export function ProductDetailPage({ availability = "available" }: ProductDetailPageProps) {
  const { slug = "pinkphone-ultra-x-2024" } = useParams();
  const navigate = useNavigate();
  const [variantId, setVariantId] = useState<string>();
  const [activeImageId, setActiveImageId] = useState<string>();
  const [favorite, setFavorite] = useState(false);
  const [notified, setNotified] = useState(false);
  const detail = useMemo(() => getProductDetailBySlug(slug, variantId), [slug, variantId]);
  const firstImageId = detail?.images[0]?.id;

  useEffect(() => {
    setVariantId(undefined);
    setActiveImageId(undefined);
  }, [slug]);

  useEffect(() => {
    setActiveImageId(firstImageId);
  }, [firstImageId]);

  if (!detail) {
    return (
      <StorePageLayout title="Không tìm thấy điện thoại - PinkPhone">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <Smartphone className="mx-auto text-primary" size={52} />
          <h1 className="mt-5 text-3xl font-extrabold">Không tìm thấy điện thoại</h1>
          <p className="mt-3 text-muted">Sản phẩm không tồn tại hoặc hiện không được kinh doanh.</p>
          <Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-6 font-bold text-white">
            Về trang chủ
          </Link>
        </div>
      </StorePageLayout>
    );
  }

  const {
    product,
    brand,
    variants,
    selectedVariant,
    images,
    specifications,
    attributes,
    reviews,
    relatedProducts,
    rating,
    reviewCount,
    availableQuantity,
    effectivePrice,
    discountPercent,
  } = detail;
  const activeImage = images.find((image) => image.id === activeImageId) ?? images[0];
  const storageOptions = unique(variants.map((variant) => variant.storage));
  const colorOptions = unique(variants.map((variant) => variant.color));
  const outOfStock = availability === "out-of-stock" || availableQuantity <= 0;

  const chooseStorage = (storage: string) => {
    const next =
      variants.find((variant) => variant.storage === storage && variant.color === selectedVariant.color) ??
      variants.find((variant) => variant.storage === storage);
    if (next) setVariantId(next.id);
  };

  const chooseColor = (color: string) => {
    const next =
      variants.find((variant) => variant.color === color && variant.storage === selectedVariant.storage) ??
      variants.find((variant) => variant.color === color);
    if (next) setVariantId(next.id);
  };

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug).then((prod) => {
        if (prod) setProductData(prod);
      });
    }
  }, [slug]);

  return (
    <StorePageLayout
      title={outOfStock ? `${product.name} (Hết hàng) - PinkPhone` : `${product.name} - PinkPhone`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Breadcrumbs current={product.name} />


        <section className="mt-6 grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <div className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-card border border-border bg-surface-soft p-5">
              <CatalogImage image={activeImage} className="size-full rounded-2xl object-cover" />

              <button
                type="button"
                onClick={() => setFavorite((value) => !value)}
                className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white text-muted shadow-sm hover:text-primary"
                aria-label={favorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                aria-pressed={favorite}
              >
                <Heart size={20} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageId(image.id)}
                  className={`relative aspect-square overflow-hidden rounded-xl border bg-surface-soft p-1 transition ${
                    activeImage?.id === image.id
                      ? "border-primary ring-2 ring-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                  aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                >
                  <CatalogImage image={image} className="size-full rounded-lg object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <TrustItem
                icon={ShieldCheck}
                title={`Bảo hành ${selectedVariant.warranty_months} tháng`}
                note="Chính hãng toàn quốc"
              />
              <TrustItem icon={RefreshCcw} title="Đổi mới 30 ngày" note="Điều kiện linh hoạt" />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {brand.name} · Smartphone chính hãng
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1 text-warning">
                <Star size={14} fill="currentColor" /> {rating ? `${rating}/5` : "Chưa có đánh giá"}
              </span>
              <span>{reviewCount} đánh giá đã duyệt</span>
              <span>Mã: {selectedVariant.sku}</span>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-soft p-5">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <p className="text-3xl font-extrabold tracking-[-0.03em] text-primary">{formatVnd(effectivePrice)}</p>
                {selectedVariant.sale_price && (
                  <p className="pb-1 text-sm text-muted line-through">{formatVnd(selectedVariant.list_price)}</p>
                )}
                {discountPercent > 0 && (
                  <span className="mb-1 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-white">-{discountPercent}%</span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted">Giá đã gồm VAT. Còn {availableQuantity} sản phẩm khả dụng trên hệ thống.</p>
            </div>

            <OptionGroup label="Chọn bộ nhớ">
              {storageOptions.map((storage) => (
                <OptionButton key={storage} active={selectedVariant.storage === storage} onClick={() => chooseStorage(storage)}>
                  {storage}
                </OptionButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Chọn màu sắc">
              {colorOptions.map((color) => (
                <OptionButton key={color} active={selectedVariant.color === color} onClick={() => chooseColor(color)}>
                  <span className={`size-3 rounded-full border border-border ${colorSwatch(color)}`} />
                  {color}
                </OptionButton>
              ))}
            </OptionGroup>

            <button type="button" className="mt-5 flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm hover:border-primary">
              <span className="flex items-center gap-2"><MapPin size={17} className="text-primary" />Xem kho hàng tại <strong>Hà Nội</strong></span>
              <ChevronDown size={17} />
            </button>

            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <p className="bg-neutral-soft px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-primary">Khuyến mãi hấp dẫn</p>
              <ul className="grid gap-3 p-4 text-sm text-muted">
                <li className="flex gap-2"><Check size={17} className="shrink-0 text-primary" /> Giảm thêm 500.000đ khi thanh toán qua PinkPay.</li>
                <li className="flex gap-2"><Check size={17} className="shrink-0 text-primary" /> Bảo hành chính hãng {selectedVariant.warranty_months} tháng.</li>
                <li className="flex gap-2"><Check size={17} className="shrink-0 text-primary" /> Miễn phí giao hàng hỏa tốc nội thành.</li>
              </ul>
            </div>

            {outOfStock ? (
              <>
                <button type="button" disabled className="mt-5 min-h-12 w-full rounded-xl bg-neutral-soft font-bold text-muted">Hết hàng</button>
                <div className="mt-4 rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="flex items-center gap-2 text-sm font-bold"><Bell size={17} className="text-primary" /> Thông báo khi có hàng</p>
                  <div className="mt-3 flex gap-2">
                    <input type="email" aria-label="Email hoặc số điện thoại" placeholder="Email hoặc số điện thoại" className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary" />
                    <Button onClick={() => setNotified(true)}>{notified ? "Đã đăng ký" : "Gửi yêu cầu"}</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 grid gap-3">
                <Button className="w-full" onClick={() => navigate("/gio-hang")}>Mua ngay</Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">Trả góp 0%</Button>
                  <Button variant="outline" onClick={() => navigate("/gio-hang")}><ShoppingCart size={17} /> Thêm giỏ hàng</Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {attributes.length > 0 && (
          <section className="py-14" aria-labelledby="highlights-title">
            <h2 id="highlights-title" className="text-center text-2xl font-extrabold">Đặc điểm nổi bật</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {attributes.map((attribute, index) => (
                <Highlight key={attribute.id} icon={[Smartphone, Camera, Cpu][index % 3]} title={attribute.attribute_value} copy={product.short_description} />
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-8 pb-14 lg:grid-cols-[1fr_22rem]" aria-labelledby="details-title">
          <article>
            <h2 id="details-title" className="text-2xl font-extrabold">Đánh giá chi tiết {product.name}</h2>
            <div className="mt-5 rounded-2xl bg-surface-soft p-5">
              <p className="text-sm font-bold">Tổng quan sản phẩm</p>
              <p className="mt-3 text-sm leading-7 text-muted">{product.short_description}</p>
            </div>
            <h3 className="mt-7 text-lg font-bold">Thiết kế và trải nghiệm</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{product.description}</p>
            {images[1] && <CatalogImage image={images[1]} className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />}
          </article>

          <aside className="h-fit rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-36">
            <h2 className="text-lg font-extrabold">Thông số kỹ thuật</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              {specifications.length ? specifications.map((specification) => (
                <Spec key={specification.id} label={specification.spec_name} value={specification.spec_value} />
              )) : <p className="text-sm text-muted">Thông số đang được cập nhật.</p>}
              <Spec label="RAM / Bộ nhớ" value={`${selectedVariant.ram} / ${selectedVariant.storage}`} />
            </dl>
          </aside>
        </section>

        {relatedProducts.length > 0 && (
          <section className="pb-14" aria-labelledby="similar-title">
            <h2 id="similar-title" className="text-2xl font-extrabold">Điện thoại tương tự</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link key={related.id} to={`/san-pham/${related.slug}`} className="rounded-2xl border border-border bg-white p-3 transition hover:border-primary hover:shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft">
                    {related.imageIndex === undefined ? <img src={related.imageUrl} alt={related.imageAlt} className="size-full object-cover" /> : <PhoneStripImage index={related.imageIndex} alt={related.imageAlt} />}
                  </div>
                  <h3 className="mt-3 text-sm font-bold">{related.name}</h3>
                  <p className="mt-1 text-sm font-extrabold text-primary">{related.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 rounded-card border border-border bg-white p-6" aria-labelledby="reviews-title">
          <div className="grid gap-7 md:grid-cols-[15rem_1fr]">
            <div className="rounded-2xl bg-surface-soft p-5 text-center">
              <h2 id="reviews-title" className="text-sm font-bold">Đánh giá sản phẩm</h2>
              <p className="mt-4 text-4xl font-extrabold text-primary">{rating ? `${rating}/5` : "—"}</p>
              <p className="mt-2 text-warning">★★★★★</p>
              <p className="mt-1 text-xs text-muted">{reviewCount} đánh giá đã duyệt</p>
              <Button className="mt-5 w-full">Viết đánh giá</Button>
            </div>
            <div className="divide-y divide-border">
              {reviews.length ? reviews.map((review) => (
                <article key={review.id} className="py-4 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-bold">{review.customer_name}</p><p className="mt-1 text-xs text-success">Đã mua hàng</p></div>
                    <time className="text-xs text-muted">{new Intl.DateTimeFormat("vi-VN").format(new Date(review.created_at))}</time>
                  </div>
                  <p className="mt-3 text-warning">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                </article>
              )) : <p className="text-sm text-muted">Chưa có đánh giá nào được duyệt.</p>}
            </div>
          </div>
        </section>
      </div>
    </StorePageLayout>
  );
}

function CatalogImage({ image, className }: { image?: ProductImage; className: string }) {
  if (!image) return <Smartphone className="text-tertiary" size={64} aria-label="Chưa có ảnh sản phẩm" />;
  if (image.mock_sprite_index !== undefined) {
    return <PhoneStripImage index={image.mock_sprite_index} alt={image.alt_text} className={className} />;
  }
  return <img src={image.image_url} alt={image.alt_text} className={className} />;
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function colorSwatch(color: string) {
  if (color.includes("Hồng")) return "bg-secondary";
  if (color.includes("Trắng")) return "bg-white";
  if (color.includes("Đen") || color.includes("titan")) return "bg-foreground";
  if (color.includes("Xanh")) return "bg-sky-200";
  if (color.includes("Xám")) return "bg-neutral-400";
  if (color.includes("Nâu")) return "bg-amber-700";
  return "bg-orange-400";
}

type IconComponent = typeof ShieldCheck;

function TrustItem({ icon: Icon, title, note }: { icon: IconComponent; title: string; note: string }) {
  return <div className="flex items-center gap-3 rounded-xl bg-surface-soft p-4"><Icon size={20} className="shrink-0 text-primary" /><div><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[11px] text-muted">{note}</p></div></div>;
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <fieldset className="mt-5"><legend className="mb-2 text-sm font-bold">{label}</legend><div className="flex flex-wrap gap-2">{children}</div></fieldset>;
}

function OptionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-4 text-xs font-semibold ${active ? "border-primary bg-surface-soft text-primary" : "border-border bg-white hover:border-primary"}`}>{children}</button>;
}

function Highlight({ icon: Icon, title, copy }: { icon: IconComponent; title: string; copy: string }) {
  return <article className="rounded-2xl border border-border bg-surface-soft p-6 first:bg-white"><Icon size={23} className="text-primary" /><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{copy}</p></article>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-border pb-3 last:border-0"><dt className="text-muted">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>;
}
