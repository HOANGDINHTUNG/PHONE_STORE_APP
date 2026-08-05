import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/productService";
import { Product } from "../../types";
import { useStore } from "../../context/StoreContext";

const EmptyCartState = () => {
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const { cart, addToCart } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const prod = await fetchProducts();
        // Giả lập "Bán chạy" bằng cách lấy ngẫu nhiên hoặc cắt 4 sản phẩm đầu
        setSuggestedProducts(prod.slice(0, 4));
      } catch (error) {
        console.error("Error fetching suggestions for empty cart", error);
      }
    };
    loadData();
  }, []);

  const handleAdd = (prod: Product) => {
    addToCart({ ...prod, quantity: 1, active: true } as any);
  };

  return (
    <>
      <style>{`
        @keyframes float-cart {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-cart {
          animation: float-cart 3s ease-in-out infinite;
        }
        .hover-card:hover {
            box-shadow: 0 12px 24px rgba(214, 51, 108, 0.12);
            transform: translateY(-4px);
        }
      `}</style>

      {/* Empty State Banner */}
      <section className="w-full max-w-[1200px] mx-auto px-lg py-xl flex flex-col items-center justify-center text-center mt-4">
        <div className="animate-float-cart mb-lg">
          <svg
            fill="none"
            height="240"
            viewBox="0 0 240 240"
            width="240"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="120"
              cy="120"
              fill="var(--color-primary-fixed)"
              r="100"
            ></circle>
            <path
              d="M70 90H170L160 170H80L70 90Z"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
            ></path>
            <path
              d="M95 90C95 70 100 60 120 60C140 60 145 70 145 90"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeWidth="6"
            ></path>
            <circle
              cx="105"
              cy="125"
              fill="var(--color-primary-container)"
              r="5"
            ></circle>
            <circle
              cx="135"
              cy="125"
              fill="var(--color-primary-container)"
              r="5"
            ></circle>
            <path
              d="M110 145C110 145 115 150 120 150C125 150 130 145 130 145"
              stroke="var(--color-primary-container)"
              strokeLinecap="round"
              strokeWidth="3"
            ></path>
            <rect
              fill="var(--color-secondary-fixed)"
              height="20"
              rx="4"
              transform="rotate(-15 50 150)"
              width="20"
              x="50"
              y="150"
            ></rect>
            <rect
              fill="var(--color-secondary-fixed)"
              height="15"
              rx="3"
              transform="rotate(20 180 100)"
              width="15"
              x="180"
              y="100"
            ></rect>
          </svg>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface mb-sm font-bold">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[450px] px-md mx-auto mb-xl leading-relaxed">
          Hãy lựa chọn chiếc điện thoại phù hợp và quay lại đây để hoàn tất đơn
          hàng.
        </p>
        <Link
          className="bg-primary text-white px-xl py-3 rounded-full font-bold text-label-sm hover:bg-secondary transition-all duration-200 active:scale-95 shadow-md inline-block whitespace-nowrap"
          to="/"
        >
          Tiếp tục mua sắm
        </Link>
      </section>

      {/* Suggested Products: Best Sellers */}
      {suggestedProducts.length > 0 && (
        <section className="bg-surface-container-low py-xl mt-8">
          <div className="max-w-[1200px] mx-auto px-lg">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Sản phẩm bán chạy
              </h2>
              <Link
                to="/products"
                className="text-primary font-bold text-label-sm hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
              {suggestedProducts.map((p, idx) => {
                const added = cart.some((item) => item.id === p.id);
                return (
                  <div
                    key={p.id}
                    className="bg-surface-container-lowest p-lg rounded-xl flex flex-col hover-card transition-all duration-300 border border-outline-variant/30"
                  >
                    <div
                      className="aspect-square mb-md bg-white rounded-lg overflow-hidden flex items-center justify-center p-md cursor-pointer"
                      onClick={() => navigate(`/product/${p.slug || p.id}`)}
                    >
                      <img
                        className="w-full h-full object-contain mix-blend-multiply"
                        src={p.image}
                        alt={p.name}
                      />
                    </div>
                    <div className="flex-grow">
                      {idx === 0 && (
                        <span className="text-secondary font-label-sm text-[12px] uppercase font-bold tracking-wider mb-xs block">
                          Best Seller
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="text-secondary font-label-sm text-[12px] uppercase font-bold tracking-wider mb-xs block">
                          Mới về
                        </span>
                      )}
                      {idx > 1 && (
                        <span className="invisible font-label-sm text-[12px] block mb-xs">
                          Spacer
                        </span>
                      )}
                      <h3
                        className="font-body-lg text-body-lg font-bold text-on-surface mb-xs cursor-pointer hover:text-primary transition-colors line-clamp-1"
                        onClick={() => navigate(`/product/${p.slug || p.id}`)}
                      >
                        {p.name}
                      </h3>
                      <div className="flex items-baseline gap-sm mb-md flex-wrap">
                        <span className="text-primary font-extrabold text-body-lg">
                          {p.newPrice || p.price}
                        </span>
                        {p.oldPrice &&
                          p.oldPrice !== (p.newPrice || p.price) && (
                            <span className="text-on-surface-variant text-label-sm font-semibold line-through">
                              {p.oldPrice}
                            </span>
                          )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={added}
                      className={`w-full py-2.5 rounded-lg font-bold text-label-sm transition-colors duration-200 active:scale-95 ${added ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : "border-2 border-primary text-primary hover:bg-primary hover:text-white"}`}
                    >
                      {added ? "Đã thêm" : "Thêm vào giỏ"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default EmptyCartState;
