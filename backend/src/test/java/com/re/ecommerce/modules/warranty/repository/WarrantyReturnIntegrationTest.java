package com.re.ecommerce.modules.warranty.repository;

import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.order.entity.OrderItem;
import com.re.ecommerce.modules.order.repository.OrderItemRepository;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.warranty.entity.Warranty;
import com.re.ecommerce.modules.warranty.enumeration.WarrantyStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class WarrantyReturnIntegrationTest {

    @Autowired
    private WarrantyRepository warrantyRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Test
    public void contextLoads() {
        // Assert that repositories are successfully initialized and DB schema is correct
        assertThat(warrantyRepository).isNotNull();
    }
}
