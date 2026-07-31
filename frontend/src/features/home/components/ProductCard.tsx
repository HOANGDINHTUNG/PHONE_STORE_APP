import { Gift, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import productStrip from "../../../assets/phone-product-strip.png";

export type Product = {
  name: string;
  brand: string;
  price: string;
  oldPrice: string;
  storage: string;
  badge: string;
  rating: string;
  imageIndex: number;
  promotion?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group relative flex h-full min-w-0 flex-col bg-white">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-surface-soft">
        <img
          src={productStrip}
          alt=""
          className="absolute top-1/2 h-auto w-[500%] max-w-none -translate-y-1/2 transition duration-500 group-hover:scale-[1.03]"
          style={{ left: `-${product.imageIndex * 100}%` }}
        />
        <Link
          to="/san-pham/pinkphone-ultra-x"
          className="absolute inset-0 z-[1]"
          aria-label={`Xem chi tiết ${product.name}`}
        />
        <span className="absolute left-2 top-2 z-[2] rounded-md bg-primary px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">
          {product.badge}
        </span>
        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          className="absolute right-2 top-2 z-[2] grid size-8 place-items-center rounded-full bg-white/90 text-muted shadow-sm transition hover:text-primary"
          aria-label={liked ? `Bỏ thích ${product.name}` : `Yêu thích ${product.name}`}
          aria-pressed={liked}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <span className="w-fit rounded-md bg-neutral-soft px-2 py-1 text-[10px] font-medium text-muted">
          {product.storage}
        </span>
        <h3 className="mt-2 min-h-10 text-sm font-bold leading-5">
          <Link to="/san-pham/pinkphone-ultra-x" className="transition hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="pt-2">
          <p className="text-base font-extrabold text-primary">{product.price}</p>
          <p className="mt-1 text-xs text-muted line-through">{product.oldPrice}</p>
          <div className="mt-3 min-h-9">
            {product.promotion && (
              <p className="flex min-h-9 items-center gap-2 rounded-md bg-neutral-soft px-2 text-[10px] text-muted">
                <Gift size={12} className="shrink-0" />
                {product.promotion}
              </p>
            )}
          </div>
          <p className="mt-3 text-[11px] text-warning">
            ★★★★★ <span className="text-muted">({product.rating} đánh giá)</span>
          </p>
          <Link
            to="/san-pham/pinkphone-ultra-x"
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-primary text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
