import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { fetchNews, NewsItem } from '../../api/newsService';
import styles from './NewsSection.module.css';

const NewsSection = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchNews()
      .then((data) => {
        if (isMounted) {
          setNewsList(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load news:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.newsSection} id="news">
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Tin công nghệ</h2>
        <a href="#all-news" className={styles.seeAll}>Xem thêm tin tức &gt;</a>
      </div>
      <div className={styles.grid}>
        {newsList.map((item) => (
          <Card key={item.id} className={styles.newsCard} hoverable>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} className={styles.thumbnail} />
            </div>
            <div className={styles.content}>
              <span className={styles.tag}>{item.tag}</span>
              <h3 className={styles.newsTitle}>{item.title}</h3>
              <p className={styles.newsDesc}>{item.description}</p>
              <span className={styles.date}>{item.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
