package com.re.ecommerce.modules.inventory.entity;

import com.re.ecommerce.modules.inventory.entity.enums.IdentifierType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_unit_identifiers")
@Getter
@Setter
@NoArgsConstructor
public class InventoryUnitIdentifier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_unit_id", nullable = false)
    private InventoryUnit inventoryUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "identifier_type", nullable = false, length = 20)
    private IdentifierType identifierType;

    @Column(name = "identifier_value", nullable = false, length = 100)
    private String identifierValue;

    @Column(name = "normalized_identifier", nullable = false, length = 100, unique = true)
    private String normalizedIdentifier;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
