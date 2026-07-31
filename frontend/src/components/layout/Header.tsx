import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input, Badge, Dropdown, MenuProps } from "antd";
import { useStore } from "../../context/StoreContext";
import styles from "./Header.module.css";
import { CartItem } from "../../types";

const Header = () => {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (value: string) => {
    console.log("Search:", value);
  };

  const dropdownItems: MenuProps["items"] = user
    ? [
        {
          key: "profile",
          label: `Xin chào, ${user.name}`,
          disabled: true,
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

          {/* Search Bar - Center */}
          <div className={styles.searchWrapper}>
            <Input
              placeholder="Bạn muốn tìm điện thoại nào?"
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
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              }
              onPressEnter={(e) =>
                handleSearch((e.target as HTMLInputElement).value)
              }
              className={styles.searchInput}
            />
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
                <span>Đăng nhập</span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
