package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
public class Supplier extends BaseEntity {

    @Column(name = "supplier_code", nullable = false, length = 30, unique = true)
    private String supplierCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "tax_code", length = 50, unique = true)
    private String taxCode;

    @Column(name = "contact_name", length = 150)
    private String contactName;

    @Column(length = 20)
    private String phone;

    @Column(length = 254)
    private String email;

    @Column(length = 500)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SupplierStatus status = SupplierStatus.ACTIVE;

}
