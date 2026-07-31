package com.re.ecommerce.modules.cart.repository;

import com.re.ecommerce.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    
    Optional<CartItem> findByCartIdAndProductVariantId(UUID cartId, UUID productVariantId);
    List<CartItem> findByCartIdAndProductVariantIdIn(UUID cartId, List<UUID> productVariantIds);
    
    List<CartItem> findByCartId(UUID cartId);
    
    void deleteByCartId(UUID cartId);
}
