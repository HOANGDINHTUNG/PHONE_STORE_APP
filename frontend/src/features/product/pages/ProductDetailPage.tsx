import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import heroImage from "../../../assets/pinkphone-hero.png";
import authImage from "../../../assets/pinkphone-auth.png";
import { Button } from "../../../shared/components/Button";
import { Breadcrumbs } from "../../storefront/components/Breadcrumbs";
import { PhoneStripImage } from "../../storefront/components/PhoneStripImage";
import { StorePageLayout } from "../../storefront/components/StorePageLayout";
import { fetchProductBySlug } from "../../../api/productService";
import { useStore } from "../../../context/StoreContext";
import { Product } from "../../../types";

export type ProductAvailability = "available" | "out-of-stock";

type ProductDetailPageProps = {
  availability?: ProductAvailability;
};

const storageOptions = ["128GB", "256GB", "512GB"];
const colorOptions = [
  { name: "Hồng", swatch: "bg-secondary" },
  { name: "Trắng", swatch: "bg-white" },
  { name: "Đen", swatch: "bg-foreground" },
];

export function ProductDetailPage({
  availability = "available",
}: ProductDetailPageProps) {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const { toggleWishlist, isInWishlist } = useStore();
  const [productData, setProductData] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [notified, setNotified] = useState(false);
  const outOfStock = availability === "out-of-stock";

  const isFavorite = productData ? isInWishlist(productData.id) : false;

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug).then((prod) => {
        if (prod) {
          setProductData(prod);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariantIndex(0);
            setMainImage(prod.variants[0].image || prod.image);
          } else {
            setMainImage(prod.image);
          }
        }
      });
    }
  }, [slug]);

  const handleSelectVariant = (index: number) => {
    if (!productData || !productData.variants || !productData.variants[index]) return;
    const variant = productData.variants[index];
    setSelectedVariantIndex(index);
    if (variant.image) {
      setMainImage(variant.image);
    }
  };

  return (
    <StorePageLayout
      title={
        availability === "out-of-stock"
          ? "Chi tiết sản phẩm (Hết hàng) - PinkPhone"
          : "Chi tiết sản phẩm - PinkPhone"
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Breadcrumbs current={productData?.name || "PinkPhone Ultra X 2024"} />

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <div className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-card border border-border bg-surface-soft p-5">
              <img
                src={mainImage || productData?.image || heroImage}
                alt={productData?.name || "PinkPhone Ultra X 2024"}
                className="size-full rounded-2xl object-cover"
              />
              <button
                type="button"
                onClick={() => productData && toggleWishlist(productData)}
                className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white text-muted shadow-sm hover:text-primary transition-colors"
                aria-label={
                  isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"
                }
                aria-pressed={isFavorite}
              >
                <Heart
                  size={20}
                  className={isFavorite ? "fill-primary text-primary" : "text-muted"}
                />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {[
                productData?.image || heroImage,
                authImage,
                heroImage,
                authImage,
              ].map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`aspect-square overflow-hidden rounded-xl border bg-surface-soft p-1 transition ${
                    index === 0
                      ? "border-primary ring-2 ring-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                  aria-label={`Xem ảnh sản phẩm ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="size-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <TrustItem
                icon={ShieldCheck}
                title="Bảo hành 12 tháng"
                note="Lỗi là đổi mới"
              />
              <TrustItem
                icon={RefreshCcw}
                title="Đổi mới 30 ngày"
                note="Điều kiện linh hoạt"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {productData?.brand || "Smartphone cao cấp · 2024"}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              {productData?.name || "PinkPhone Ultra X 2024"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1 text-warning">
                <Star size={14} fill="currentColor" /> 4.9/5
              </span>
              <span>128 đánh giá</span>
              <span>Mã: PPU-X24</span>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-soft p-5">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <p className="text-3xl font-extrabold tracking-[-0.03em] text-primary">
                  28.490.000đ
                </p>
                <p className="pb-1 text-sm text-muted line-through">
                  32.990.000đ
                </p>
                <span className="mb-1 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-white">
                  -14%
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Giá đã gồm VAT và miễn phí giao hàng toàn quốc.
              </p>
            </div>

            <OptionGroup label="Chọn bộ nhớ">
              {storageOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={storage === option}
                  onClick={() => setStorage(option)}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionGroup>

            <OptionGroup label="Chọn màu sắc">
              {colorOptions.map((option) => (
                <OptionButton
                  key={option.name}
                  active={color === option.name}
                  onClick={() => setColor(option.name)}
                >
                  <span
                    className={`size-3 rounded-full border border-border ${option.swatch}`}
                  />
                  {option.name}
                </OptionButton>
              ))}
            </OptionGroup>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm hover:border-primary"
            >
              <span className="flex items-center gap-2">
                <MapPin size={17} className="text-primary" />
                Xem kho hàng tại <strong>Hà Nội</strong>
              </span>
              <ChevronDown size={17} />
            </button>

            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <p className="bg-neutral-soft px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-primary">
                Khuyến mãi hấp dẫn
              </p>
              <ul className="grid gap-3 p-4 text-sm text-muted">
                <li className="flex gap-2">
                  <Check size={17} className="shrink-0 text-primary" /> Giảm
                  thêm 500.000đ khi thanh toán qua PinkPay.
                </li>
                <li className="flex gap-2">
                  <Check size={17} className="shrink-0 text-primary" /> Tặng gói
                  bảo hành rơi vỡ 12 tháng.
                </li>
                <li className="flex gap-2">
                  <Check size={17} className="shrink-0 text-primary" /> Miễn phí
                  giao hàng hỏa tốc nội thành.
                </li>
              </ul>
            </div>

            {outOfStock ? (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-5 min-h-12 w-full rounded-xl bg-neutral-soft font-bold text-muted"
                >
                  Hết hàng
                </button>
                <div className="mt-4 rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <Bell size={17} className="text-primary" /> Thông báo khi có
                    hàng
                  </p>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="email"
                      placeholder="Email hoặc số điện thoại"
                      className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary"
                    />
                    <Button onClick={() => setNotified(true)}>
                      {notified ? "Đã đăng ký" : "Gửi yêu cầu"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 grid gap-3">
                <Button className="w-full" onClick={() => navigate("/cart")}>
                  Mua ngay
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">Trả góp 0%</Button>
                  <Button variant="outline" onClick={() => navigate("/cart")}>
                    <ShoppingCart size={17} /> Thêm giỏ hàng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-14" aria-labelledby="highlights-title">
          <h2
            id="highlights-title"
            className="text-center text-2xl font-extrabold"
          >
            Đặc điểm nổi bật
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Highlight
              icon={Smartphone}
              title='PinkDisplay 6.7"'
              copy="Tần số quét 120Hz, màu sắc rực rỡ và độ sáng cao."
            />
            <Highlight
              icon={Camera}
              title="Hệ thống Camera AI"
              copy="Cảm biến chính 108MP cho ảnh sắc nét trong mọi điều kiện."
            />
            <Highlight
              icon={Cpu}
              title="Chip P14 Ultra"
              copy="Hiệu năng vượt trội, tối ưu đa nhiệm nhưng vẫn tiết kiệm pin."
            />
          </div>
        </section>

        <section
          className="grid gap-8 pb-14 lg:grid-cols-[1fr_22rem]"
          aria-labelledby="details-title"
        >
          <article>
            <h2 id="details-title" className="text-2xl font-extrabold">
              Đánh giá chi tiết PinkPhone Ultra X 2024
            </h2>
            <div className="mt-5 rounded-2xl bg-surface-soft p-5">
              <p className="text-sm font-bold">Mục lục</p>
              <ol className="mt-3 grid gap-2 text-sm text-primary">
                <li>1. Thiết kế sang trọng đầy tinh tế</li>
                <li>2. Màn hình rực rỡ sắc nét</li>
                <li>3. Camera 108MP đỉnh cao công nghệ</li>
                <li>4. Thời lượng pin ấn tượng</li>
              </ol>
            </div>
            <h3 className="mt-7 text-lg font-bold">
              1. Thiết kế sang trọng đầy tinh tế
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              PinkPhone Ultra X mang trong mình ngôn ngữ thiết kế tối giản nhưng
              không kém phần sang trọng. Khung viền kim loại cao cấp kết hợp
              cùng mặt lưng kính nhám tạo cảm giác cầm nắm chắc chắn, đồng thời
              hạn chế dấu vân tay.
            </p>
            <img
              src={authImage}
              alt="Thiết kế PinkPhone Ultra X màu hồng"
              className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
            />
            <h3 className="mt-7 text-lg font-bold">
              2. Màn hình rực rỡ sắc nét
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              Màn hình PinkDisplay 6.7 inch hỗ trợ tần số quét 120Hz, mang lại
              chuyển động mượt mà, màu sắc chính xác và khả năng hiển thị rõ
              ràng ngoài trời.
            </p>
          </article>

          <aside className="h-fit rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-36">
            <h2 className="text-lg font-extrabold">Thông số kỹ thuật</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <Spec label="Màn hình" value='6.7", PinkDisplay LTPO 120Hz' />
              <Spec label="Camera sau" value="108MP + 12MP + 12MP" />
              <Spec label="Camera trước" value="32MP" />
              <Spec label="Chipset" value="P14 Ultra AI Process" />
              <Spec label="RAM" value="12GB LPDDR5X" />
              <Spec label="Pin" value="5000mAh, sạc 45W" />
            </dl>
            <Button variant="secondary" className="mt-6 w-full">
              Xem cấu hình chi tiết
            </Button>
          </aside>
        </section>

        <section className="pb-14" aria-labelledby="similar-title">
          <h2 id="similar-title" className="text-2xl font-extrabold">
            Điện thoại tương tự
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["PinkPhone Lite S", "12.490.000đ", 0],
              ["Ultra X Black Edition", "29.490.000đ", 3],
              ["PinkPhone Air", "18.990.000đ", 2],
              ["PinkPhone Max", "24.500.000đ", 4],
            ].map(([name, price, index]) => (
              <article
                key={name}
                className="rounded-2xl border border-border bg-white p-3"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-soft">
                  <PhoneStripImage index={Number(index)} />
                </div>
                <h3 className="mt-3 text-sm font-bold">{name}</h3>
                <p className="mt-1 text-sm font-extrabold text-primary">
                  {price}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mb-10 rounded-card border border-border bg-white p-6"
          aria-labelledby="reviews-title"
        >
          <div className="grid gap-7 md:grid-cols-[15rem_1fr]">
            <div className="rounded-2xl bg-surface-soft p-5 text-center">
              <h2 id="reviews-title" className="text-sm font-bold">
                Đánh giá sản phẩm
              </h2>
              <p className="mt-4 text-4xl font-extrabold text-primary">4.5/5</p>
              <p className="mt-2 text-warning">★★★★★</p>
              <p className="mt-1 text-xs text-muted">128 đánh giá khách hàng</p>
              <Button className="mt-5 w-full">Viết đánh giá</Button>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="font-bold">Nguyễn Văn A</p>
                  <p className="mt-1 text-xs text-success">Đã mua hàng</p>
                </div>
                <p className="text-xs text-muted">2 ngày trước</p>
              </div>
              <p className="mt-4 text-warning">★★★★★</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Máy rất đẹp, màu hồng sang trọng đúng như hình. Camera chụp đêm
                tốt và nhân viên tư vấn nhiệt tình.
              </p>
            </div>
          </div>
        </section>
      </div>
    </StorePageLayout>
  );
}

type IconComponent = typeof ShieldCheck;

function TrustItem({
  icon: Icon,
  title,
  note,
}: {
  icon: IconComponent;
  title: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-soft p-4">
      <Icon size={20} className="shrink-0 text-primary" />
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-1 text-[11px] text-muted">{note}</p>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-4 text-xs font-semibold ${
        active
          ? "border-primary bg-surface-soft text-primary"
          : "border-border bg-white hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}

function Highlight({
  icon: Icon,
  title,
  copy,
}: {
  icon: IconComponent;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface-soft p-6 first:bg-white">
      <Icon size={23} className="text-primary" />
      <h3 className="mt-5 font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 border-b border-border pb-3 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
