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
  const [priceFilter, setPriceFilter] = useState("all");
  const [requirementFilter, setRequirementFilter] = useState("all");
  const [storageFilter, setStorageFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("popular");

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

  // Filter and sort products dynamically based on user selections
  const getFilteredProducts = () => {
    let result = [...productList];

    // 1. Filter by Category
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

    // 2. Filter by Brand (from BrandGrid or sub-filter)
    if (prodFilter !== "all") {
      result = result.filter((p) => {
        const bName = (p.brand || "").toLowerCase();
        const target = prodFilter.toLowerCase();
        return bName.includes(target) || p.brandId === prodFilter;
      });
    }

    // 3. Filter by Price Range
    if (priceFilter !== "all") {
      result = result.filter((p) => {
        const priceNum = parseInt((p.newPrice || "0").replace(/\D/g, ""));
        if (priceFilter === "under-10m") return priceNum < 10000000;
        if (priceFilter === "10m-20m") return priceNum >= 10000000 && priceNum <= 20000000;
        if (priceFilter === "20m-30m") return priceNum >= 20000000 && priceNum <= 30000000;
        if (priceFilter === "above-30m") return priceNum > 30000000;
        return true;
      });
    }

    // 4. Filter by Storage
    if (storageFilter !== "all") {
      result = result.filter((p) => {
        const pName = (p.name || "").toLowerCase();
        const target = storageFilter.toLowerCase();
        return pName.includes(target);
      });
    }

    // 5. Filter by Requirement
    if (requirementFilter !== "all") {
      result = result.filter((p) => {
        const pName = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        if (requirementFilter === "gaming") return pName.includes("ultra") || pName.includes("pro") || desc.includes("game");
        if (requirementFilter === "camera") return pName.includes("pro") || pName.includes("ultra") || desc.includes("camera");
        if (requirementFilter === "battery") return pName.includes("pro max") || pName.includes("plus") || desc.includes("pin");
        return true;
      });
    }

    // 6. Sort Products
    if (sortFilter === "price-asc") {
      result.sort((a, b) => {
        const pA = parseInt((a.newPrice || "0").replace(/\D/g, ""));
        const pB = parseInt((b.newPrice || "0").replace(/\D/g, ""));
        return pA - pB;
      });
    } else if (sortFilter === "price-desc") {
      result.sort((a, b) => {
        const pA = parseInt((a.newPrice || "0").replace(/\D/g, ""));
        const pB = parseInt((b.newPrice || "0").replace(/\D/g, ""));
        return pB - pA;
      });
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  const handleBrandSelect = (brandSlug: string) => {
    setProdFilter(brandSlug);
    const prodSection = document.getElementById("products");
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.homePage}>
      {/* Banner */}
      <HeroBanner />

      {/* Featured Brands */}
      <BrandGrid onBrandSelect={handleBrandSelect} activeBrand={prodFilter} />

      {/* Categories & Filter Bar */}
      <CategoryList
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          const prodSection = document.getElementById("products");
          if (prodSection) {
            prodSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
        storageFilter={storageFilter}
        onStorageFilterChange={setStorageFilter}
        requirementFilter={requirementFilter}
        onRequirementFilterChange={setRequirementFilter}
        sortFilter={sortFilter}
        onSortFilterChange={setSortFilter}
      />

      {/* Selling Products Grid */}
      <section className={styles.productSection} id="products">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerText}>
              <h2 className={styles.sectionTitle}>
                {prodFilter !== "all"
                  ? `Sản phẩm thương hiệu ${prodFilter.toUpperCase()}`
                  : activeCategory !== "all"
                    ? `Danh mục ${activeCategory.toUpperCase()}`
                    : "Điện thoại bán chạy"}
              </h2>
              <p className={styles.sectionDesc}>
                {filteredProducts.length} sản phẩm phù hợp với tiêu chí của bạn
              </p>
            </div>
            {(activeCategory !== "all" || prodFilter !== "all" || priceFilter !== "all" || storageFilter !== "all" || requirementFilter !== "all") && (
              <button
                className="text-xs font-semibold text-[#E91E63] border border-[#E91E63] rounded-full px-4 py-1.5 hover:bg-[#FFF0F4] transition"
                onClick={() => {
                  setActiveCategory("all");
                  setProdFilter("all");
                  setPriceFilter("all");
                  setStorageFilter("all");
                  setRequirementFilter("all");
                  setSortFilter("popular");
                }}
              >
                Xóa tất cả bộ lọc ✕
              </button>
            )}
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
              <p className="text-gray-500 text-base mb-4">Không có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
              <button
                className="inline-flex items-center gap-2 bg-[#E91E63] text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#d81b60] transition"
                onClick={() => {
                  setActiveCategory("all");
                  setProdFilter("all");
                  setPriceFilter("all");
                  setStorageFilter("all");
                  setRequirementFilter("all");
                  setSortFilter("popular");
                }}
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* News Tech Section */}
      <NewsSection />

      {/* About Section */}
      <AboutSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Store Finder Section */}
      <StoreFinder />
    </div>
  );
};

export default Home;
