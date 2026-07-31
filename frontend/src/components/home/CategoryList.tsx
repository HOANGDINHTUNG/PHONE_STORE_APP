import React, { useState } from 'react';
import { Select } from 'antd';
import {
  AppleOutlined,
  AndroidOutlined,
  MobileOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
  DownOutlined
} from '@ant-design/icons';
import { categories } from '../../mock/categories';
import styles from './CategoryList.module.css';

const iconMap = {
  AppleOutlined: <AppleOutlined />,
  AndroidOutlined: <AndroidOutlined />,
  MobileOutlined: <MobileOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  CustomerServiceOutlined: <CustomerServiceOutlined />,
  AppstoreOutlined: <AppstoreOutlined />
};

const CategoryList = ({ onCategoryChange, activeCategory }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    price: 'all',
    requirement: 'all',
    storage: 'all',
    sort: 'popular'
  });

  return (
    <section className={styles.categorySection} id="category-list">
      {/* Round Categories Grid */}
      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`${styles.categoryItem} ${activeCategory === cat.slug ? styles.active : ''}`}
            onClick={() => onCategoryChange && onCategoryChange(cat.slug)}
          >
            <div className={styles.iconCircle}>
              {iconMap[cat.iconName]}
            </div>
            <span className={styles.categoryName}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs / Pills */}
      <div className={styles.filterContainer}>
        <div className={styles.filterPills}>
          <button 
            className={`${styles.filterPill} ${styles.activePill}`}
            onClick={() => onCategoryChange && onCategoryChange('all')}
          >
            Tất cả hãng
          </button>
          
          <Select
            defaultValue="Mức giá"
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            bordered={false}
            options={[
              { value: 'all', label: 'Tất cả mức giá' },
              { value: 'under-10m', label: 'Dưới 10 triệu' },
              { value: '10m-20m', label: '10 - 20 triệu' },
              { value: 'over-20m', label: 'Trên 20 triệu' }
            ]}
          />

          <Select
            defaultValue="Nhu cầu"
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            bordered={false}
            options={[
              { value: 'all', label: 'Tất cả nhu cầu' },
              { value: 'gaming', label: 'Chơi game' },
              { value: 'photography', label: 'Chụp ảnh đẹp' },
              { value: 'battery', label: 'Pin trâu' }
            ]}
          />

          <Select
            defaultValue="Bộ nhớ"
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            bordered={false}
            options={[
              { value: 'all', label: 'Tất cả dung lượng' },
              { value: '128gb', label: '128 GB' },
              { value: '256gb', label: '256 GB' },
              { value: '512gb', label: '512 GB' }
            ]}
          />

          <Select
            defaultValue="Sắp xếp"
            className={styles.filterSelect}
            suffixIcon={<DownOutlined />}
            bordered={false}
            options={[
              { value: 'popular', label: 'Bán chạy nhất' },
              { value: 'price-asc', label: 'Giá thấp đến cao' },
              { value: 'price-desc', label: 'Giá cao đến thấp' }
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
