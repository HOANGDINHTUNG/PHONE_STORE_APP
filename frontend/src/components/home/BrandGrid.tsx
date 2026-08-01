import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { fetchBrands } from "../../api/brandService";
import { Brand } from "../../types";
import styles from "./BrandGrid.module.css";

interface BrandGridProps {
  onBrandSelect?: (brandSlug: string) => void;
  activeBrand?: string;
}

const renderBrandLogo = (slug: string, name: string) => {
  const s = (slug || "").toLowerCase();
  if (s === "apple") {
    return (
      <svg className="w-10 h-10 fill-[#111111] transition-transform duration-200 hover:scale-110" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 4.24-12.74 4.35-4.9.13-9.64-1.92-14.23-6.16-3.32-2.92-7.14-7.53-11.46-13.82-7.46-10.84-13.1-22.75-16.92-35.73-3.83-12.98-5.74-25.26-5.74-36.84 0-14.73 3.66-26.96 10.97-36.68 7.31-9.73 16.59-14.71 27.84-14.95 4.89 0 10.08 1.18 15.58 3.54 5.5 2.36 9.38 3.54 11.64 3.54 2.01 0 5.92-1.22 11.73-3.66 5.8-2.44 10.74-3.58 14.82-3.42 10.55.51 19.34 4.54 26.36 12.09-17.72 10.74-16.48 29.56 3.72 40.59 1.15.61 2.37 1.25 3.66 1.93-3.4 9.87-8.06 19.53-13.98 28.98zM119.22 31.05c0-7.23 2.6-14.15 7.8-20.76 5.21-6.62 11.75-10.29 19.63-11 1.06 7.42-1.39 14.48-7.34 21.19-5.96 6.71-12.63 10.42-20.09 10.57z" />
      </svg>
    );
  }
  if (s === "samsung") {
    return (
      <span className="font-extrabold text-[#1428A0] text-xl tracking-[0.25em] transition-transform duration-200 hover:scale-105">
        SAMSUNG
      </span>
    );
  }
  if (s === "xiaomi") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-[#FF6900] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform duration-200 hover:scale-110">
        mi
      </div>
    );
  }
  if (s === "oppo") {
    return (
      <span className="font-extrabold text-[#056839] text-2xl tracking-[0.2em] transition-transform duration-200 hover:scale-105">
        OPPO
      </span>
    );
  }
  return <span className="font-bold text-gray-800 text-lg">{name}</span>;
};

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
              {renderBrandLogo(brand.slug, brand.name)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BrandGrid;
