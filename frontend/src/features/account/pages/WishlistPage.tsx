import React, { useEffect, useState } from "react";
import {
  Star,
  X,
  ShoppingCart,
  HeartCrack,
  Loader2,
  Trash2,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { useStore } from "../../../context/StoreContext";
import { fetchWishlist } from "../../../api/wishlistService";
import { Product } from "../../../types";

export function WishlistPage() {
  const { wishlist: storeWishlist, toggleWishlist, addToCart } = useStore();
  const [items, setItems] = useState<Product[]>(storeWishlist || []);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadWishlistData = async () => {
      setLoading(true);
      try {
        const dbItems = await fetchWishlist();
        if (isMounted) {
          if (dbItems && dbItems.length > 0) {
            setItems(dbItems);
          } else {
            setItems(storeWishlist || []);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch wishlist from API:", err);
        if (isMounted) setItems(storeWishlist || []);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadWishlistData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = (product: Product) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?",
      )
    ) {
      toggleWishlist(product);
      setItems((prev) =>
        prev.filter((p) => String(p.id) !== String(product.id)),
      );
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <AccountShell title="Sản phẩm yêu thích">
      <style>{`
        .product-card-shadow {
            box-shadow: 0 4px 20px rgba(214, 51, 108, 0.08);
        }
        .product-card-shadow:hover {
            box-shadow: 0 8px 32px rgba(214, 51, 108, 0.16);
            transform: translateY(-4px);
        }
      `}</style>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[14px] text-on-surface-variant font-medium">
            Đang tải danh sách sản phẩm yêu thích...
          </p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mb-8">
            <h1 className="text-[24px] font-semibold text-on-surface mb-2">
              Sản phẩm yêu thích
            </h1>
            <p className="text-[16px] text-on-surface-variant">
              Danh sách các mẫu điện thoại bạn đã quan tâm và lưu lại.
            </p>
          </div>

          {/* Product Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => {
              const productUrl = product.slug
                ? `/product/${product.slug}`
                : `/product/${product.id}`;
              const pPrice = product.price || product.newPrice || "Liên hệ";
              const pOldPrice = product.oldPrice;

              return (
                <div
                  key={String(product.id)}
                  className="bg-surface-container-lowest rounded-xl p-6 product-card-shadow transition-all duration-300 relative group border border-outline-variant/30"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-4 right-4 text-outline hover:text-error transition-colors p-2 bg-white/80 rounded-full z-10"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 size={24} />
                  </button>

                  {/* Image */}
                  <Link
                    to={productUrl}
                    className="h-64 mb-6 flex items-center justify-center overflow-hidden block"
                  >
                    <img
                      className="h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      alt={product.name}
                      src={product.image || "/images/placeholder.png"}
                    />
                  </Link>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-semibold text-[12px]">
                        Còn hàng
                      </span>
                      {product.badge && (
                        <span className="text-on-surface-variant font-semibold text-[12px]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <Link
                      to={productUrl}
                      className="hover:text-primary transition-colors"
                    >
                      <h2 className="text-[20px] font-semibold text-on-surface line-clamp-1">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-primary font-bold text-[22px]">
                        {pPrice}
                      </span>
                      {pOldPrice && (
                        <span className="text-outline line-through text-[14px]">
                          {pOldPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-on-primary py-3 rounded-lg font-semibold hover:bg-secondary active:scale-95 transition-all flex items-center justify-center gap-2 text-[14px]"
                    >
                      <ShoppingCart size={18} /> Thêm giỏ
                    </button>
                    <button
                      onClick={() => navigate(productUrl)}
                      className="bg-surface-container-high text-on-surface-variant py-3 rounded-lg font-semibold hover:bg-surface-container-highest active:scale-95 transition-all text-[14px] flex items-center justify-center gap-2"
                    >
                      <Eye size={18} /> Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center min-h-[400px] h-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 product-card-shadow">
          <HeartCrack className="w-16 h-16 text-outline-variant mb-4 opacity-70" />
          <h3 className="text-[24px] font-bold text-on-surface mb-2">
            Chưa có sản phẩm nào
          </h3>
          <p className="w-full mx-auto text-[16px] text-on-surface-variant mb-6 max-w-[400px]">
            Danh sách yêu thích của bạn đang trống. Hãy thêm các sản phẩm bạn
            quan tâm để dễ dàng theo dõi nhé!
          </p>
          <Link
            to="/"
            className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors active:scale-95 text-[16px] inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
    </AccountShell>
  );
}
