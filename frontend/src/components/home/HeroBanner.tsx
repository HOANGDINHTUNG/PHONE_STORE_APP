import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Button } from 'antd';
import { banners } from '../../mock/banners';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  return (
    <section className={styles.heroSection}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true, el: `.${styles.swiperPagination}` }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className={styles.mySwiper}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className={styles.bannerSlide}
              style={{ background: banner.bgColor }}
            >
              <div className={styles.slideContent}>
                <span className={styles.label}>{banner.label}</span>
                <h1 className={styles.title} style={{ color: banner.textColor }}>
                  {banner.title}
                </h1>
                <p className={styles.subtitle} style={{ color: banner.textColor }}>
                  {banner.subtitle}
                </p>
                <div className={styles.actions}>
                  <Button type="primary" size="large" className={styles.buyBtn}>
                    Mua Ngay
                  </Button>
                  <Button size="large" className={styles.detailBtn}>
                    Xem Chi Tiết
                  </Button>
                </div>
              </div>
              <div className={styles.slideImage}>
                <img src={banner.image} alt={banner.title} />
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
