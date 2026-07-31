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

    // First, filter by active category click from CategoryList (round buttons)
    if (activeCategory !== "all") {
      result = result.filter(
        (p) =>
          (p.category || "").toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // Second, filter by the "Điện thoại bán chạy" tab filters
    if (prodFilter !== "all") {
      result = result.filter(
        (p) => (p.brand || "").toLowerCase() === prodFilter.toLowerCase(),
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
      <BrandGrid />

      {/* Categories & Filter Bar */}
      <CategoryList
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setProdFilter("all"); // Reset the sub-tab filter
        }}
      />

      {/* Selling Products Grid */}
      <section className={styles.productSection} id="products">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerText}>
              <h2 className={styles.sectionTitle}>Điện thoại bán chạy</h2>
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

      {/* Store Finder & Footer will be wrapped by Layout */}
      <StoreFinder />
    </div>
  );
};

export default Home;
