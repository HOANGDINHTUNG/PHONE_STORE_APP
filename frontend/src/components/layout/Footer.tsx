import React from 'react';
import { Link } from 'react-router-dom';
import { ShareAltOutlined, GlobalOutlined } from '@ant-design/icons';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Info */}
        <div className={styles.column}>
          <Link to="/" className={styles.logo}>
            Pink<span>Phone</span>
          </Link>
          <p className={styles.description}>
            Hệ thống bán lẻ điện thoại di động hàng đầu với dịch vụ tận tâm và sản phẩm chính hãng.
          </p>
          <div className={styles.socials}>
            <button className={styles.socialBtn} title="Share">
              <ShareAltOutlined />
            </button>
            <button className={styles.socialBtn} title="Global">
              <GlobalOutlined />
            </button>
          </div>
        </div>

        {/* Giới thiệu */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Giới thiệu</h4>
          <ul className={styles.list}>
            <li><a href="#about">Về PinkPhone</a></li>
            <li><a href="#careers">Tuyển dụng</a></li>
            <li><a href="#news">Tin công nghệ</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* Chính sách */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Chính sách</h4>
          <ul className={styles.list}>
            <li><a href="#warranty">Chính sách bảo hành</a></li>
            <li><a href="#refund">Chính sách đổi trả</a></li>
            <li><a href="#shipping">Chính sách vận chuyển</a></li>
            <li><a href="#payment">Thanh toán bảo mật</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div className={styles.column}>
          <h4 className={styles.heading}>Hỗ trợ khách hàng</h4>
          <div className={styles.supportItem}>
            <span>Hotline mua hàng</span>
            <a href="tel:18006601" className={styles.hotline}>1800 6601</a>
          </div>
          <div className={styles.supportItem}>
            <span>Góp ý, khiếu nại</span>
            <a href="tel:18006602" className={styles.hotline}>1800 6602</a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            © 2026 PinkPhone. All rights reserved.
          </p>
          <div className={styles.paymentMethods}>
            <span className={styles.paymentBadge}>Visa</span>
            <span className={styles.paymentBadge}>Mastercard</span>
            <span className={styles.paymentBadge}>JCB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
