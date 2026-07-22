package com.re.ecommerce.modules.order.entity;

import com.re.ecommerce.common.entity.BaseEntity;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import com.re.ecommerce.modules.order.enums.OrderStatusActor;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_status_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private OrderStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private OrderStatus newStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_type", nullable = false)
    private OrderStatusActor actorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(name = "reason_code", length = 100)
    private String reasonCode;

    @Column(length = 1000)
    private String note;
}
