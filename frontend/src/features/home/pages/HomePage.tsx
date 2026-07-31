import { useMemo, useState } from "react";
import {
  BadgePercent,
  BatteryCharging,
  Camera,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Truck,
} from "lucide-react";
import newsStrip from "../../../assets/phone-news-strip.png";
import { Button } from "../../../shared/components/Button";
import {
  getActiveBrands,
  getActiveHomeBanner,
  getBestSellingPhones,
} from "../../catalog/selectors/catalogSelectors";
import { ProductCard } from "../components/ProductCard";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

const phoneNeeds = [
  { name: "Điện thoại cao cấp", icon: Smartphone },
  { name: "Camera đẹp", icon: Camera },
  { name: "Pin bền", icon: BatteryCharging },
  { name: "Chơi game", icon: Gamepad2 },
  { name: "Giá tốt", icon: BadgePercent },
];

const faqs = [
  "Chính sách bảo hành tại PinkPhone như thế nào?",
  "Tôi có thể mua trả góp 0% bằng cách nào?",
  "Cửa hàng có hỗ trợ giao hàng toàn quốc không?",
];

const newsArticles = [
  {
    label: "Review",
    title: "Đánh giá chi tiết PinkPhone 15 Pro Max sau 6 tháng sử dụng",
    copy: "Trải nghiệm thực tế về hiệu năng, pin, camera và độ bền của khung viền sau thời gian dài sử dụng.",
  },
  {
    label: "Tin mới",
    title: "Chip Snapdragon thế hệ mới có gì đáng chú ý?",
    copy: "Hiệu năng AI và khả năng xử lý hình ảnh đang thay đổi trải nghiệm trên điện thoại cao cấp.",
  },
  {
    label: "Thủ thuật",
    title: "5 mẹo chụp ảnh bằng điện thoại có thể bạn chưa biết",
    copy: "Tận dụng tối đa camera điện thoại để có những bức hình tự nhiên và sắc nét hơn.",
  },
];

export function HomePage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Tất cả");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const products = useMemo(() => getBestSellingPhones(), []);
  const brands = useMemo(() => getActiveBrands(), []);
  const heroBanner = useMemo(() => getActiveHomeBanner(), []);

  const visibleProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter(
      (product) =>
        (brand === "Tất cả" || product.brand === brand) &&
        (!keyword ||
          product.name.toLowerCase().includes(keyword) ||
          product.brand.toLowerCase().includes(keyword)),
    );
  }, [brand, products, search]);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <SiteHeader search={search} onSearch={setSearch} />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 lg:pt-8">
          <div className="relative min-h-[29rem] overflow-hidden rounded-card border border-border bg-surface shadow-card sm:min-h-[32rem]">
            <img
              src={heroBanner?.image_url}
              alt={heroBanner?.title ?? "Điện thoại PinkPhone nổi bật"}
              className="absolute inset-0 size-full object-cover object-[64%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-strong/80 via-primary/35 to-transparent sm:from-primary-strong/70 sm:via-primary/20" />
            <div className="relative flex min-h-[29rem] max-w-xl flex-col justify-center px-6 py-12 text-white sm:min-h-[32rem] sm:px-12 lg:px-16">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
                Exclusive release · 2026
              </p>
              <h1 className="mt-4 max-w-[18rem] text-3xl font-extrabold leading-[1.08] tracking-[-0.05em] sm:max-w-xl sm:text-6xl">
                {heroBanner?.title ?? "Ultra X — sắc hồng của công nghệ."}
              </h1>
              <p className="mt-5 max-w-[18rem] text-sm leading-6 text-white/85 sm:max-w-md sm:text-base">
                Camera 200MP, hiệu năng bứt phá và thiết kế được hoàn thiện cho những trải nghiệm tinh tế.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="inverted" onClick={() => heroBanner && (window.location.href = heroBanner.link_url)}>Mua ngay</Button>
                <Button className="border-white/35 bg-white/10 text-white hover:bg-white/20" variant="outline" onClick={() => heroBanner && (window.location.href = heroBanner.link_url)}>
                  Xem chi tiết <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: "Giao nhanh 2 giờ", note: "Nội thành chọn lọc" },
              { icon: ShieldCheck, title: "Bảo hành 12 tháng", note: "An tâm sử dụng" },
              { icon: CircleDollarSign, title: "Trả góp 0%", note: "Thủ tục đơn giản" },
              { icon: PackageCheck, title: "Đổi mới 30 ngày", note: "Điều kiện linh hoạt" },
            ].map(({ icon: Icon, title, note }) => (
              <div key={title} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-soft text-primary">
                  <Icon size={21} />
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-xs text-muted">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6" aria-labelledby="brands-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Khám phá</p>
              <h2 id="brands-title" className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">
                Thương hiệu nổi bật
              </h2>
            </div>
            <a href="#all-brands" className="hidden text-sm font-semibold text-primary sm:block">
              Tất cả thương hiệu <ChevronRight className="inline" size={16} />
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {brands.map(({ id, name }) => (
              <button
                type="button"
                key={id}
                onClick={() => setBrand(name)}
                className="min-h-20 rounded-2xl border border-border bg-white px-4 text-sm font-extrabold tracking-wide transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm"
              >
                {name.toUpperCase()}
              </button>
            ))}
          </div>

          <h3 className="mt-9 text-lg font-extrabold tracking-[-0.025em]">
            Chọn điện thoại theo nhu cầu
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {phoneNeeds.map(({ name, icon: Icon }) => (
              <button
                type="button"
                key={name}
                className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                <span className="grid size-10 place-items-center rounded-full bg-surface-soft text-primary">
                  <Icon size={20} />
                </span>
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" id="products" aria-labelledby="products-title">
          <div
            className="mb-10 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Bộ lọc điện thoại"
          >
            {["Tất cả hãng", "Mức giá", "Nhu cầu", "Bộ nhớ"].map((filter, index) => (
              <button
                type="button"
                key={filter}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-bold transition ${
                  index === 0
                    ? "bg-primary text-white"
                    : "border border-border bg-white text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {filter} <ChevronDown size={14} />
              </button>
            ))}
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-bold text-muted transition hover:border-primary hover:text-primary"
            >
              Sắp xếp <SlidersHorizontal size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="products-title" className="text-2xl font-extrabold tracking-[-0.035em] text-primary">
                Điện thoại bán chạy
              </h2>
              <p className="mt-2 text-sm text-muted">Top những sản phẩm được săn đón nhất tháng này.</p>
            </div>
            <div className="inline-flex w-fit rounded-lg bg-neutral-soft p-1" role="group" aria-label="Lọc nhanh theo thương hiệu">
              {["Tất cả", "PinkPhone", "Samsung"].map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setBrand(name)}
                  className={`min-h-9 rounded-md px-5 text-xs font-bold transition ${
                    brand === name ? "bg-white text-primary shadow-sm" : "text-muted hover:text-primary"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {visibleProducts.length ? (
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-7 lg:grid-cols-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-card border border-dashed border-border bg-white p-10 text-center">
              <Smartphone className="mx-auto text-tertiary" size={36} />
              <p className="mt-3 font-bold">Chưa tìm thấy sản phẩm phù hợp</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setBrand("Tất cả");
                }}
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                Xoá bộ lọc
              </button>
            </div>
          )}
        </section>

        <section className="bg-white py-14" aria-labelledby="news-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <h2 id="news-title" className="text-2xl font-extrabold tracking-[-0.035em] text-primary">
                Tin công nghệ
              </h2>
              <a href="#all-news" className="text-xs font-bold text-primary hover:underline">
                Xem thêm tin tức
              </a>
            </div>
            <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {newsArticles.map(({ label, title, copy }, index) => (
              <article key={title} className="overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-card">
                <div className="relative aspect-[16/8.5] overflow-hidden bg-surface-soft">
                  <img
                    src={newsStrip}
                    alt=""
                    className="absolute top-1/2 h-auto w-[300%] max-w-none -translate-y-1/2"
                    style={{ left: `-${index * 100}%` }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{label}</p>
                  <h3 className="mt-2 text-base font-bold leading-6">{title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{copy}</p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6" aria-labelledby="about-title">
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 id="about-title" className="text-xl font-extrabold tracking-[-0.025em] text-primary">
              Về PinkPhone - Hệ Thống Bán Lẻ Điện Thoại Uy Tín
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              PinkPhone tự hào là hệ thống bán lẻ điện thoại di động hàng đầu tại Việt Nam,
              chuyên cung cấp các dòng smartphone chính hãng từ PinkPhone, Samsung, Xiaomi,
              OPPO và realme. Với phương châm tận tâm và minh bạch, chúng tôi không chỉ mang
              đến sản phẩm công nghệ mà còn tạo nên một trải nghiệm mua sắm hiện đại, dễ dàng
              và đáng tin cậy.
            </p>
            <a href="#about" className="mt-4 inline-flex text-sm font-bold text-primary hover:underline">
              Xem thêm
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6" aria-labelledby="faq-title">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Hỗ trợ</p>
            <h2 id="faq-title" className="mt-2 text-2xl font-extrabold">Câu hỏi thường gặp</h2>
          </div>
          <div className="mt-7 grid gap-3">
            {faqs.map((question, index) => (
              <div key={question} className="overflow-hidden rounded-2xl border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left text-sm font-semibold"
                  aria-expanded={openFaq === index}
                >
                  {question}
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition ${openFaq === index ? "rotate-180 text-primary" : "text-muted"}`}
                  />
                </button>
                {openFaq === index && (
                  <p className="border-t border-border px-5 py-4 text-sm leading-6 text-muted">
                    PinkPhone hỗ trợ minh bạch theo từng sản phẩm và đơn hàng. Chi tiết sẽ được hiển thị trước khi bạn xác nhận mua.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-card bg-primary-strong p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="text-sm font-semibold text-white/75">Trải nghiệm sản phẩm trực tiếp</p>
              <h2 className="mt-2 text-2xl font-extrabold">Tìm cửa hàng PinkPhone gần bạn</h2>
            </div>
            <Button className="bg-white text-primary-strong hover:bg-surface-soft">
              <MapPin size={18} /> Tìm cửa hàng
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
