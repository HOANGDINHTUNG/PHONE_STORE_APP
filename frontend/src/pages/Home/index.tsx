import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Pagination, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";

  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [prodFilter, setProdFilter] = useState("all");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Reset pagination to page 1 whenever search, category, or brand filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, prodFilter]);

  // Filter products by search query, brand, or category
  const getFilteredProducts = () => {
    let result = productList;

    // Filter by search query if present
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Filter by active category click from CategoryList
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

    // Filter by brand selection
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

  // Slice products for current page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleClearSearch = () => {
    navigate("/");
  };

  const getTitleText = () => {
    if (searchQuery) return `Kết quả tìm kiếm (${filteredProducts.length})`;
    if (activeCategory !== "all" || prodFilter !== "all") {
      return `Sản phẩm lọc (${filteredProducts.length})`;
    }
    return "Điện thoại bán chạy";
  };

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
          setProdFilter("all"); // Reset brand filter when changing category
        }}
      />

      {/* Selling Products Grid */}
      <section className={styles.productSection} id="products">
        <div className={styles.container}>
          {/* Active Search Banner */}
          {searchQuery && (
            <div className={styles.searchBanner}>
              <div className={styles.searchBannerText}>
                Đang tìm kiếm theo từ khóa:{" "}
                <span className={styles.searchKeyword}>"{searchQuery}"</span> (Tìm thấy {filteredProducts.length} sản phẩm)
              </div>
              <Button
                type="default"
                danger
                icon={<CloseOutlined />}
                className={styles.clearSearchBtn}
                onClick={handleClearSearch}
              >
                Xóa tìm kiếm
              </Button>
            </div>
          )}

          <div className={styles.sectionHeader}>
            <div className={styles.headerText}>
              <h2 className={styles.sectionTitle}>{getTitleText()}</h2>
              <p className={styles.sectionDesc}>
                Top những sản phẩm được săn đón nhất tháng này
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className={styles.productGrid}>
                {paginatedProducts.map((product) => (
                  <div key={product.id} className={styles.gridColumn}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {filteredProducts.length > pageSize && (
                <div className={styles.paginationWrapper}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredProducts.length}
                    onChange={(page) => {
                      setCurrentPage(page);
                      const el = document.getElementById("products");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    showSizeChanger={false}
                    showTotal={(total, range) =>
                      `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} sản phẩm`
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Không có sản phẩm nào phù hợp với từ khóa hoặc bộ lọc hiện tại.</p>
              {searchQuery && (
                <Button
                  type="primary"
                  style={{ marginTop: 12 }}
                  onClick={handleClearSearch}
                >
                  Xem tất cả sản phẩm
                </Button>
              )}
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
