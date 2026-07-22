package com.re.ecommerce.modules.orderreturn.entity;

import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.orderreturn.enumeration.ReturnItemResolution;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "return_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_request_id", nullable = false)
    private ReturnRequest returnRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "refund_amount", nullable = false)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(name = "condition_note", length = 255)
    private String conditionNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution", nullable = false)
    private ReturnItemResolution resolution = ReturnItemResolution.PENDING;

}
