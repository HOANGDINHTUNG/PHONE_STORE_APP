import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Button, message } from "antd";
import { fetchBanners, BannerItem, fallbackBanners } from "../../api/bannerService";
import { useStore } from "../../context/StoreContext";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./HeroBanner.module.css";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [bannerList, setBannerList] = useState<BannerItem[]>(fallbackBanners);

  useEffect(() => {
    let isMounted = true;
    fetchBanners().then((data) => {
      if (isMounted && data.length > 0) {
        setBannerList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBuyNow = (banner: BannerItem) => {
    addToCart({
      id: banner.featuredProduct.id,
      name: banner.featuredProduct.name,
      price: banner.featuredProduct.price,
      image: banner.featuredProduct.image,
      quantity: 1,
      active: true,
    } as any);
    message.success(`Đã thêm ${banner.featuredProduct.name} vào giỏ hàng!`);
  };

  const handleViewDetail = (slug: string) => {
    navigate(`/product/${slug || "iphone-15-pro-max"}`);
  };

  return (
    <section className={styles.heroSection}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, el: `.${styles.swiperPagination}` }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className={styles.mySwiper}
      >
        {bannerList.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={styles.bannerSlide}
              style={{ background: banner.bgColor }}
            >
              <div className={styles.slideContent}>
                <span className={styles.label}>{banner.label}</span>
                <h1
                  className={styles.title}
                  style={{ color: banner.textColor }}
                >
                  {banner.title}
                </h1>
                <p
                  className={styles.subtitle}
                  style={{ color: banner.textColor }}
                >
                  {banner.subtitle}
                </p>
                <div className={styles.actions}>
                  <Button
                    type="primary"
                    size="large"
                    className={styles.buyBtn}
                    onClick={() => handleBuyNow(banner)}
                  >
                    Mua Ngay
                  </Button>
                  <Button
                    size="large"
                    className={styles.detailBtn}
                    onClick={() => handleViewDetail(banner.productSlug)}
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </div>
              <div className={styles.slideImage}>
                <img
                  src={banner.image}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src =
                      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png";
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
