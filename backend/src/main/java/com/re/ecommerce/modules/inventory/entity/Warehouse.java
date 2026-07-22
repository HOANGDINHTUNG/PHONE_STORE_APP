package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
@NoArgsConstructor
public class Warehouse extends BaseEntity {

    @Column(nullable = false, length = 30, unique = true)
    private String code;

    @Column(nullable = false, length = 150, unique = true)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WarehouseStatus status = WarehouseStatus.ACTIVE;

}
