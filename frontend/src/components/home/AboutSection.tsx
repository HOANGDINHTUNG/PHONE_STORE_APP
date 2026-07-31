import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.container}>
        <h2 className={styles.title}>Về PinkPhone - Hệ thống Bán Lẻ Điện Thoại Uy Tín</h2>
        <p className={styles.desc}>
          PinkPhone tự hào là một trong những hệ thống bán lẻ điện thoại di động hàng đầu tại Việt Nam, chuyên cung cấp các dòng smartphone cao cấp từ iPhone, Samsung, Xiaomi đến OPPO, realme. Với phương châm 'Playful Professionalism', chúng tôi không chỉ mang đến sản phẩm công nghệ mới nhất mà còn là một không gian trải nghiệm mua sắm hiện đại và ấm cúng.
        </p>
        <a href="#read-more" className={styles.readMore}>Xem thêm</a>
      </div>
    </section>
  );
};

export default AboutSection;
