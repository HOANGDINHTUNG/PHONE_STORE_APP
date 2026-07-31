import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { fetchBrands } from '../../api/brandService';
import { Brand } from '../../types';
import styles from './BrandGrid.module.css';

const BrandGrid = () => {
  const [brandList, setBrandList] = useState<Brand[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchBrands().then((data) => {
      if (isMounted) {
        setBrandList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.brandSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Thương hiệu nổi bật</h2>
        <a href="#all-brands" className={styles.seeAll}>Tất cả thương hiệu &gt;</a>
      </div>
      <div className={styles.grid}>
        {brandList.map((brand) => (
          <Card key={brand.id} className={styles.brandCard} hoverable>
            <div className={styles.logoWrapper}>
              {/* Display stylized text logo */}
              <span className={`${styles.brandTextLogo} ${styles[brand.name.toLowerCase()] || ''}`}>
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
