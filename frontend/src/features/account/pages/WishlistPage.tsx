import React, { useEffect, useState } from "react";
import { Star, X, ShoppingCart, HeartCrack, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountShell } from "../components/AccountShell";
import { useStore } from "../../../context/StoreContext";
import { fetchWishlist, mapWishlistItemToProduct } from "../../../api/wishlistService";
import { Product } from "../../../types";

export function WishlistPage() {
  const { wishlist: storeWishlist, toggleWishlist, addToCart } = useStore();
  const [items, setItems] = useState<Product[]>(storeWishlist || []);
  const [loading, setLoading] = useState<boolean>(true);

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
    toggleWishlist(product);
    setItems((prev) => prev.filter((p) => String(p.id) !== String(product.id)));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <AccountShell title="Sản phẩm yêu thích">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm text-on-surface-variant font-medium">
            Đang tải danh sách sản phẩm yêu thích...
          </p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mb-6 flex justify-between items-baseline">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Sản phẩm yêu thích
            </h1>
            <span className="text-sm font-semibold text-on-surface-variant opacity-80">
              {items.length} sản phẩm
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div
                key={String(product.id)}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative group flex flex-col h-full border border-border"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product)}
                  className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors z-10 bg-surface-container/50 hover:bg-surface-container rounded-full p-2"
                  aria-label="Remove from wishlist"
                >
                  <X size={18} />
                </button>

                {/* Badge */}
                {product.badge && (
                  <div
                    className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded z-10 bg-secondary-container text-on-secondary-container"
                  >
                    {product.badge}
                  </div>
                )}

                {/* Image */}
                <Link
                  to={product.slug ? `/product/${product.slug}` : `/product/${product.id}`}
                  className="relative w-full aspect-square mb-4 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform"
                >
                  <img
                    className="w-4/5 h-4/5 object-contain mix-blend-multiply"
                    alt={product.name}
                    src={product.image || "/images/placeholder.png"}
                  />
                </Link>

                {/* Content */}
                <div className="flex-grow flex flex-col">
                  <Link
                    to={product.slug ? `/product/${product.slug}` : `/product/${product.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <h3 className="text-sm md:text-base font-semibold text-on-surface mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <Star
                      size={14}
                      className="text-tertiary-container fill-tertiary-container"
                    />
                    <span className="text-xs font-semibold text-on-surface-variant opacity-80">
                      {product.rating ?? 5.0} ({product.reviewsCount ?? 0} đánh giá)
                    </span>
                  </div>

                  <div className="mt-auto pt-2">
                    <div className="flex flex-col gap-0.5 mb-4 items-start">
                      <span className="text-lg font-bold text-primary">
                        {product.price || (product.newPrice ? product.newPrice : "Liên hệ")}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs font-semibold text-on-surface-variant line-through opacity-70">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary-container text-on-primary-container py-2.5 rounded-lg font-semibold hover:bg-primary-container/90 transition-colors active:scale-[0.98] flex justify-center items-center gap-2 text-sm"
                    >
                      <ShoppingCart size={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center h-full bg-surface-container-lowest rounded-xl shadow-sm border border-border">
          <HeartCrack className="w-16 h-16 text-outline-variant mb-4 opacity-70" />
          <h3 className="text-xl font-bold text-on-surface mb-2">
            Chưa có sản phẩm nào trong danh sách yêu thích
          </h3>
          <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
            Hãy thêm những sản phẩm bạn yêu thích tiếp tục để dễ dàng mua sắm
            sau này.
          </p>
          <Link
            to="/"
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-container/90 transition-colors active:scale-[0.98] text-sm inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
    </AccountShell>
  );
}
