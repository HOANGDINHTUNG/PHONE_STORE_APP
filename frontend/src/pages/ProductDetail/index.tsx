import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  Camera,
  Cpu,
  ShieldCheck,
  Tag,
  MapPin,
  AlertCircle,
  BellRing,
} from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { fetchProductBySlug } from "../../api/productService";
import { Product } from "../../types";
import { message } from "antd";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, user } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Variations state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("Mặc định");
  const [mainImage, setMainImage] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      if (!slug) return;
      window.scrollTo(0, 0);
      setLoading(true);
      const data = await fetchProductBySlug(slug);
      if (active) {
        if (data) {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariantIndex(0);
            setMainImage(data.variants[0].image || data.image);
            setSelectedColor(data.variants[0].color || data.variants[0].name);
            if (data.variants[0].storageGb) {
              setSelectedStorage(`${data.variants[0].storageGb}GB`);
            }
          } else {
            setMainImage(data.image);
          }
        } else {
          navigate("/");
        }
        setLoading(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, [slug, navigate]);

  const handleSelectVariant = (index: number) => {
    if (!product || !product.variants || !product.variants[index]) return;
    const variant = product.variants[index];
    setSelectedVariantIndex(index);
    if (variant.image) {
      setMainImage(variant.image);
    }
    if (variant.color) setSelectedColor(variant.color);
    if (variant.storageGb) setSelectedStorage(`${variant.storageGb}GB`);
  };

  // Desktop Sticky Bar logic
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const bottom = heroRef.current.getBoundingClientRect().bottom;
        if (bottom < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBuyNow = () => {
    if (!user) {
      message.warning(
        "Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.",
      );
      return;
    }

    if (product) {
      const variant = product.variants?.[selectedVariantIndex];
      addToCart({
        ...product,
        id: variant?.id || product.id,
        image: variant?.image || product.image,
        price: variant?.newPrice || variant?.price || product.price,
        newPrice: variant?.newPrice || variant?.price || product.newPrice,
        oldPrice: variant?.oldPrice || product.oldPrice,
        selectedStorage,
        selectedColor,
        quantity: 1,
      });
      navigate("/checkout");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      message.warning(
        "Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.",
      );
      return;
    }

    if (product) {
      const variant = product.variants?.[selectedVariantIndex];
      addToCart({
        ...product,
        id: variant?.id || product.id,
        image: variant?.image || product.image,
        price: variant?.newPrice || variant?.price || product.price,
        newPrice: variant?.newPrice || variant?.price || product.newPrice,
        oldPrice: variant?.oldPrice || product.oldPrice,
        selectedStorage,
        selectedColor,
        quantity: 1,
      });
      message.success("Đã thêm sản phẩm vào giỏ hàng.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-primary">
        <RefreshCw className="animate-spin" size={40} />
      </div>
    );
  }

  if (!product) return null;

  const selectedVariant = product.variants?.[selectedVariantIndex];
  const displayedPrice =
    selectedVariant?.newPrice ||
    selectedVariant?.price ||
    product.newPrice ||
    product.price;
  const displayedOldPrice = selectedVariant?.oldPrice || product.oldPrice;

  // Determine Out Of Stock state (Hardcoded demo logic or rely on `stock === 0`)
  // You can set isOutOfStock = true for testing UI changes locally.
  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  return (
    <div className="bg-surface font-body-md text-on-surface pb-[80px] md:pb-0 overflow-x-hidden">
      <main className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-on-surface-variant mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar [&::-webkit-scrollbar]:hidden">
          <Link className="hover:text-primary transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            Điện thoại
          </span>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-semibold">{product.name}</span>
        </nav>

        {/* Product Hero Area */}
        <div
          ref={heroRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12"
          id="hero-area"
        >
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(214,51,108,0.08)] p-8 flex items-center justify-center overflow-hidden h-[300px] md:h-[500px]">
              <img
                alt={product.name}
                className="max-h-full transition-transform hover:scale-105 duration-500 object-contain"
                src={mainImage}
              />
            </div>
            {/* Variant Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden scrollbar-hide">
              {product.variants && product.variants.length > 0 ? (
                product.variants.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    onClick={() => handleSelectVariant(idx)}
                    className={`w-20 h-20 bg-white rounded-lg p-2 cursor-pointer shrink-0 border-2 transition-all flex flex-col items-center justify-between ${
                      selectedVariantIndex === idx
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-outline-variant hover:border-primary/50"
                    }`}
                  >
                    <img
                      className="w-full h-12 object-contain"
                      src={v.image || product.image}
                      alt={v.name}
                    />
                    <span className="text-[10px] font-bold text-center truncate w-full">
                      {v.color || v.name}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  onClick={() => setMainImage(product.image)}
                  className={`w-20 h-20 bg-white rounded-lg p-2 cursor-pointer shrink-0 border-2 border-primary`}
                >
                  <img
                    className="w-full h-full object-contain"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <ShieldCheck className="text-primary shrink-0" size={24} />
                <div className="text-xs">
                  <p className="font-bold">Bảo hành 12 tháng</p>
                  <p className="text-on-surface-variant">Lỗi là đổi mới</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <RefreshCw className="text-primary shrink-0" size={24} />
                <div className="text-xs">
                  <p className="font-bold">30 ngày đổi trả</p>
                  <p className="text-on-surface-variant">Miễn phí thủ tục</p>
                </div>
              </div>
            </div>

            {/* In-Stock Alert Form Layout */}
            {isOutOfStock && (
              <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant">
                <p className="text-sm font-bold mb-3 flex items-center gap-2">
                  <BellRing className="text-primary" size={18} /> Thông báo khi
                  có hàng
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    placeholder="Email hoặc Số điện thoại"
                    type="text"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary transition-colors">
                    Gửi yêu cầu
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant mt-4 italic">
                  Sản phẩm hiện đang tạm hết, bạn có thể tham khảo các dòng sản
                  phẩm tương tự bên dưới.
                </p>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-secondary">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-current text-secondary"
                    />
                  ))}
                  <Star
                    size={14}
                    className="fill-current text-secondary opacity-50"
                  />
                  <span className="text-xs font-bold ml-1">
                    {product.rating || "4.5"} ({product.reviewsCount || "128"}{" "}
                    đánh giá)
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant">
                  Model: PP-{product.id}
                </span>
              </div>
            </div>

            {/* Price Box Dynamic by Selected Variant */}
            <div className="p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-baseline gap-4 mb-1">
                <span className="text-3xl font-extrabold text-primary">
                  {displayedPrice}
                </span>
                {displayedOldPrice ? (
                  <>
                    <span className="text-lg text-on-surface-variant line-through">
                      {displayedOldPrice}
                    </span>
                    <span className="bg-secondary text-white text-[12px] px-2 py-0.5 rounded-md font-bold">
                      GIẢM GIÁ
                    </span>
                  </>
                ) : null}
              </div>
              <p className="text-sm text-on-surface-variant">
                Giá đã bao gồm VAT và miễn phí giao hàng toàn quốc.
              </p>
            </div>

            {/* Variations Selector */}
            <div className="space-y-4">
              <p className="text-sm font-bold mb-2">
                Chọn phiên bản biến thể (Màu sắc & Bộ nhớ):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      onClick={() => handleSelectVariant(idx)}
                      className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                        selectedVariantIndex === idx
                          ? "border-2 border-primary bg-primary-fixed-dim/30 shadow-md ring-2 ring-primary/20"
                          : "border-outline-variant hover:border-primary/50 bg-white"
                      }`}
                    >
                      <span className="text-xs font-extrabold text-primary mb-1">
                        {v.color || v.name}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">
                        {v.storageGb ? `${v.storageGb}GB` : ""}{" "}
                        {v.ramGb ? `· ${v.ramGb}GB RAM` : ""}
                      </span>
                      <span className="text-sm font-bold text-primary mt-2">
                        {v.newPrice || v.price}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 border border-primary rounded-xl text-xs font-bold text-primary">
                    256GB - Mặc định
                  </div>
                )}
              </div>
            </div>

            {/* Location & Status Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm pt-2">
                <MapPin size={20} className="text-on-surface-variant" />
                <span className="font-medium">Xem kho hàng tại:</span>
                <select className="bg-transparent border-none focus:ring-0 font-bold text-primary py-0 cursor-pointer pl-1 outline-none">
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                </select>
              </div>
              {/* Out of Stock Warning */}
              {isOutOfStock && (
                <div className="flex items-center gap-2 text-sm text-error font-bold mt-2">
                  <AlertCircle size={18} />
                  <span>Hết hàng</span>
                </div>
              )}
            </div>

            {/* Promotions */}
            <div className="border border-outline-variant rounded-xl overflow-hidden mt-4">
              <div className="bg-surface-container-high px-4 py-3 flex items-center gap-2">
                <Tag size={20} className="text-primary" />
                <span className="font-bold text-sm uppercase">
                  Khuyến mãi hấp dẫn
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-sm leading-relaxed">
                    Giảm thêm 500.000đ khi thanh toán qua <b>PinkPay</b>.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-sm leading-relaxed">
                    Thu cũ đổi mới hỗ trợ trợ giá lên đến 2.000.000đ.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="text-sm leading-relaxed">
                    Tặng Ốp lưng thời trang &amp; Miếng dán cường lực cao cấp.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions (Dynamic based on Stock) */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {isOutOfStock ? (
                <>
                  <button
                    className="col-span-2 bg-surface-dim text-on-surface-variant py-4 rounded-lg font-bold text-lg cursor-not-allowed opacity-60"
                    disabled
                  >
                    HẾT HÀNG
                  </button>
                  <button
                    className="flex flex-col items-center justify-center border-2 border-outline-variant text-on-surface-variant py-3 rounded-lg font-bold text-sm cursor-not-allowed opacity-60"
                    disabled
                  >
                    TRẢ GÓP 0%
                    <span className="text-[10px] font-normal opacity-80 mt-0.5">
                      Tạm dừng
                    </span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface-variant py-3 rounded-lg font-bold text-sm cursor-not-allowed opacity-60"
                    disabled
                  >
                    <ShoppingBag size={20} /> THÊM GIỎ HÀNG
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="col-span-2 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-secondary transition-all active:scale-[0.98] shadow-md shadow-primary/20"
                  >
                    MUA NGAY
                  </button>
                  <button className="flex flex-col items-center justify-center border-2 border-primary text-primary py-3 rounded-lg font-bold text-sm hover:bg-primary-fixed-dim transition-all active:scale-95">
                    TRẢ GÓP 0%
                    <span className="text-[10px] font-normal opacity-80 mt-0.5">
                      Qua thẻ tín dụng
                    </span>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-lg font-bold text-sm hover:bg-primary-fixed-dim transition-all active:scale-95"
                  >
                    <ShoppingBag size={20} /> THÊM GIỎ HÀNG
                  </button>
                </>
              )}
            </div>

            {/* OOS Warning below actions */}
            {isOutOfStock && (
              <div className="hidden md:block mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant">
                <p className="text-sm font-bold mb-3 flex items-center gap-2">
                  <BellRing className="text-primary" size={18} /> Thông báo khi
                  có hàng
                </p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    placeholder="Email hoặc Số điện thoại"
                    type="text"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary transition-colors">
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Bento Grid (Desktop V5 Style maintained in Unified V7) */}
        <section className="mb-16 mt-8">
          <h2 className="font-headline-md text-[24px] md:text-headline-md mb-8 text-center font-bold">
            Đặc điểm nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(214,51,108,0.06)] border border-outline-variant/50 flex flex-col justify-center gap-4 transform transition-transform hover:-translate-y-1">
              <Smartphone size={40} className="text-primary mb-2" />
              <div>
                <h3 className="font-bold text-xl mb-2 text-on-surface">
                  Màn hình PinkDisplay 6.7"
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Tần số quét 120Hz mượt mà, độ sáng cực đại 2000 nits cho trải
                  nghiệm thị giác sống động dưới mọi điều kiện ánh sáng.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-high p-8 rounded-2xl flex flex-col gap-4 transform transition-transform hover:-translate-y-1">
              <Camera size={40} className="text-primary mb-2" />
              <div>
                <h3 className="font-bold text-lg mb-1">Hệ thống Camera AI</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Cảm biến chính 108MP cho ảnh sắc nét đến từng chi tiết.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-high p-8 rounded-2xl flex flex-col gap-4 transform transition-transform hover:-translate-y-1">
              <Cpu size={40} className="text-primary mb-2" />
              <div>
                <h3 className="font-bold text-lg mb-1">Chip P14 Ultra</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Hiệu năng vượt trội, xử lý đa nhiệm không độ trễ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications & Full Review Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <section className="prose prose-pink max-w-none">
              <h2 className="font-headline-md text-headline-md mb-6 border-b border-outline-variant/30 pb-4 font-bold">
                Đánh giá chi tiết {product.name}
              </h2>

              <div className="bg-surface-container-low p-5 rounded-xl mb-8 border-l-[6px] border-primary shadow-sm">
                <p className="font-bold mb-3 text-lg">Mục lục:</p>
                <ul className="text-sm space-y-2 list-none p-0 inline-block font-semibold">
                  <li>
                    <a
                      href="#thiet-ke"
                      className="text-primary hover:underline hover:text-secondary flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Thiết kế sang trọng đầy tinh tế
                    </a>
                  </li>
                  <li>
                    <a
                      href="#man-hinh"
                      className="text-primary hover:underline hover:text-secondary flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Màn hình rực rỡ sắc nét
                    </a>
                  </li>
                  <li>
                    <a
                      href="#camera"
                      className="text-primary hover:underline hover:text-secondary flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Camera đỉnh cao công nghệ
                    </a>
                  </li>
                </ul>
              </div>

              <div id="thiet-ke" className="mb-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-primary text-sm">
                    1
                  </div>{" "}
                  Thiết kế sang trọng đầy tinh tế
                </h3>
                <p className="mb-5 text-on-surface-variant leading-relaxed text-[15px]">
                  Sản phẩm mang trong mình ngôn ngữ thiết kế tối giản nhưng
                  không kém phần đẳng cấp. Khung viền làm từ hợp kim nhôm hàng
                  không vũ trụ kết hợp cùng mặt lưng kính nhám tạo nên một cảm
                  giác cầm nắm vô cùng chắc chắn và cao cấp.
                </p>
                <div className="w-full aspect-video bg-surface-container-low rounded-2xl overflow-hidden mb-4 shadow-sm border border-outline-variant/30">
                  <img
                    src={selectedVariant?.image || product.image}
                    className="w-full h-full object-cover"
                    alt="Detail"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar: Tech Specs (Sticky) */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-outline-variant/50 shadow-[0_4px_24px_rgba(214,51,108,0.06)] lg:sticky lg:top-28">
              <h3 className="font-bold text-xl mb-6 border-b border-outline-variant/30 pb-4 text-on-surface">
                Thông số kỹ thuật
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-on-surface-variant text-sm shrink-0">
                    Màn hình:
                  </span>
                  <span className="text-sm font-semibold text-right">
                    6.7 inch, PinkDisplay LTPO
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-t border-outline-variant/30 pt-4">
                  <span className="text-on-surface-variant text-sm shrink-0">
                    Camera:
                  </span>
                  <span className="text-sm font-semibold text-right">
                    Chính 108MP &amp; Phụ 12MP
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-t border-outline-variant/30 pt-4">
                  <span className="text-on-surface-variant text-sm shrink-0">
                    Chipset:
                  </span>
                  <span className="text-sm font-semibold text-right">
                    P14 Ultra AI Process
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-t border-outline-variant/30 pt-4">
                  <span className="text-on-surface-variant text-sm shrink-0">
                    RAM:
                  </span>
                  <span className="text-sm font-semibold text-right">
                    12GB LPDDR5X
                  </span>
                </div>
                <div className="flex justify-between items-start gap-4 border-t border-outline-variant/30 pt-4">
                  <span className="text-on-surface-variant text-sm shrink-0">
                    Pin:
                  </span>
                  <span className="text-sm font-semibold text-right">
                    5000mAh, Sạc 45W
                  </span>
                </div>
              </div>
              <button className="w-full mt-8 py-3.5 bg-surface-container-high rounded-xl text-primary font-bold hover:bg-primary-fixed transition-all">
                Xem cấu hình chi tiết
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Desktop Sticky Bar (Hidden on Mobile) */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white shadow-[0_-8px_24px_rgba(214,51,108,0.12)] z-50 transform transition-transform duration-500 hidden md:block ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-[1200px] mx-auto px-margin-desktop py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="w-14 h-14 object-contain bg-surface-container-low rounded-lg p-1.5 shadow-inner"
              src={selectedVariant?.image || product.image}
              alt={product.name}
            />
            <div>
              <p className="font-bold text-sm text-on-surface-variant">
                {product.name}
              </p>
              <p className="text-primary font-extrabold text-xl leading-tight">
                {displayedPrice}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {isOutOfStock ? (
              <>
                <button
                  className="px-8 py-3 bg-surface-dim text-on-surface-variant rounded-xl font-bold cursor-not-allowed"
                  disabled
                >
                  HẾT HÀNG
                </button>
                <button
                  className="p-3 border-2 border-outline-variant text-on-surface-variant rounded-xl cursor-not-allowed"
                  disabled
                >
                  <ShoppingBag size={24} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all shadow-md shadow-primary/20 active:scale-95"
                >
                  MUA NGAY
                </button>
                <button
                  onClick={handleAddToCart}
                  className="p-3 border-2 border-primary text-primary rounded-xl hover:bg-primary-fixed transition-all active:scale-95"
                >
                  <ShoppingBag size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom NavBar (Visible only on Mobile, V6 style applied in V7 responsive merge) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-surface dark:bg-inverse-surface border-t border-outline-variant md:hidden shadow-[0_-8px_24px_rgba(214,51,108,0.12)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[12px] font-semibold mt-1">Thông số</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">star</span>
          <span className="text-[12px] font-semibold mt-1">Đánh giá</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[12px] font-semibold mt-1">Hỏi đáp</span>
        </button>
        {isOutOfStock ? (
          <button
            className="flex flex-col items-center justify-center bg-surface-dim text-on-surface-variant rounded-xl px-4 py-2 cursor-not-allowed opacity-60"
            disabled
          >
            <ShoppingBag size={20} />
            <span className="text-[12px] font-bold mt-1">Hết Hàng</span>
          </button>
        ) : (
          <button
            onClick={handleBuyNow}
            className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-2 active:scale-95 transition-transform"
          >
            <ShoppingBag size={20} />
            <span className="text-[12px] font-bold mt-1">Mua ngay</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default ProductDetail;
