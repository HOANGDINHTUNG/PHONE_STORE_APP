package com.re.ecommerce.modules.customer.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_addresses", indexes = {
    @Index(name = "idx_address_customer", columnList = "customer_id, is_default")
})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShippingAddress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerProfile customer;

    @Column(name = "receiver_name", length = 150, nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", length = 20, nullable = false)
    private String receiverPhone;

    @Column(name = "country_code", columnDefinition = "char(2)", nullable = false)
    private String countryCode = "VN";

    @Column(name = "province_code", length = 20)
    private String provinceCode;

    @Column(name = "province_name", length = 100, nullable = false)
    private String provinceName;

    @Column(name = "district_code", length = 20)
    private String districtCode;

    @Column(name = "district_name", length = 100, nullable = false)
    private String districtName;

    @Column(name = "ward_code", length = 20)
    private String wardCode;

    @Column(name = "ward_name", length = 100, nullable = false)
    private String wardName;

    @Column(name = "detail_address", length = 255, nullable = false)
    private String detailAddress;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // Note: default_customer_id is a GENERATED ALWAYS column in DB, we use @Column(insertable=false, updatable=false)
    // if we need to retrieve it, but usually it's fine to rely purely on the DB constraint.

    public ShippingAddress(CustomerProfile customer, String receiverName, String receiverPhone, String provinceName, String districtName, String wardName, String detailAddress) {
        this.customer = customer;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.provinceName = provinceName;
        this.districtName = districtName;
        this.wardName = wardName;
        this.detailAddress = detailAddress;
        this.isDefault = false;
        this.countryCode = "VN";
    }
}
