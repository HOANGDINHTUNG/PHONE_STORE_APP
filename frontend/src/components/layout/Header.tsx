import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Badge, Dropdown } from 'antd';
import {
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useStore } from '../../context/StoreContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, cart, wishlist, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  const navItems = [
    { key: 'smartphones', label: 'Smartphones', path: '/' },
    { key: 'tablets', label: 'Máy tính bảng', path: '/' },
    { key: 'accessories', label: 'Phụ kiện', path: '/' },
    { key: 'services', label: 'Dịch vụ', path: '/' },
    { key: 'cart', label: 'Giỏ hàng', path: '/cart' }
  ];

  const dropdownItems = user ? [
    {
      key: 'profile',
      label: `Xin chào, ${user.name}`,
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      onClick: logout
    }
  ] : [
    {
      key: 'login',
      label: 'Đăng nhập',
      onClick: () => navigate('/login')
    },
    {
      key: 'register',
      label: 'Đăng ký',
      onClick: () => navigate('/register')
    }
  ];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={styles.header}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.topContainer}>
          <div className={styles.topLeft}>
            <a href="#promotions" className={styles.topLink}>Promotions</a>
            <a href="#store-locator" className={styles.topLink}>Store Locator</a>
            <a href="#order-tracking" className={styles.topLink}>Order Tracking</a>
          </div>
          <div className={styles.topRight}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Tìm kiếm PinkPhone..."
                suffix={<SearchOutlined className={styles.searchIcon} />}
                onPressEnter={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Link to="/cart" className={styles.topIconBtn}>
              <Badge count={cartCount} size="small" color="var(--primary-color)">
                <ShoppingOutlined className={styles.topIcon} />
              </Badge>
            </Link>
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={['click']}>
              <button className={styles.topIconBtn}>
                <UserOutlined className={styles.topIcon} />
              </button>
            </Dropdown>
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

          {/* Navigation Menu */}
          <nav className={styles.mainNav}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path && (item.key !== 'cart' || location.pathname === '/cart');
              const isCartActive = item.key === 'cart' && location.pathname === '/cart';
              
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`${styles.navLink} ${isCartActive ? styles.activeNavLink : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
