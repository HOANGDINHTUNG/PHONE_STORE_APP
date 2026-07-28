package com.re.ecommerce.modules.catalog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_rating_summaries")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductRatingSummary {

    @Id
    @Column(name = "product_id", columnDefinition = "BINARY(16)")
    private UUID productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "approved_review_count", nullable = false)
    private Integer approvedReviewCount = 0;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "rating_1_count", nullable = false)
    private Integer rating1Count = 0;

    @Column(name = "rating_2_count", nullable = false)
    private Integer rating2Count = 0;

    @Column(name = "rating_3_count", nullable = false)
    private Integer rating3Count = 0;

    @Column(name = "rating_4_count", nullable = false)
    private Integer rating4Count = 0;

    @Column(name = "rating_5_count", nullable = false)
    private Integer rating5Count = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ProductRatingSummary(Product product) {
        this.product = product;
    }
}
