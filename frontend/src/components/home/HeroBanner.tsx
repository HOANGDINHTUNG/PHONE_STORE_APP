import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Button, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { fetchBanners, Banner } from '../../api/bannerService';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const navigate = useNavigate();
  const { addToCart } = useStore();

  useEffect(() => {
    let isMounted = true;
    fetchBanners()
      .then((data) => {
        if (isMounted) {
          setBanners(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load banners:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const getProductFromBanner = (banner: Banner): Product => {
    const isIphone = banner.title.toLowerCase().includes("iphone");
    return {
      id: banner.productId || (isIphone ? "33333333-3333-3333-3333-333333333331" : "33333333-3333-3333-3333-333333333332"),
      name: banner.productName || (isIphone ? "iPhone 15 Pro Max" : "Samsung Galaxy S24 Ultra"),
      brand: banner.productBrand || (isIphone ? "Apple" : "Samsung"),
      category: isIphone ? "iphone" : "samsung",
      image: banner.image || (isIphone ? "/images/prod_iphone15.png" : "/images/prod_s24.png"),
      newPrice: banner.productPrice || (isIphone ? "29.490.000đ" : "26.990.000đ"),
      oldPrice: banner.productOldPrice || (isIphone ? "34.990.000đ" : "33.990.000đ"),
      badge: "HOT",
      badgeType: "sale",
      gift: "Tặng kèm phụ kiện chính hãng",
      rating: 5,
      reviewsCount: 20,
      slug: banner.productSlug || (isIphone ? "iphone-15-pro-max" : "samsung-galaxy-s24-ultra"),
    };
  };

  const handleAddToCart = (e: React.MouseEvent, banner: Banner) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getProductFromBanner(banner);
    addToCart(product);
    message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const handleViewDetail = (e: React.MouseEvent, banner: Banner) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getProductFromBanner(banner);
    navigate(`/product/${product.slug}`);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className={styles.heroSection}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, el: `.${styles.swiperPagination}` }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        className={styles.mySwiper}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={styles.bannerSlide}
              style={{ background: banner.bgColor }}
            >
              <div className={styles.slideContent}>
                {banner.label && <span className={styles.label}>{banner.label}</span>}
                <h1 className={styles.title} style={{ color: banner.textColor }}>
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className={styles.subtitle} style={{ color: banner.textColor }}>
                    {banner.subtitle}
                  </p>
                )}
                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className={styles.buyBtn}
                    onClick={(e) => handleAddToCart(e, banner)}
                  >
                    Mua Ngay
                  </Button>
                  <Button
                    size="large"
                    icon={<EyeOutlined />}
                    className={styles.detailBtn}
                    style={{
                      color: banner.textColor || "#ffffff",
                      borderColor: banner.textColor || "rgba(255,255,255,0.6)",
                    }}
                    onClick={(e) => handleViewDetail(e, banner)}
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </div>
              <div
                className={styles.slideImage}
                onClick={(e) => handleViewDetail(e, banner)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.failed) {
                      img.dataset.failed = "true";
                      img.src = banner.title.toLowerCase().includes("iphone")
                        ? "/images/prod_iphone15.png"
                        : "/images/prod_s24.png";
                    }
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Pagination Wrapper */}
        <div className={styles.swiperPagination}></div>
      </Swiper>
    </section>
  );
};

export default HeroBanner;
