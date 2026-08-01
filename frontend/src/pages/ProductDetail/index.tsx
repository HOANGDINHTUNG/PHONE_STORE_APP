import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Sparkles,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Button, ProductCard } from "../../components/cart_and_pdp/Shared";
import { useStore } from "../../context/StoreContext";
import { fetchProductBySlug } from "../../api/productService";
import { Product } from "../../types";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedStorage, setSelectedStorage] = useState("128GB");
  const [selectedColor, setSelectedColor] = useState("Hồng");
  const [mainImage, setMainImage] = useState("/images/banner1.png");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchProductBySlug(slug);
      if (active) {
        if (data) {
          setProduct(data);
          setMainImage(data.image);
        } else {
          // If no product found, redirect or show error
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

  const images = [
    "/images/banner1.png",
    "/images/prod_s24.png",
    "/images/prod_xiaomi14.png",
    "/images/prod_oppofind.png",
  ];

  const storages = ["128GB", "256GB", "512GB"];
  const colors = [
    { name: "Hồng", hex: "#E91E63" },
    { name: "Trắng", hex: "#FFFFFF", border: true },
    { name: "Đen", hex: "#333333" },
  ];

  const promos = [
    "Giảm thêm 500.000đ khi thanh toán qua PinkPay.",
    "Thu cũ đổi mới hỗ trợ đến 2.000.000đ.",
    "Tặng Ốp lưng thời trang & Miếng dán cường lực cao cấp.",
  ];

  const bundleProducts = [
    {
      id: 201,
      name: "Ốp lưng Clear Case MagSafe",
      price: "290.000đ",
      oldPrice: "450.000đ",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop&q=80",
      badge: "SALE",
    },
    {
      id: 202,
      name: "Sạc nhanh GaN 67W Anker",
      price: "650.000đ",
      oldPrice: "890.000đ",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80",
      badge: "HOT",
    },
    {
      id: 203,
      name: "Tai nghe Bluetooth Buds FE",
      price: "1.890.000đ",
      oldPrice: "2.490.000đ",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const specs = [
    { name: "Màn hình", value: "6.7 inch, Super Retina XDR OLED, 120Hz" },
    { name: "Camera sau", value: "Chính 48MP & Phụ 12MP" },
    { name: "Camera trước", value: "12MP" },
    { name: "Chipset", value: "Pink Processor A18 Pro" },
    { name: "RAM", value: "8 GB" },
    { name: "Bộ nhớ trong", value: "128 GB / 256 GB / 512 GB" },
    { name: "Pin", value: "4380 mAh, Sạc nhanh 45W" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex text-lg text-gray-500 font-bold items-center justify-center">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-xs text-gray-500 mb-4 flex flex-wrap items-center gap-2">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Điện thoại</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-[32px] p-6 xl:p-8 shadow-sm grid gap-10 lg:grid-cols-[1.25fr_0.95fr] mb-10">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[32px] border border-gray-100 bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[520px] max-h-[600px]">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full w-full object-contain"
              />
              <button className="absolute top-5 right-5 rounded-full border border-gray-200 bg-white p-3 text-gray-500 shadow-sm transition hover:text-[#E91E63]">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 overflow-x-auto py-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`rounded-3xl border p-2 bg-white transition-all ${mainImage === img ? "border-[#E91E63] shadow-sm" : "border-gray-200"}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-20 w-20 object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="rounded-3xl border border-gray-100 bg-[#FBFBFB] p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#E91E63]" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Bảo hành 12 tháng
                  </p>
                  <p>Hỗ trợ sửa chữa bảo hành chính hãng</p>
                </div>
              </div>
              <div className="rounded-3xl border border-gray-100 bg-[#FBFBFB] p-4 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-[#E91E63]" />
                <div>
                  <p className="font-semibold text-gray-800">
                    1 đổi 1 trong 30 ngày
                  </p>
                  <p>Liên tục đổi mới nếu có lỗi nhà sản xuất</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:sticky lg:top-28 self-start">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                {product.description ||
                  "Sản phẩm chính hãng với công nghệ hiện đại mang lại trải nghiệm hoàn hảo."}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span>
                  {product.rating || 5} ({product.reviewsCount || 100} đánh giá)
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#F5D3DF] bg-[#FFF0F4] p-6 grid gap-5">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-2">
                  Giá bán
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <p className="text-4xl font-bold text-[#E91E63]">
                    {product.newPrice}
                  </p>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 line-through">
                      {product.oldPrice || ""}
                    </p>
                    {product.oldPrice && (
                      <span className="inline-flex rounded-full bg-[#E91E63] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        GIẢM GIÁ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-600 mb-2">
                    Chọn bộ nhớ
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {storages.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedStorage === storage
                            ? "border-[#E91E63] bg-[#FFF0F4] text-[#E91E63]"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-600 mb-2">
                    Chọn màu sắc
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${selectedColor === color.name
                            ? "border-[#E91E63] bg-[#FFF0F4] text-[#E91E63]"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor: color.hex,
                            border: color.border ? "1px solid #ddd" : "none",
                          }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-600 mb-2">
                    Số lượng
                  </p>
                  <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-white">
                    <button
                      type="button"
                      className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                      onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center text-sm font-semibold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                      onClick={() => setQuantity((qty) => qty + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
              <div className="flex items-center gap-2 text-yellow-800 font-bold text-sm mb-3">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <span>Ưu đãi nổi bật</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                {promos.map((promo, idx) => (
                  <li key={idx}>{promo}</li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full py-4 text-base"
                onClick={() =>
                  addToCart({
                    ...product,
                    selectedStorage,
                    selectedColor,
                    quantity,
                  })
                }
              >
                MUA NGAY
              </Button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  size="md"
                  className="py-3 text-xs text-[#E91E63] border-[#E91E63] hover:bg-[#FFF0F4]"
                >
                  TRẢ GÓP 0%
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="py-3 text-xs border-gray-300 flex items-center justify-center gap-2"
                  onClick={() =>
                    addToCart({
                      ...product,
                      selectedStorage,
                      selectedColor,
                      quantity,
                    })
                  }
                >
                  <ShoppingCart className="w-4 h-4 text-gray-500" />
                  <span>THÊM GIỎ HÀNG</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">
              Bảo hành chính hãng
            </p>
            <p className="text-sm text-gray-500 mt-2">12 tháng toàn quốc</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">
              Đổi trả dễ dàng
            </p>
            <p className="text-sm text-gray-500 mt-2">1 đổi 1 trong 30 ngày</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">
              Ưu đãi PinkPay
            </p>
            <p className="text-sm text-gray-500 mt-2">Giảm ngay 500.000đ</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-5">
            Mua kèm tiết kiệm hơn
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {bundleProducts.map((item) => (
              <ProductCard
                key={item.id}
                image={item.image}
                badge={item.badge}
                title={item.name}
                price={item.price}
                oldPrice={item.oldPrice}
                buttonText="Chọn mua"
                onAdd={() => addToCart(item)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
              Đặc điểm nổi bật
            </h3>
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-center">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Thiết kế thanh lịch, màu hồng thời thượng
                  </h4>
                  <p>
                    PinkPhone Ultra X 2024 nổi bật với thiết kế nguyên khối, mặt
                    lưng kính mờ và đường viền bo cong mềm mại, phù hợp với
                    phong cách trẻ trung.
                  </p>
                </div>
                <img
                  src="/images/login_bg.png"
                  alt="Thiết kế"
                  className="h-64 w-full rounded-3xl object-cover border border-gray-100"
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-center">
                <img
                  src="/images/prod_s24.png"
                  alt="Màn hình"
                  className="h-64 w-full rounded-3xl object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Màn hình rực rỡ, chuyển động mượt mà
                  </h4>
                  <p>
                    Màn hình Super Retina XDR OLED 120Hz đem lại độ sáng cao,
                    màu sắc chân thực và trải nghiệm giải trí tuyệt vời.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Hiệu năng mạnh mẽ cho mọi nhu cầu
                </h4>
                <p>
                  Chip Pink Processor A18 Pro cùng 8GB RAM giúp máy chạy đa
                  nhiệm ổn định, chơi game và xử lý đa ứng dụng không giật lag.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm self-start lg:sticky lg:top-28 h-fit">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
              Thông số kỹ thuật
            </h3>
            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm"
                >
                  <span className="text-gray-500 font-medium">{spec.name}</span>
                  <span className="text-gray-800 font-semibold text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
