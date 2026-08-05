import React, { useState } from "react";
import { Star, X, ShoppingCart, HeartCrack } from "lucide-react";
import { AccountShell } from "../components/AccountShell";

type Product = {
  id: string;
  name: string;
  badge?: {
    label: string;
    bgColor: string;
    textColor: string;
  };
  image: string;
  rating: string;
  reviewsCount: number;
  price: string;
  oldPrice?: string;
};

const MOCK_WISHLIST: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro Max",
    badge: {
      label: "NEW",
      bgColor: "bg-secondary-container",
      textColor: "text-on-secondary-container",
    },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6nN3Ttztz-eUntxTNY7Sb4DBEmqQIcAnSsRtbVqx-bW9L-H0tq6kfU6ifSlj0UNjvJ3ztWGjiCSaIVvOzMEjnJ1TTqJMqFJsGt3TonzaGukApoGRiW2lBaLm5ZDxLava0oy3os1XrGWIYnNovYg8KlUMpC1ZR0jv6unl-BtXUvID7emyHQ2CbEqeR1UY_X5g4kKCihoF4Fong0n4cEFuxXmqM29jIaghs59sJ60vONY4ucJ76WV7_",
    rating: "4.9",
    reviewsCount: 124,
    price: "34.990.000₫",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    badge: {
      label: "-15%",
      bgColor: "bg-tertiary",
      textColor: "text-on-tertiary",
    },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAovpAyH25PlOUdH_rXsjlCGybYDR1226O7B6J_UGvcmAedJw4Ul1iQKCo4sdHZUNL-lG5voEAHWCI14FmJ07N2qhQthf0D8BBbyRWpyVIqpYoZ1cEz3mSq5kamKw60-_YvGmXjdsWzz8Ki-qOOZzJNu5KfwZ7ihLZKRwJ0rrpz8QyJRgodk2LQFPSuJn_vAW6FmycY7UVHcV4iKZAO09tMkAMGVuzQFnub3FT3WFyFWT6WWaVCpFaJ",
    rating: "4.8",
    reviewsCount: 89,
    price: "28.040.000₫",
    oldPrice: "32.990.000₫",
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFqjdznyg5RXCYhMcjz9w2CVOMPF0UFtCeeWOAThm0gNChXJmMV8PCvNKtB-mvd9ldCTT4TFkcj2__XkCb0aYCaKmhS4nAug0RbS4QOXB7XOxP1ehxvQHRQrn6aibbeif3eituejJbrFvK6DzZJmJBijrUslTD031Ny8N3GWJ99XH0hCEd77ZDRQYn7j4b4jYnpHaxaV59Y6XPUQCnJX3wu7y-mh1smv0rs08RaIyTGCRFMwdRLikh",
    rating: "4.9",
    reviewsCount: 210,
    price: "5.990.000₫",
  },
  {
    id: "4",
    name: "Apple Watch Series 9",
    badge: {
      label: "-10%",
      bgColor: "bg-tertiary",
      textColor: "text-on-tertiary",
    },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKtKUj7_4eDPLR9Jgh4hUlOKWmSvD55ghSK0jCG_4tr1m16cE5UYbQZAaWP81Zhoi11mm3Zd9Zu91vYY5xGYa4nyirAxz33gd0w-k3kg2R0HuYWotIEK703SiQ06y4c5DN7RxibKCCbynJfsss0vPRS9kySN9gSRSfFjGpViOCRrMBcGL1qE5wimlzI_oUisa-dLkisj_mbnxktUMZGBHSDMGWaX_Ipqo6aTbcSZsCrO0xzj8kKLQ_",
    rating: "4.7",
    reviewsCount: 56,
    price: "9.890.000₫",
    oldPrice: "10.990.000₫",
  },
  {
    id: "5",
    name: "iPad Air 5",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMQunTx0ldJOe8mAlN90djUodQXlnIti3voQ33rsB3MOhVjDT5Qem2ZPqHdX7MbOu2tKqAU6GZg54XEf3YulMav4uv5c13eev3lgok_GXFS2479od_d29JkcOk8xpR_539rRbCGCg1HOePOmMxsa8pSyv1XR_QqFWQSsexa5oYtyd_QDw8Qb__HpSj4NMLbR5TWnnNiYMe7MACKiyoQDAOwwm8yZEJj2GgkPyqASVOa1qEiBelvRA-",
    rating: "4.9",
    reviewsCount: 112,
    price: "15.490.000₫",
  },
];

export function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>(MOCK_WISHLIST);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AccountShell title="Sản phẩm yêu thích">
      {wishlist.length > 0 ? (
        <>
          <div className="mb-6 flex justify-between items-baseline">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Sản phẩm yêu thích
            </h1>
            <span className="text-sm font-semibold text-on-surface-variant opacity-80">
              {wishlist.length} sản phẩm
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 relative group flex flex-col h-full border border-border"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors z-10 bg-surface-container/50 hover:bg-surface-container rounded-full p-2"
                  aria-label="Remove from wishlist"
                >
                  <X size={18} />
                </button>

                {/* Badge */}
                {product.badge && (
                  <div
                    className={
                      "absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded z-10 " +
                      product.badge.bgColor +
                      " " +
                      product.badge.textColor
                    }
                  >
                    {product.badge.label}
                  </div>
                )}

                {/* Image */}
                <div className="relative w-full aspect-square mb-4 bg-surface-container-low rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    className="w-4/5 h-4/5 object-contain mix-blend-multiply"
                    alt={product.name}
                    src={product.image}
                  />
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-sm md:text-base font-semibold text-on-surface mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star
                      size={14}
                      className="text-tertiary-container fill-tertiary-container"
                    />
                    <span className="text-xs font-semibold text-on-surface-variant opacity-80">
                      {product.rating} ({product.reviewsCount} đánh giá)
                    </span>
                  </div>

                  <div className="mt-auto pt-2">
                    <div className="flex flex-col gap-0.5 mb-4 items-start">
                      <span className="text-lg font-bold text-primary">
                        {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs font-semibold text-on-surface-variant line-through opacity-70">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <button className="w-full bg-primary-container text-on-primary-container py-2.5 rounded-lg font-semibold hover:bg-primary-container/90 transition-colors active:scale-[0.98] flex justify-center items-center gap-2 text-sm">
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
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-container/90 transition-colors active:scale-[0.98] text-sm">
            Tiếp tục mua sắm
          </button>
        </div>
      )}
    </AccountShell>
  );
}
