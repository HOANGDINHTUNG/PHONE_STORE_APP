package com.re.ecommerce.modules.catalog.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_category_parent_id", columnList = "parent_id")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoryStatus status = CategoryStatus.ACTIVE;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @OrderBy("sortOrder ASC, name ASC")
    private List<Category> subCategories = new ArrayList<>();

    public Category(Category parent, String name, String slug, String description, CategoryStatus status, int sortOrder) {
        this.parent = parent;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.status = status != null ? status : CategoryStatus.ACTIVE;
        this.sortOrder = sortOrder;
    }
}
