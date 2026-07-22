package com.re.ecommerce.modules.orderreturn.entity;

import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.orderreturn.enumeration.ReturnRequestStatus;
import com.re.ecommerce.modules.orderreturn.enumeration.ReturnRequestType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "return_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "return_code", nullable = false, unique = true, length = 100)
    private String returnCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ReturnRequestType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReturnRequestStatus status = ReturnRequestStatus.PENDING;

    @Column(name = "total_refund_amount", nullable = false)
    private BigDecimal totalRefundAmount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replacement_order_id")
    private Order replacementOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}
