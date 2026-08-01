import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input, Badge, Dropdown, MenuProps } from "antd";
import { useStore } from "../../context/StoreContext";
import { fetchProducts, getDefaultProductImage } from "../../api/productService";
import { Product, CartItem } from "../../types";
import styles from "./Header.module.css";

const Header = () => {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param on page load / change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchValue(query);
  }, [location.search]);

  // Load product list for suggestions
  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((prods) => {
      if (isMounted) {
        setAllProducts(prods);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle outside click to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const trimSearch = searchValue.trim().toLowerCase();

  // Filter matching suggestions
  const suggestions = trimSearch
    ? allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(trimSearch) ||
        p.brand.toLowerCase().includes(trimSearch) ||
        (p.category || "").toLowerCase().includes(trimSearch)
    )
    : [];

  const handleSearchSubmit = (val: string) => {
    setIsFocused(false);
    const query = val.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      // Scroll to products section smoothly
      setTimeout(() => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate("/");
    }
  };

  const handleSelectProduct = (product: Product) => {
    setIsFocused(false);
    navigate(`/product/${product.slug || product.id}`);
  };

  const dropdownItems: MenuProps["items"] = user
    ? [
      {
        key: "profile",
        label: `Xin chào, ${user.name}`,
        disabled: true,
      },
      {
        key: "account",
        label: "Tài khoản của tôi",
        onClick: () => navigate("/account"),
      },
      {
        key: "orders",
        label: "Đơn hàng của tôi",
        onClick: () => navigate("/account/orders"),
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: "Đăng xuất",
        onClick: logout,
      },
    ]
    : [
      {
        key: "login",
        label: "Đăng nhập",
        onClick: () => navigate("/login"),
      },
      {
        key: "register",
        label: "Đăng ký",
        onClick: () => navigate("/register"),
      },
    ];

  const cartCount = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0,
  );

  return (
    <header className={styles.header}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.topContainer}>
          <div className={styles.topLeft}>
            <div className={styles.topTextItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield-check"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>100% chính hãng - Xuất VAT đầy đủ</span>
            </div>
            <div className={styles.topTextItem}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-truck"
              >
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                <circle cx="17" cy="18" r="2" />
                <circle cx="7" cy="18" r="2" />
              </svg>
              <span>Giao nhanh - Miễn phí vận chuyển cho đơn từ 100.000đ</span>
            </div>
          </div>
          <div className={styles.topRight}>
            <a href="#store-locator" className={styles.topLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Cửa hàng gần bạn</span>
            </a>
            <a href="#order-tracking" className={styles.topLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-package"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              <span>Tra cứu đơn hàng</span>
            </a>
            <a href="tel:18006601" className={styles.topLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="font-bold">1800 6601</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            Pink<span>Phone</span>
          </Link>

          {/* Search Bar - Center with Autocomplete */}
          <div className={styles.searchWrapper} ref={searchContainerRef}>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Bạn muốn tìm điện thoại nào? (Ví dụ: iPhone 15, S24, Xiaomi...)"
              allowClear
              prefix={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSearchSubmit(searchValue)}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              }
              onPressEnter={(e) =>
                handleSearchSubmit((e.target as HTMLInputElement).value)
              }
              className={styles.searchInput}
            />

            {/* Suggestions Overlay Dropdown */}
            {isFocused && trimSearch.length > 0 && (
              <div className={styles.suggestionsDropdown}>
                <div className={styles.suggestionHeader}>
                  Gợi ý sản phẩm ({suggestions.length})
                </div>

                {suggestions.length > 0 ? (
                  <>
                    <div className={styles.suggestionList}>
                      {suggestions.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className={styles.suggestionItem}
                          onClick={() => handleSelectProduct(item)}
                        >
                          <img
                            src={
                              item.image ||
                              getDefaultProductImage(item.brand, item.slug)
                            }
                            alt={item.name}
                            className={styles.suggestionThumb}
                            onError={(e) => {
                              const fallback = getDefaultProductImage(
                                item.brand,
                                item.slug
                              );
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                          />
                          <div className={styles.suggestionInfo}>
                            <div className={styles.suggestionTitle}>
                              {item.name}
                            </div>
                            <div className={styles.suggestionMeta}>
                              <span className={styles.suggestionBrand}>
                                {item.brand}
                              </span>
                              <span className={styles.suggestionPrice}>
                                {item.newPrice}
                              </span>
                              {item.oldPrice && (
                                <span className={styles.suggestionOldPrice}>
                                  {item.oldPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={styles.suggestionFooter}
                      onClick={() => handleSearchSubmit(searchValue)}
                    >
                      Xem tất cả {suggestions.length} sản phẩm phù hợp cho "{searchValue}" &rarr;
                    </div>
                  </>
                ) : (
                  <div className={styles.emptySuggestions}>
                    Không tìm thấy sản phẩm nào khớp với "{searchValue}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons - Right */}
          <div className={styles.actionGroup}>
            <Link to="/promotions" className={styles.actionBlock}>
              <div className={styles.actionIconWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-tag"
                >
                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                  <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </div>
              <span>Khuyến mãi</span>
            </Link>

            <Link to="/cart" className={styles.actionBlock}>
              <div className={styles.actionIconWrapper}>
                <Badge
                  count={cartCount}
                  size="small"
                  color="#E91E63"
                  offset={[-2, -2]}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </Badge>
              </div>
              <span>Giỏ hàng</span>
            </Link>

            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className={styles.actionBlockBtn}>
                <div className={styles.actionIconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="truncate max-w-[80px]">
                  {user
                    ? user.name?.split(" ").slice(-1)[0] || "Tài khoản"
                    : "Đăng nhập"}
                </span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
