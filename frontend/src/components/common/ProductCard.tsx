import { useNavigate } from "react-router-dom";
import { Card, Rate, Button } from "antd";
import { HeartOutlined, HeartFilled, GiftOutlined } from "@ant-design/icons";
import { useStore } from "../../context/StoreContext";
import { getDefaultProductImage } from "../../api/productService";
import styles from "./ProductCard.module.css";
import { Product } from "../../types";
import { StockBadge } from "./StockBadge";
import { resolveProductStock } from "../../utils/stock";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const navigate = useNavigate();

  const isFavorite = isInWishlist(product.id);
  const stock = resolveProductStock(product);
  const outOfStock = stock <= 0;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallbackSrc = getDefaultProductImage(product.brand, product.slug);
    if (e.currentTarget.src !== fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  return (
    <Card
      className={styles.card}
      hoverable
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
    >
      {/* Top Badges / Icons */}
      <div className={styles.cardTop}>
        <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-pink-600 to-rose-600 px-2.5 py-1 text-[11px] font-black uppercase text-white shadow-sm transition-transform hover:scale-105">
          {(() => {
            const parseNum = (str?: string) => (str ? parseInt(str.replace(/\D/g, "") || "0") : 0);
            const newP = parseNum(product.newPrice);
            const oldP = parseNum(product.oldPrice);
            let pct = 0;
            if (oldP > newP && newP > 0) {
              pct = Math.round(((oldP - newP) / oldP) * 100);
            }
            if (pct > 0) {
              return `GIẢM ${pct}%`;
            }
            if (product.badge && product.badge.includes("%")) {
              return product.badge.toUpperCase();
            }
            return "GIẢM 20%";
          })()}
        </span>
        <button
          className={styles.wishlistBtn}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          {isFavorite ? (
            <HeartFilled className={styles.heartFilled} />
          ) : (
            <HeartOutlined className={styles.heartOutlined} />
          )}
        </button>
      </div>

      {/* Image Container */}
      <div className={styles.imageContainer}>
        <img
          src={product.image || getDefaultProductImage(product.brand, product.slug)}
          alt={product.name}
          className={`${styles.productImage}${outOfStock ? ` ${styles.imageOos}` : ""}`}
          onError={handleImageError}
        />
        {outOfStock && <span className={styles.oosOverlay}>Hết hàng</span>}
      </div>

      {/* Brand & Subtitle */}
      <div className={styles.brandSub}>
        {(product.brand || "").toUpperCase()} / TRẢ GÓP
      </div>

      {/* Product Name */}
      <h3 className={styles.productName}>{product.name}</h3>

      <div className={styles.stockRow}>
        <StockBadge stock={stock} outOfStock={outOfStock} variant="compact" />
      </div>

      {/* Pricing */}
      <div className={styles.priceRow}>
        <span className={styles.newPrice}>{product.newPrice}</span>
        {product.oldPrice && (
          <span className={styles.oldPrice}>{product.oldPrice}</span>
        )}
      </div>

      {/* Gift/Promotion Strip */}
      {product.gift ? (
        <div className={styles.giftStrip}>
          <GiftOutlined className={styles.giftIcon} />
          <span className={styles.giftText}>{product.gift}</span>
        </div>
      ) : (
        <div className={styles.giftPlaceholder} />
      )}

      {/* Rating & Review */}
      {(product.rating || 0) > 0 ? (
        <div className={styles.ratingRow}>
          <Rate
            disabled
            defaultValue={product.rating || 0}
            className={styles.stars}
          />
          <span className={styles.reviewsCount}>
            ({product.reviewsCount} đánh giá)
          </span>
        </div>
      ) : (
        <div className={styles.ratingPlaceholder} />
      )}

      {/* Buy Button */}
      <div className={styles.btnWrapper}>
        <Button
          type="primary"
          block
          className={styles.buyBtn}
          disabled={outOfStock}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (outOfStock) return;
            addToCart({ ...product, stock, outOfStock });
          }}
        >
          {outOfStock ? "Hết hàng" : "Mua Ngay"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
