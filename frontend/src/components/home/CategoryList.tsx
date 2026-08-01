import React, { useState, useEffect } from "react";
import { Select } from "antd";
import {
  AppleOutlined,
  AndroidOutlined,
  MobileOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  TabletOutlined,
  LaptopOutlined,
  AppstoreOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { fetchCategories } from "../../api/categoryService";
import { Category } from "../../types";
import styles from "./CategoryList.module.css";

type IconKey =
  | "AppleOutlined"
  | "AndroidOutlined"
  | "MobileOutlined"
  | "ClockCircleOutlined"
  | "CustomerServiceOutlined"
  | "TabletOutlined"
  | "LaptopOutlined"
  | "AppstoreOutlined";

const iconMap: Record<IconKey, React.ReactNode> = {
  AppleOutlined: <AppleOutlined />,
  AndroidOutlined: <AndroidOutlined />,
  MobileOutlined: <MobileOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  CustomerServiceOutlined: <CustomerServiceOutlined />,
  TabletOutlined: <TabletOutlined />,
  LaptopOutlined: <LaptopOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
};

interface CategoryListProps {
  onCategoryChange?: (category: string) => void;
  activeCategory?: string;
  priceFilter?: string;
  onPriceFilterChange?: (price: string) => void;
  storageFilter?: string;
  onStorageFilterChange?: (storage: string) => void;
  sortFilter?: string;
  onSortFilterChange?: (sort: string) => void;
  requirementFilter?: string;
  onRequirementFilterChange?: (req: string) => void;
}

const CategoryList = ({
  onCategoryChange,
  activeCategory = "all",
  priceFilter = "all",
  onPriceFilterChange,
  storageFilter = "all",
  onStorageFilterChange,
  sortFilter = "popular",
  onSortFilterChange,
  requirementFilter = "all",
  onRequirementFilterChange,
}: CategoryListProps) => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchCategories().then((cats) => {
      if (isMounted) {
        setCategoryList(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.categorySection} id="category-list">
      {/* Round Categories Grid */}
      <div className={styles.categoryGrid}>
        <div
          className={`${styles.categoryItem} ${activeCategory === "all" ? styles.active : ""}`}
          onClick={() => onCategoryChange && onCategoryChange("all")}
        >
          <div className={styles.iconCircle}>
            <AppstoreOutlined />
          </div>
          <span className={styles.categoryName}>Tất cả</span>
        </div>

        {categoryList.map((cat) => (
          <div
            key={cat.id}
            className={`${styles.categoryItem} ${activeCategory === cat.slug ? styles.active : ""}`}
            onClick={() => onCategoryChange && onCategoryChange(cat.slug)}
          >
            <div className={styles.iconCircle}>
              {iconMap[(cat.iconName || "AppstoreOutlined") as IconKey] || <AppstoreOutlined />}
            </div>
            <span className={styles.categoryName}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Filter Options Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${activeCategory === "all" ? styles.activeFilterBtn : ""}`}
            onClick={() => onCategoryChange && onCategoryChange("all")}
          >
            Tất cả hãng <span>▼</span>
          </button>

          <Select
            value={priceFilter}
            onChange={(val) => onPriceFilterChange && onPriceFilterChange(val)}
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            options={[
              { value: "all", label: "Mức giá: Tất cả" },
              { value: "under-10m", label: "Dưới 10 triệu" },
              { value: "10m-20m", label: "10 - 20 triệu" },
              { value: "20m-30m", label: "20 - 30 triệu" },
              { value: "above-30m", label: "Trên 30 triệu" },
            ]}
          />

          <Select
            value={requirementFilter}
            onChange={(val) => onRequirementFilterChange && onRequirementFilterChange(val)}
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            options={[
              { value: "all", label: "Nhu cầu: Tất cả" },
              { value: "gaming", label: "Chơi game / Cấu hình cao" },
              { value: "camera", label: "Camera sắc nét" },
              { value: "battery", label: "Pin dung lượng lớn" },
            ]}
          />

          <Select
            value={storageFilter}
            onChange={(val) => onStorageFilterChange && onStorageFilterChange(val)}
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            options={[
              { value: "all", label: "Bộ nhớ: Tất cả" },
              { value: "128gb", label: "128 GB" },
              { value: "256gb", label: "256 GB" },
              { value: "512gb", label: "512 GB / 1 TB" },
            ]}
          />

          <Select
            value={sortFilter}
            onChange={(val) => onSortFilterChange && onSortFilterChange(val)}
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            options={[
              { value: "popular", label: "Sắp xếp: Phổ biến" },
              { value: "price-asc", label: "Giá tăng dần" },
              { value: "price-desc", label: "Giá giảm dần" },
              { value: "newest", label: "Hàng mới nhất" },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
