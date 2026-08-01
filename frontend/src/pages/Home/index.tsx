import React, { useState, useEffect } from "react";
import HeroBanner from "../../components/home/HeroBanner";
import BrandGrid from "../../components/home/BrandGrid";
import CategoryList from "../../components/home/CategoryList";
import ProductCard from "../../components/common/ProductCard";
import NewsSection from "../../components/home/NewsSection";
import AboutSection from "../../components/home/AboutSection";
import FAQSection from "../../components/home/FAQSection";
import StoreFinder from "../../components/home/StoreFinder";
import { fetchProducts } from "../../api/productService";
import { Product } from "../../types";
import styles from "./Home.module.css";

const Home = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [prodFilter, setProdFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((data) => {
      if (isMounted) {
        setProductList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by brand or category
  const getFilteredProducts = () => {
    let result = productList;

    // First, filter by active category click from CategoryList
    if (activeCategory !== "all") {
      result = result.filter((p) => {
        const catSlug = (p.categorySlug || "").toLowerCase();
        const catName = (p.category || "").toLowerCase();
        const target = activeCategory.toLowerCase();

        if (catSlug === target || catName === target || p.categoryId === activeCategory) {
          return true;
        }

        if (target === "dien-thoai" && (catName.includes("điện thoại") || catSlug.includes("dien-thoai") || catName.includes("phone"))) {
          return true;
        }
        if (target === "tablet" && (catName.includes("tablet") || catSlug.includes("tablet") || catName.includes("ipad"))) {
          return true;
        }
        if (target === "phu-kien" && (catName.includes("phụ kiện") || catSlug.includes("phu-kien") || catName.includes("accessory"))) {
          return true;
        }
        if (target === "laptop" && (catName.includes("laptop") || catSlug.includes("laptop") || catName.includes("máy tính"))) {
          return true;
        }
        if (target === "smartwatch" && (catName.includes("smartwatch") || catSlug.includes("smartwatch") || catName.includes("đồng hồ"))) {
          return true;
        }
        if (target === "tai-nghe" && (catName.includes("tai nghe") || catSlug.includes("tai-nghe") || catName.includes("audio"))) {
          return true;
        }

        return false;
      });
    }

    // Second, filter by brand selection
    if (prodFilter !== "all") {
      result = result.filter(
        (p) =>
          (p.brand || "").toLowerCase() === prodFilter.toLowerCase() ||
          (p.brandId || "") === prodFilter
      );
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className={styles.homePage}>
      {/* Banner */}
      <HeroBanner />

      {/* Featured Brands */}
      <BrandGrid
        activeBrand={prodFilter}
        onBrandSelect={(brandSlug) => {
          setProdFilter(brandSlug);
          const el = document.getElementById("products");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* Categories & Filter Bar */}
      <CategoryList
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setProdFilter("all"); // Reset the brand filter when changing category
        }}
      />

      {/* Selling Products Grid */}
      <section className={styles.productSection} id="products">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerText}>
              <h2 className={styles.sectionTitle}>
                {activeCategory !== "all" || prodFilter !== "all"
                  ? `Sản phẩm lọc (${filteredProducts.length})`
                  : "Điện thoại bán chạy"}
              </h2>
              <p className={styles.sectionDesc}>
                Top những sản phẩm được săn đón nhất tháng này
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.gridColumn}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Không có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>
      </section>

      {/* News Tech Section */}
      <NewsSection />

      {/* About PinkPhone */}
      <AboutSection />

      {/* FAQ Accordion */}
      <FAQSection />

      {/* Store Finder */}
      <StoreFinder />
    </div>
  );
};

export default Home;
