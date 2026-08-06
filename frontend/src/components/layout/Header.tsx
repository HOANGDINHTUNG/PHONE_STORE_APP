import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Badge, Dropdown, MenuProps } from "antd";
import { useStore } from "../../context/StoreContext";
import {
  fetchProducts,
  getDefaultProductImage,
} from "../../api/productService";
import { Product, CartItem } from "../../types";
import { Search, User, ShoppingCart, HeadphonesIcon } from "lucide-react";
import { StockBadge } from "../common/StockBadge";
import { resolveProductStock } from "../../utils/stock";

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
          (p.category || "").toLowerCase().includes(trimSearch),
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
    <header className="bg-surface dark:bg-surface-container-highest shadow-sm sticky top-0 z-50">
      {/* Tier 1: Utility & Links */}
      <div className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-[1200px] mx-auto px-lg h-10 flex items-center justify-between">
          <div className="flex gap-md">
            <Link
              to="/promotions"
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              Khuyến mãi
            </Link>
            <Link
              to="/store-locator"
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              Cửa hàng
            </Link>
            <Link
              to="/order-tracking"
              className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              Tra cứu đơn hàng
            </Link>
          </div>
          <div className="flex items-center gap-sm text-label-sm font-label-sm text-on-surface-variant">
            <HeadphonesIcon size={16} />
            Hotline: 1800 6601
          </div>
        </div>
      </div>

      {/* Tier 2: Main Brand & Nav */}
      <div className="max-w-[1200px] mx-auto px-lg h-20 flex items-center justify-between gap-xl relative">
        <Link
          to="/"
          className="text-headline-md font-headline-md font-extrabold text-primary-container tracking-tight"
        >
          PinkPhone
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-lg ml-8">
          <Link
            to="/?search=iphone"
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            iPhone
          </Link>
          <Link
            to="/?search=samsung"
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Samsung
          </Link>
          <Link
            to="/?search=phu-kien"
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Phụ kiện
          </Link>
          <Link
            to="/services"
            className="text-body-md font-body-md text-on-surface-variant hover:text-primary-fixed transition-colors duration-200"
          >
            Dịch vụ
          </Link>
        </nav>

        <div className="flex items-center gap-md">
          {/* Search Bar - Autocomplete Logic kept intact */}
          <div
            className="relative hidden w-64 lg:block group"
            ref={searchContainerRef}
          >
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit((e.target as HTMLInputElement).value);
                }
              }}
              className="bg-surface-container border border-outline-variant rounded-full py-2 pl-10 pr-4 w-full focus:ring-2 focus:ring-primary-container focus:outline-none transition-all placeholder:text-sm text-sm"
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary cursor-pointer"
              onClick={() => handleSearchSubmit(searchValue)}
            />

            {/* Suggestions Overlay Dropdown */}
            {isFocused && trimSearch.length > 0 && (
              <div className="absolute top-12 right-0 w-[400px] bg-white rounded-lg shadow-[0_8px_30px_rgba(214,51,108,0.15)] overflow-hidden z-[100] border border-outline-variant">
                <div className="bg-surface-container-low px-4 py-2 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">
                  Gợi ý sản phẩm ({suggestions.length})
                </div>

                {suggestions.length > 0 ? (
                  <>
                    <div className="max-h-[360px] overflow-y-auto">
                      {suggestions.slice(0, 6).map((item) => {
                        const stock = resolveProductStock(item);
                        const oos = stock <= 0;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 pt-4 pb-4 border-b border-outline-variant/30 hover:bg-surface-soft cursor-pointer transition-colors"
                            onClick={() => handleSelectProduct(item)}
                          >
                            <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 shrink-0">
                              <img
                                src={
                                  item.image ||
                                  getDefaultProductImage(item.brand, item.slug)
                                }
                                alt={item.name}
                                className={`w-full h-full object-contain ${oos ? "opacity-50 grayscale" : ""}`}
                                onError={(e) => {
                                  const fallback = getDefaultProductImage(
                                    item.brand,
                                    item.slug,
                                  );
                                  if (e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-label-sm text-on-surface truncate">
                                {item.name}
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant line-clamp-1">
                                  {item.brand}
                                </span>
                                <span className="font-semibold text-primary text-sm whitespace-nowrap">
                                  {item.newPrice}
                                </span>
                                <StockBadge
                                  stock={stock}
                                  outOfStock={oos}
                                  variant="inline"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="text-center font-label-sm text-primary py-3 hover:bg-surface-soft cursor-pointer transition-colors bg-white border-t border-outline-variant"
                      onClick={() => handleSearchSubmit(searchValue)}
                    >
                      Xem tất cả {suggestions.length} sản phẩm phù hợp &rarr;
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-on-surface-variant font-body-md">
                    Không tìm thấy sản phẩm nào khớp với "{searchValue}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-sm">
            <Dropdown
              menu={{ items: dropdownItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors active:scale-95 group">
                <User
                  size={22}
                  className="text-on-surface-variant group-hover:text-primary transition-colors"
                />
              </button>
            </Dropdown>

            <Link to="/cart">
              <button className="p-2 rounded-full hover:bg-primary/10 transition-colors active:scale-95 relative text-primary">
                <ShoppingCart size={22} className="text-primary" />
                <span className="absolute -top-0 -right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
