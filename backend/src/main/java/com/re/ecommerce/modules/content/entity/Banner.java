package com.re.ecommerce.modules.content.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Banner extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 100)
    private String label;

    @Column(length = 500)
    private String subtitle;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(length = 50)
    private String position = "HERO";

    @Column(name = "bg_color", length = 100)
    private String bgColor;

    @Column(name = "text_color", length = 50)
    private String textColor;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE";

    public Banner(String title, String label, String subtitle, String imageUrl, String linkUrl, String position, String bgColor, String textColor, int sortOrder, String status) {
        this.title = title;
        this.label = label;
        this.subtitle = subtitle;
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
        this.position = position;
        this.bgColor = bgColor;
        this.textColor = textColor;
        this.sortOrder = sortOrder;
        this.status = status != null ? status : "ACTIVE";
    }
}
