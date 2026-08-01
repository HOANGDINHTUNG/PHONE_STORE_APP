package com.re.ecommerce.modules.content.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class News extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String tag;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "published_at", nullable = false)
    private LocalDateTime publishedAt = LocalDateTime.now();

    @Column(nullable = false, length = 50)
    private String status = "PUBLISHED";

    @Column(name = "views_count", nullable = false)
    private int viewsCount = 0;

    public News(String title, String tag, String description, String content, String imageUrl, LocalDateTime publishedAt, String status) {
        this.title = title;
        this.tag = tag;
        this.description = description;
        this.content = content;
        this.imageUrl = imageUrl;
        this.publishedAt = publishedAt != null ? publishedAt : LocalDateTime.now();
        this.status = status != null ? status : "PUBLISHED";
    }
}
