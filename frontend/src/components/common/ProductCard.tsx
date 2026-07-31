import { useNavigate } from "react-router-dom";
import { Card, Rate, Button } from "antd";
import { HeartOutlined, HeartFilled, GiftOutlined } from "@ant-design/icons";
import { useStore } from "../../context/StoreContext";
import styles from "./ProductCard.module.css";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product & {
    brand: string;
    badgeType?: string;
    gift?: string;
    reviewsCount?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const navigate = useNavigate();

  const isFavorite = isInWishlist(product.id);

  return (
    <Card
      className={styles.card}
      hoverable
      onClick={() => navigate("/product")}
    >
      {/* Top Badges / Icons */}
      <div className={styles.cardTop}>
        {product.badge ? (
          <span
            className={`${styles.badge} ${styles[product.badgeType || "sale"]}`}
          >
            {product.badge}
          </span>
        ) : (
          <span />
        )}
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
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
      </div>

      {/* Brand & Subtitle */}
      <div className={styles.brandSub}>
        {product.brand.toUpperCase()} / TRẢ GÓP
      </div>

      {/* Product Name */}
      <h3 className={styles.productName}>{product.name}</h3>

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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Mua Ngay
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
