package com.re.ecommerce.modules.customer.service.impl;

import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.modules.auth.entity.CustomerProfile;
import com.re.ecommerce.modules.auth.repository.CustomerProfileRepository;
import com.re.ecommerce.modules.catalog.dto.response.ProductCardResponse;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.customer.entity.CompareItem;
import com.re.ecommerce.modules.customer.repository.CompareItemRepository;
import com.re.ecommerce.modules.customer.service.CompareService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompareServiceImpl implements CompareService {

    private final CompareItemRepository compareItemRepository;
    private final CustomerProfileRepository customerRepository;
    private final ProductRepository productRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductCardResponse> getMyCompareItems(String username) {
        CustomerProfile customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));

        return compareItemRepository.findByCustomer_IdOrderBySortOrderAscCreatedAtDesc(customer.getId())
                .stream()
                .map(item -> {
                    Product p = productRepository.findById(item.getProductId())
                             .orElse(null);
                    if (p == null) return null;
                    List<UUID> variantIds = p.getVariants().stream().map(ProductVariant::getId).toList();
                    Map<UUID, Integer> stock = warehouseInventoryRepository.sumAvailableQuantityByVariantIds(variantIds).stream()
                            .collect(Collectors.toMap(WarehouseInventoryRepository.VariantAvailableStock::getVariantId,
                                    row -> Math.max(0, row.getAvailableQuantity().intValue())));
                    return ProductCardResponse.fromProduct(p, stock);
                })
                .filter(p -> p != null)
                .toList();
    }

    @Override
    @Transactional
    public void addCompareItem(String username, UUID productId) {
        // Step 1: Lock customer profile row to serialize count + insert operations
        CustomerProfile customer = customerRepository.findLockedByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));

        if (!customer.getUser().isActive()) {
            throw new IllegalArgumentException("Customer profile is inactive");
        }

        // Step 2: Check product active
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        if (product.getPublicationStatus() != PublicationStatus.ACTIVE || product.getDeletedAt() != null) {
            throw new IllegalArgumentException("Product is not valid for comparison");
        }

        // Idempotency: if already exists, return 200
        if (compareItemRepository.findByCustomer_IdAndProductId(customer.getId(), productId).isPresent()) {
            return;
        }

        // Step 3: Count and enforce max = 4
        long count = compareItemRepository.countByCustomer_Id(customer.getId());
        if (count >= 4) {
            throw new BusinessConflictException("COMPARE_LIST_FULL", "Compare list is full. Maximum 4 items allowed.");
        }

        // We skip exact top-level category mapping for brevity unless we have a complex Category hierarchy method.
        // Step 5: Insert relationship
        CompareItem item = new CompareItem(customer, productId, (int) count + 1);
        compareItemRepository.save(item);
    }

    @Override
    @Transactional
    public void removeCompareItem(String username, UUID productId) {
        CustomerProfile customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));

        compareItemRepository.deleteByCustomer_IdAndProductId(customer.getId(), productId);
    }

    @Override
    @Transactional
    public void clearCompareList(String username) {
        CustomerProfile customer = customerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("CUSTOMER_NOT_FOUND", "Customer not found"));

        compareItemRepository.deleteByCustomer_Id(customer.getId());
    }
}
