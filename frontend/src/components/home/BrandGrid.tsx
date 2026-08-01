import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { fetchBrands } from "../../api/brandService";
import { Brand } from "../../types";
import styles from "./BrandGrid.module.css";

interface BrandGridProps {
  onBrandSelect?: (brandSlug: string) => void;
  activeBrand?: string;
}

const BrandGrid = ({ onBrandSelect, activeBrand }: BrandGridProps) => {
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
        <a
          href="#all-brands"
          className={styles.seeAll}
          onClick={(e) => {
            e.preventDefault();
            if (onBrandSelect) onBrandSelect("all");
          }}
        >
          Tất cả thương hiệu &gt;
        </a>
      </div>
      <div className={styles.grid}>
        {brandList.map((brand) => (
          <Card
            key={brand.id}
            className={`${styles.brandCard} ${activeBrand === brand.slug ? styles.active : ""}`}
            hoverable
            onClick={() => onBrandSelect && onBrandSelect(brand.slug)}
          >
            <div className={styles.logoWrapper}>
              <img
                src={brand.logo}
                alt={brand.name}
                className={styles.brandImageLogo}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.style.display = "none";
                  if (target.parentElement) {
                    target.parentElement.innerText = brand.name;
                    target.parentElement.style.fontWeight = "bold";
                    target.parentElement.style.fontSize = "18px";
                    target.parentElement.style.color = "#333";
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BrandGrid;
