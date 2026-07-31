import React from 'react';
import { Card } from 'antd';
import { brands } from '../../mock/brands';
import styles from './BrandGrid.module.css';

const BrandGrid = () => {
  return (
    <section className={styles.brandSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Thương hiệu nổi bật</h2>
        <a href="#all-brands" className={styles.seeAll}>Tất cả thương hiệu &gt;</a>
      </div>
      <div className={styles.grid}>
        {brands.map((brand) => (
          <Card key={brand.id} className={styles.brandCard} hoverable>
            <div className={styles.logoWrapper}>
              {/* Display stylized text logo since we have generic png */}
              <span className={`${styles.brandTextLogo} ${styles[brand.name.toLowerCase()]}`}>
                {brand.name}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BrandGrid;
