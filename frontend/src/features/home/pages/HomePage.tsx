import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ListFilter,
  Circle,
  Star,
  Gift,
  Image as ImageIcon,
  MapPin,
  Share2,
  Smartphone,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { fetchProducts } from "../../../api/productService";
import { fetchNews, type NewsItem } from "../../../api/newsService";
import { fetchBanners, type Banner } from "../../../api/bannerService";
import { fetchBrands } from "../../../api/brandService";
import { useStore } from "../../../context/StoreContext";
import type { Product, Brand } from "../../../types";

const ITEMS_PER_PAGE = 30;

type FilterMenu = "brand" | "price" | "storage" | "sort" | null;
type PriceRange = "all" | "under-10" | "10-to-20" | "20-to-30" | "over-30";
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const priceRanges: { value: PriceRange; label: string; min?: number; max?: number }[] = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-10", label: "Dưới 10 triệu", max: 10_000_000 },
  { value: "10-to-20", label: "Từ 10 - 20 triệu", min: 10_000_000, max: 20_000_000 },
  { value: "20-to-30", label: "Từ 20 - 30 triệu", min: 20_000_000, max: 30_000_000 },
  { value: "over-30", label: "Trên 30 triệu", min: 30_000_000 },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "name-asc", label: "Tên A - Z" },
];

const getProductPrice = (product: Product): number =>
  Number((product.newPrice || product.price || "").replace(/[^\d]/g, ""));

export function HomePage() {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useStore();
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Tất cả");
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [selectedStorage, setSelectedStorage] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [openFilter, setOpenFilter] = useState<FilterMenu>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    // Fetch Products
    const loadProducts = async () => {
      try {
        const keyword = search.trim() !== "" ? search.trim() : undefined;
        const data = await fetchProducts(keyword, undefined, selectedBrandId);
        setAllProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, [search, selectedBrandId]);

  const storageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          allProducts.flatMap((product) =>
            (product.variants || [])
              .map((variant) => variant.storageGb)
              .filter((storage): storage is number => typeof storage === "number")
          )
        )
      ).sort((a, b) => a - b),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    const range = priceRanges.find((item) => item.value === priceRange);
    const filtered = allProducts.filter((product) => {
      const price = getProductPrice(product);
      const matchesPrice =
        !range ||
        range.value === "all" ||
        ((range.min === undefined || price >= range.min) &&
          (range.max === undefined || price < range.max));
      const matchesStorage =
        selectedStorage === undefined ||
        (product.variants || []).some((variant) => variant.storageGb === selectedStorage);

      return matchesPrice && matchesStorage;
    });

    return filtered.sort((first, second) => {
      if (sortOption === "price-asc") return getProductPrice(first) - getProductPrice(second);
      if (sortOption === "price-desc") return getProductPrice(second) - getProductPrice(first);
      if (sortOption === "name-asc") return first.name.localeCompare(second.name, "vi");
      return 0;
    });
  }, [allProducts, priceRange, selectedStorage, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const products = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectBrand = (selectedBrand?: Brand) => {
    setBrand(selectedBrand?.name || "Tất cả");
    setSelectedBrandId(selectedBrand ? String(selectedBrand.id) : undefined);
    setCurrentPage(1);
    setOpenFilter(null);
  };

  const resetLocalFilters = () => {
    setPriceRange("all");
    setSelectedStorage(undefined);
    setSortOption("default");
    setCurrentPage(1);
    setOpenFilter(null);
  };

  useEffect(() => {
    // Fetch secondary homepage data.
    const loadSecondaryData = async () => {
      try {
        const [newsData, bannerData, brandData] = await Promise.all([
          fetchNews(),
          fetchBanners(),
          fetchBrands(),
        ]);
        setNews(newsData.slice(0, 3));
        setBanners(bannerData);
        setBrands(brandData);
      } catch (error) {
        console.error("Failed to load secondary data:", error);
      }
    };
    loadSecondaryData();
  }, []);

  const topBanner = banners[0];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SiteHeader search={search} onSearch={setSearch} />

      <main className="mt-8 w-full max-w-[1200px] mx-auto px-gutter space-y-xl pb-24">
        {/* Hero Banner Section */}
        <section className="relative w-full h-[480px] rounded-xl overflow-hidden bg-surface-container-high group">
          {topBanner ? (
            <>
              <div className="absolute inset-0 z-0">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-[10s] group-hover:scale-105"
                  style={{ backgroundImage: `url('${topBanner.image}')` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex flex-col justify-center px-12 md:px-24 z-10">
                {topBanner.label && (
                  <span className="text-primary-fixed-dim font-label-sm text-label-sm tracking-widest uppercase mb-sm">
                    {topBanner.label}
                  </span>
                )}
                <h1 className="text-white font-display-lg text-display-lg max-w-[576px] mb-md leading-tight">
                  {topBanner.title}
                </h1>
                {topBanner.subtitle && (
                  <p className="text-white/90 font-body-lg text-body-lg max-w-[448px] mb-xl">
                    {topBanner.subtitle}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-md">
                  <button
                    onClick={() => navigate(topBanner.linkUrl || "/")}
                    className="w-full sm:w-auto px-8 py-3 bg-primary-container text-white font-label-sm text-label-sm rounded-lg hover:bg-primary transition-all active:scale-95 shadow-lg"
                  >
                    Mua Ngay
                  </button>
                  <button
                    onClick={() => navigate(topBanner.linkUrl || "/")}
                    className="w-full sm:w-auto px-8 py-3 bg-white/10 backdrop-blur-md text-white font-label-sm text-label-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all shadow-sm"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container text-on-surface-variant/40 animate-pulse">
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <p className="font-semibold tracking-wide">
                Đang tải biểu ngữ...
              </p>
            </div>
          )}
          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            <div className="w-8 h-1.5 rounded-full bg-primary-container"></div>
            <div className="w-2 h-1.5 rounded-full bg-white/50"></div>
            <div className="w-2 h-1.5 rounded-full bg-white/50"></div>
          </div>
        </section>

        {/* Brands Spotlight */}
        <section>
          <div className="flex items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-primary">
              Thương hiệu nổi bật
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-gutter">
            {brands.length > 0
              ? brands.map((b) => (
                <div
                  key={b.id}
                  onClick={() => selectBrand(b)}
                  className={`h-20 bg-white rounded-lg flex items-center justify-center p-gutter shadow-sm border cursor-pointer transition-all ${selectedBrandId === String(b.id)
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-outline-variant/30 hover:border-primary"
                    }`}
                >
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    className="max-h-10 max-w-32 object-contain"
                  />
                </div>
              ))
              : [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-surface-container-low rounded-lg animate-pulse border border-outline-variant/10"
                ></div>
              ))}
          </div>
        </section>

        {/* Product filters: only fields available in the product data are shown. */}
        <section className="pb-4">
          <div className="flex items-center gap-md overflow-x-auto scrollbar-hide">
            {brands.length > 0 && (
              <button
                onClick={() => setOpenFilter(openFilter === "brand" ? null : "brand")}
                className={`px-6 min-h-10 shrink-0 rounded-full border text-label-sm font-label-sm flex items-center whitespace-nowrap transition-colors ${selectedBrandId
                    ? "border-primary bg-primary text-white"
                    : "border-outline text-on-surface-variant hover:bg-surface-container"
                  }`}
              >
                {selectedBrandId ? brand : "Tất cả hãng"}
                <ChevronDown size={16} className="ml-2 opacity-80" />
              </button>
            )}
            <button
              onClick={() => setOpenFilter(openFilter === "price" ? null : "price")}
              className={`px-6 min-h-10 shrink-0 rounded-full border text-label-sm font-label-sm flex items-center whitespace-nowrap transition-colors ${priceRange !== "all"
                  ? "border-primary bg-primary text-white"
                  : "border-outline text-on-surface-variant hover:bg-surface-container"
                }`}
            >
              {priceRange === "all"
                ? "Mức giá"
                : priceRanges.find((item) => item.value === priceRange)?.label}
              <ChevronDown size={16} className="ml-2 opacity-80" />
            </button>
            {storageOptions.length > 0 && (
              <button
                onClick={() => setOpenFilter(openFilter === "storage" ? null : "storage")}
                className={`px-6 min-h-10 shrink-0 rounded-full border text-label-sm font-label-sm flex items-center whitespace-nowrap transition-colors ${selectedStorage !== undefined
                    ? "border-primary bg-primary text-white"
                    : "border-outline text-on-surface-variant hover:bg-surface-container"
                  }`}
              >
                {selectedStorage === undefined ? "Bộ nhớ" : `${selectedStorage}GB`}
                <ChevronDown size={16} className="ml-2 opacity-80" />
              </button>
            )}
            <button
              onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
              className={`px-6 min-h-10 shrink-0 rounded-full border text-label-sm font-label-sm flex items-center whitespace-nowrap transition-colors ${sortOption !== "default"
                  ? "border-primary bg-primary text-white"
                  : "border-outline text-on-surface-variant hover:bg-surface-container"
                }`}
            >
              {sortOption === "default"
                ? "Sắp xếp"
                : sortOptions.find((item) => item.value === sortOption)?.label}
              <ListFilter size={16} className="ml-2 opacity-80" />
            </button>
          </div>

          {openFilter && (
            <div className="mt-3 rounded-xl border border-outline-variant/30 bg-white p-3 shadow-sm flex flex-wrap items-center gap-2">
              {openFilter === "brand" && (
                <>
                  <button
                    onClick={() => selectBrand()}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!selectedBrandId ? "bg-primary text-white" : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                  >
                    Tất cả hãng
                  </button>
                  {brands.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => selectBrand(item)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${selectedBrandId === String(item.id)
                          ? "bg-primary text-white"
                          : "bg-surface-container hover:bg-surface-container-high"
                        }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              )}
              {openFilter === "price" &&
                priceRanges.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setPriceRange(item.value);
                      setCurrentPage(1);
                      setOpenFilter(null);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${priceRange === item.value
                        ? "bg-primary text-white"
                        : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              {openFilter === "storage" && (
                <>
                  <button
                    onClick={() => {
                      setSelectedStorage(undefined);
                      setCurrentPage(1);
                      setOpenFilter(null);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${selectedStorage === undefined
                        ? "bg-primary text-white"
                        : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                  >
                    Tất cả bộ nhớ
                  </button>
                  {storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => {
                        setSelectedStorage(storage);
                        setCurrentPage(1);
                        setOpenFilter(null);
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${selectedStorage === storage
                          ? "bg-primary text-white"
                          : "bg-surface-container hover:bg-surface-container-high"
                        }`}
                    >
                      {storage}GB
                    </button>
                  ))}
                </>
              )}
              {openFilter === "sort" &&
                sortOptions.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setSortOption(item.value);
                      setCurrentPage(1);
                      setOpenFilter(null);
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${sortOption === item.value
                        ? "bg-primary text-white"
                        : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              {(priceRange !== "all" || selectedStorage !== undefined || sortOption !== "default") && (
                <button
                  onClick={resetLocalFilters}
                  className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
        </section>

        {/* Main Products Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary mb-xs">
                Điện thoại bán chạy
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Top những sản phẩm được săn đón nhất tháng này
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-gutter">
            {products.length > 0 ? (
              products.map((p) => {
                const isFavorite = p?.id ? isInWishlist(p.id) : false;
                return (
                  <Link
                    to={`/product/${p.slug}`}
                    key={p.slug}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 hover:border-primary/40 transition-all hover:-translate-y-1.5 group relative flex flex-col"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-md uppercase shadow-md flex items-center gap-1 transition-transform group-hover:scale-105">
                        <Sparkles size={11} className="text-amber-300" />
                        {(() => {
                          const parseNum = (str?: string) => (str ? parseInt(str.replace(/\D/g, "") || "0") : 0);
                          const newP = parseNum(p.newPrice);
                          const oldP = parseNum(p.oldPrice);
                          let pct = 0;
                          if (oldP > newP && newP > 0) {
                            pct = Math.round(((oldP - newP) / oldP) * 100);
                          }
                          if (pct > 0) {
                            return `GIẢM ${pct}%`;
                          }
                          if (p.badge && p.badge.includes("%")) {
                            return p.badge;
                          }
                          return "GIẢM 20%";
                        })()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"
                      aria-label={
                        isFavorite
                          ? `Bỏ thích ${p.name}`
                          : `Yêu thích ${p.name}`
                      }
                    >
                      <Star
                        size={16}
                        className={
                          isFavorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-on-surface-variant"
                        }
                      />
                    </button>
                    <div className="h-44 md:h-56 bg-surface-container-lowest flex items-center justify-center p-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2 flex flex-col flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-semibold text-outline px-2 py-0.5 rounded bg-surface-container-high truncate">
                          256GB / Đủ Màu
                        </span>
                      </div>
                      <h3 className="font-label-sm text-label-sm text-on-surface line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex flex-col mt-auto pt-2">
                        <span className="text-primary font-bold text-base md:text-lg">
                          {p.newPrice}
                        </span>
                        {p.oldPrice && (
                          <span className="text-on-surface-variant text-xs md:text-sm line-through decoration-primary/30">
                            {p.oldPrice}
                          </span>
                        )}
                      </div>
                      {p.gift && (
                        <div className="bg-surface-container text-[11px] p-2 rounded text-on-surface-variant flex items-center mt-1 truncate">
                          <Gift size={12} className="mr-1 shrink-0" />
                          <span className="truncate">{p.gift}</span>
                        </div>
                      )}
                      <div className="w-full mt-3 py-2.5 bg-primary-container text-white rounded-lg font-label-sm text-label-sm opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 flex items-center justify-center">
                        Mua ngay
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-surface-container-low rounded-xl border border-dashed border-outline">
                <Smartphone
                  className="mx-auto text-on-surface-variant/50 mb-3"
                  size={48}
                />
                <p className="font-bold text-on-surface-variant text-lg">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="text-on-surface-variant/70 text-sm mt-1">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-outline-variant/20 shadow-sm">
              <span className="text-sm text-on-surface-variant font-medium">
                Hiển thị{" "}
                <b className="text-primary">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </b>{" "}
                -{" "}
                <b className="text-primary">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </b>{" "}
                trong tổng số <b className="text-primary">{filteredProducts.length}</b> sản phẩm
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 600, behavior: "smooth" });
                  }}
                  className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-all"
                >
                  <ChevronLeft size={16} className="mr-1" /> Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 600, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${currentPage === pageNum
                          ? "bg-primary text-white shadow-md scale-105"
                          : "bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/30"
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 600, behavior: "smooth" });
                  }}
                  className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-all"
                >
                  Sau <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Tech News */}
        <section>
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-md text-headline-md text-primary">
              Tin công nghệ
            </h2>
            <Link
              to="/tin-tuc"
              className="text-label-sm text-primary flex items-center hover:underline"
            >
              Xem thêm tin tức <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {news.length > 0
              ? news.map((item) => (
                <Link
                  to={`/tin-tuc/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md group cursor-pointer border border-outline-variant/20 transition-all flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    ></div>
                  </div>
                  <div className="p-lg flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary-container mb-2 block tracking-wider">
                        {item.tag}
                      </span>
                      <h3 className="font-label-sm text-label-sm text-on-surface line-clamp-2 mb-sm group-hover:text-primary transition-colors leading-relaxed">
                        {item.title}
                      </h3>
                      <p className="text-body-md text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
              : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-low rounded-xl h-72 border border-outline-variant/20 animate-pulse"
                ></div>
              ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="bg-white p-xl rounded-xl shadow-sm border border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-primary mb-md">
            Về PinkPhone - Hệ Thống Bán Lẻ Điện Thoại Uy Tín
          </h2>
          <div className="space-y-md text-on-surface-variant font-body-md text-body-md">
            <p>
              PinkPhone tự hào là một trong những hệ thống bán lẻ điện thoại di
              động hàng đầu tại Việt Nam, chuyên cung cấp các dòng smartphone
              cao cấp từ iPhone, Samsung, Xiaomi đến OPPO, realme. Với phương
              châm "Playful Professionalism", chúng tôi không chỉ mang đến sản
              phẩm công nghệ mà còn là một không gian trải nghiệm mua sắm hiện
              đại và ấm cúng.
            </p>
            <div className="hidden space-y-md" id="seo-expand">
              <p>
                Mỗi sản phẩm tại PinkPhone đều được cam kết chính hãng 100%, bảo
                hành chính hãng và đi kèm các gói bảo hiểm rơi vỡ đặc quyền.
                Chúng tôi hiểu rằng một chiếc điện thoại không chỉ là công cụ
                liên lạc mà còn là món đồ thời trang khẳng định đẳng cấp người
                dùng.
              </p>
              <p>
                Bên cạnh đó, PinkPhone hỗ trợ trả góp 0% lãi suất, thu cũ đổi
                mới với trợ giá cực cao, giúp quý khách hàng dễ dàng sở hữu
                những siêu phẩm công nghệ mới nhất mà không phải lo lắng về chi
                phí.
              </p>
            </div>
            <button
              className="text-primary font-bold hover:underline"
              onClick={(e) => {
                const target = document.getElementById("seo-expand");
                if (target) {
                  target.classList.toggle("hidden");
                  const btn = e.currentTarget;
                  btn.innerText =
                    btn.innerText === "Xem thêm" ? "Thu gọn" : "Xem thêm";
                }
              }}
            >
              Xem thêm
            </button>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section>
          <div className="text-center mb-lg">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary-fixed-dim/80 mb-1">
              Hỗ trợ
            </p>
            <h2 className="font-headline-md text-headline-md text-primary">
              Câu hỏi thường gặp
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-sm">
            {[
              {
                q: "Chính sách bảo hành tại PinkPhone như thế nào?",
                a: "Tất cả điện thoại chính hãng được bảo hành 12 tháng tại các trung tâm bảo hành ủy quyền. Ngoài ra, PinkPhone tặng gói 1 đổi 1 trong 30 ngày đầu nếu có lỗi phần cứng từ nhà sản xuất.",
              },
              {
                q: "Tôi có thể mua trả góp 0% bằng cách nào?",
                a: "PinkPhone hỗ trợ trả góp 0% qua thẻ tín dụng của hơn 20 ngân hàng hoặc qua các công ty tài chính như Home Credit, FE Credit với thủ tục nhanh gọn chỉ trong 15 phút.",
              },
              {
                q: "Cửa hàng có hỗ trợ giao hàng tận nhà không?",
                a: "Chúng tôi miễn phí giao hàng toàn quốc cho đơn hàng từ 1.000.000₫. Tại TP.HCM và Hà Nội, quý khách sẽ nhận được hàng trong vòng 2 giờ (Pink Express).",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-outline-variant/30 overflow-hidden shadow-sm"
              >
                <button
                  className="w-full px-lg py-4 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                >
                  <span className="font-label-sm text-label-sm text-on-surface">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-on-surface-variant transition-transform ${faqOpen === idx ? "rotate-180 text-primary" : ""
                      }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-lg py-4 border-t border-outline-variant/20 text-body-md text-on-surface-variant bg-surface-bright/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Store Locator */}
        <section className="bg-primary-container/5 rounded-2xl p-6 md:p-12 border border-primary-container/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-xl">
            <div className="max-w-[448px] text-center md:text-left">
              <h2 className="font-headline-md text-headline-md text-primary mb-3">
                Hệ thống cửa hàng
              </h2>
              <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                Tìm ngay cửa hàng PinkPhone gần bạn nhất để được tư vấn và trải
                nghiệm trực tiếp sản phẩm cực đỉnh.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-on-surface-variant px-2">
                  Tỉnh/Thành phố
                </label>
                <select className="w-full h-12 px-4 rounded-lg border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow">
                  <option>Chọn Tỉnh/Thành</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-on-surface-variant px-2">
                  Quận/Huyện
                </label>
                <select className="w-full h-12 px-4 rounded-lg border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow">
                  <option>Chọn Quận/Huyện</option>
                  <option>Quận 1</option>
                  <option>Quận 7</option>
                  <option>Quận Gò Vấp</option>
                </select>
              </div>
            </div>
            <button className="w-full md:w-auto h-12 px-8 bg-primary text-white rounded-lg font-label-sm text-label-sm flex items-center justify-center shrink-0 hover:bg-secondary active:scale-95 transition-all shadow-md">
              <MapPin size={18} className="mr-2" />
              Tìm cửa hàng
            </button>
          </div>
        </section>
      </main>

      {/* Footer replacing SiteFooter to match the mockup completely */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant pt-16 md:pt-24 pb-8 md:pb-12 text-on-surface">
        <div className="max-w-[1200px] mx-auto px-gutter grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-xl md:gap-lg mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:space-y-md">
            <div className="text-headline-md font-headline-md font-extrabold text-secondary-container">
              PinkPhone
            </div>
            <p className="text-body-md text-on-surface-variant pr-md leading-relaxed">
              Hệ thống bán lẻ điện thoại di động hàng đầu với dịch vụ tận tâm và
              sản phẩm chính hãng.
            </p>
            <div className="flex space-x-md pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white text-on-surface-variant transition-all cursor-pointer"
              >
                <Share2 size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white text-on-surface-variant transition-all cursor-pointer"
              >
                <ThumbsUp size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4 md:space-y-md">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">
              Giới thiệu
            </h4>
            <ul className="space-y-3 md:space-y-sm">
              <li>
                <Link
                  to="/about"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Về PinkPhone
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Tin công nghệ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-md">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">
              Chính sách
            </h4>
            <ul className="space-y-3 md:space-y-sm">
              <li>
                <Link
                  to="/warranty"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-label-sm text-on-surface-variant hover:text-secondary hover:underline transition-all"
                >
                  Thanh toán bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:space-y-md">
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wide">
              Hỗ trợ khách hàng
            </h4>
            <div className="space-y-3 md:space-y-sm bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 shadow-sm inline-block">
              <p className="text-body-md text-on-surface-variant">
                Hotline mua hàng:
              </p>
              <p className="text-headline-md font-bold text-primary mb-3">
                1800 6601
              </p>
              <p className="text-body-md text-on-surface-variant">
                Góp ý, khiếu nại:
              </p>
              <p className="text-headline-md font-bold text-primary">
                1800 6602
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-gutter mt-xl pt-lg border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="text-[13px] font-medium text-on-surface-variant text-center md:text-left tracking-wide">
            © 2026 PinkPhone. All rights reserved.
          </p>
          <div className="flex items-center space-x-md">
            <div className="w-10 h-6 bg-surface-variant rounded"></div>
            <div className="w-10 h-6 bg-surface-variant rounded"></div>
            <div className="w-10 h-6 bg-surface-variant rounded"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
