package com.re.ecommerce.modules.catalog.service.impl;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.exception.UnprocessableEntityException;
import com.re.ecommerce.common.utils.SlugUtils;
import com.re.ecommerce.modules.catalog.dto.request.*;
import com.re.ecommerce.modules.catalog.dto.response.*;
import com.re.ecommerce.modules.catalog.entity.*;
import com.re.ecommerce.modules.catalog.repository.*;
import com.re.ecommerce.modules.catalog.service.ProductService;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.dto.response.VariantWarehouseStockResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductSpecificationRepository specificationRepository;
    private final ProductAttributeRepository attributeRepository;
    private final ProductImageRepository imageRepository;
    private final RelatedProductRepository relatedProductRepository;
    private final WarehouseInventoryRepository warehouseInventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final AuditLogger auditLogger;

    @Override
    @Transactional(readOnly = true)
    public List<ProductPublicResponse> searchProducts(String keyword, UUID categoryId, UUID brandId) {
        List<Product> products = productRepository.findAllByFilters(PublicationStatus.ACTIVE, keyword);

        return products.stream()
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> brandId == null || p.getBrand().getId().equals(brandId))
                .map(this::mapToPublicResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductPublicResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndPublicationStatusAndDeletedAtIsNull(slug, PublicationStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found or not active"));

        return mapToPublicResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductAdminResponse> adminListProducts(String keyword, PublicationStatus status, UUID categoryId, UUID brandId) {
        List<Product> products = productRepository.findAllByFilters(status, keyword);

        return products.stream()
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> brandId == null || p.getBrand().getId().equals(brandId))
                .map(this::mapToAdminResponse)
                .sorted(Comparator.comparing(ProductAdminResponse::createdAt).reversed())
                .toList();
    }

    @Override
    @Transactional
    public ProductAdminResponse createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("CATEGORY_NOT_FOUND", "Category not found"));
        if (category.getStatus() == CategoryStatus.INACTIVE) {
            throw new BusinessConflictException("CATEGORY_INACTIVE", "Cannot create product in inactive category");
        }

        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new ResourceNotFoundException("BRAND_NOT_FOUND", "Brand not found"));
        if (brand.getStatus() == BrandStatus.INACTIVE) {
            throw new BusinessConflictException("BRAND_INACTIVE", "Cannot create product with inactive brand");
        }

        String slug = SlugUtils.toSlug(request.name());
        if (productRepository.existsBySlug(slug)) {
            auditLogger.log("PRODUCT_CREATE", "Product", null, null, request, "FAILURE");
            throw new BusinessConflictException("PRODUCT_SLUG_EXISTS", "Product slug already exists: " + slug);
        }

        Product product = new Product(category, brand, request.name(), slug, request.description());
        product = productRepository.save(product);

        ProductAdminResponse response = mapToAdminResponse(product);
        auditLogger.log("PRODUCT_CREATE", "Product", product.getId().toString(), null, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductAdminResponse getProductAdminDetail(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));
        return mapToAdminResponse(product);
    }

    @Override
    @Transactional
    public ProductAdminResponse updateProduct(UUID id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        if (product.getDeletedAt() != null) {
            throw new UnprocessableEntityException("PRODUCT_DELETED", "Cannot update a deleted product");
        }

        ProductAdminResponse oldState = mapToAdminResponse(product);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("CATEGORY_NOT_FOUND", "Category not found"));
            if (category.getStatus() == CategoryStatus.INACTIVE) {
                throw new BusinessConflictException("CATEGORY_INACTIVE", "Cannot move product to inactive category");
            }
            product.setCategory(category);
        }

        if (request.brandId() != null) {
            Brand brand = brandRepository.findById(request.brandId())
                    .orElseThrow(() -> new ResourceNotFoundException("BRAND_NOT_FOUND", "Brand not found"));
            if (brand.getStatus() == BrandStatus.INACTIVE) {
                throw new BusinessConflictException("BRAND_INACTIVE", "Cannot assign inactive brand to product");
            }
            product.setBrand(brand);
        }

        if (request.name() != null && !request.name().equals(product.getName())) {
            String newSlug = SlugUtils.toSlug(request.name());
            if (productRepository.existsBySlugAndIdNot(newSlug, id)) {
                auditLogger.log("PRODUCT_UPDATE", "Product", id.toString(), oldState, request, "FAILURE");
                throw new BusinessConflictException("PRODUCT_SLUG_EXISTS", "Product slug already exists: " + newSlug);
            }
            product.setName(request.name());
            product.setSlug(newSlug);
        }

        if (request.description() != null) {
            product.setDescription(request.description());
        }

        product = productRepository.save(product);
        ProductAdminResponse response = mapToAdminResponse(product);
        auditLogger.log("PRODUCT_UPDATE", "Product", product.getId().toString(), oldState, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional
    public ProductAdminResponse changeProductStatus(UUID id, PublicationStatus status) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        if (product.getDeletedAt() != null) {
            throw new UnprocessableEntityException("PRODUCT_DELETED", "Cannot change status of a deleted product");
        }

        if (product.getPublicationStatus() == status) {
            return mapToAdminResponse(product);
        }

        ProductAdminResponse oldState = mapToAdminResponse(product);

        if (status == PublicationStatus.ACTIVE) {
            if (product.getCategory().getStatus() == CategoryStatus.INACTIVE) {
                throw new BusinessConflictException("CATEGORY_INACTIVE", "Cannot activate product with inactive category");
            }
            if (product.getBrand().getStatus() == BrandStatus.INACTIVE) {
                throw new BusinessConflictException("BRAND_INACTIVE", "Cannot activate product with inactive brand");
            }
            
            boolean hasActiveVariant = variantRepository.existsByProductIdAndStatus(id, VariantStatus.ACTIVE);
            if (!hasActiveVariant) {
                throw new BusinessConflictException("NO_ACTIVE_VARIANT", "Cannot activate product without any active variant");
            }
        }

        product.setPublicationStatus(status);
        product = productRepository.save(product);

        ProductAdminResponse response = mapToAdminResponse(product);
        auditLogger.log("PRODUCT_STATUS_CHANGE", "Product", product.getId().toString(), oldState, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional
    public List<SpecificationResponse> replaceSpecifications(UUID productId, SpecificationRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        specificationRepository.deleteAllByProductId(productId);
        
        List<ProductSpecification> newSpecs = request.items().stream()
                .map(item -> new ProductSpecification(product, item.groupName(), item.specName(), item.specValue(), item.sortOrder()))
                .toList();
                
        List<ProductSpecification> saved = specificationRepository.saveAll(newSpecs);
        
        auditLogger.log("PRODUCT_SPEC_UPDATE", "Product", productId.toString(), null, "Replaced " + newSpecs.size() + " specs", "SUCCESS");
        
        return saved.stream()
                .map(s -> new SpecificationResponse(s.getId(), s.getGroupName(), s.getSpecName(), s.getSpecValue(), s.getSortOrder()))
                .toList();
    }

    @Override
    @Transactional
    public List<AttributeResponse> replaceAttributes(UUID productId, AttributeRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        attributeRepository.deleteAllByProductId(productId);
        
        List<ProductAttribute> newAttrs = request.items().stream()
                .map(item -> new ProductAttribute(product, item.attributeName(), item.attributeValue()))
                .toList();
                
        List<ProductAttribute> saved = attributeRepository.saveAll(newAttrs);
        
        auditLogger.log("PRODUCT_ATTR_UPDATE", "Product", productId.toString(), null, "Replaced " + newAttrs.size() + " attrs", "SUCCESS");
        
        return saved.stream()
                .map(a -> new AttributeResponse(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCardResponse> getRelatedProducts(String slug) {
        List<RelatedProduct> rps = relatedProductRepository.findBySourceProduct_SlugOrderBySortOrderAsc(slug);
        return rps.stream()
                .map(RelatedProduct::getTargetProduct)
                .filter(p -> p.getPublicationStatus() == PublicationStatus.ACTIVE && p.getDeletedAt() == null)
                .map(p -> {
                    ProductVariant defaultVariant = p.getVariants().stream()
                            .filter(v -> v.getStatus() == VariantStatus.ACTIVE).findFirst().orElse(null);
                    if (defaultVariant == null) return null;
                    return ProductCardResponse.fromProduct(p, stockByVariantIds(
                            p.getVariants().stream().map(ProductVariant::getId).toList()));
                })
                .filter(r -> r != null) // spec says variant must be saleable
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RelatedProductAdminResponse> getAdminRelatedProducts(UUID productId) {
        List<RelatedProduct> rps = relatedProductRepository.findBySourceProduct_IdOrderBySortOrderAsc(productId);
        return rps.stream().map(rp -> {
            Product tp = rp.getTargetProduct();
            String warning = null;
            if (tp.getDeletedAt() != null) warning = "Target product is deleted.";
            else if (tp.getPublicationStatus() != PublicationStatus.ACTIVE) warning = "Target product is not active.";
            return new RelatedProductAdminResponse(tp.getId(), tp.getName(), tp.getPublicationStatus(), rp.getSortOrder(), warning);
        }).toList();
    }

    @Override
    @Transactional
    public List<RelatedProductAdminResponse> replaceRelatedProducts(UUID productId, RelatedProductReplaceRequest request) {
        Product sourceProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        if (sourceProduct.getDeletedAt() != null) {
            throw new UnprocessableEntityException("PRODUCT_DELETED", "Product is deleted");
        }

        relatedProductRepository.deleteBySourceProductId(productId);
        
        List<RelatedProduct> newRps = request.getRelatedProducts().stream().map(req -> {
            if (req.getTargetProductId().equals(productId)) {
                throw new UnprocessableEntityException("SELF_RELATION_NOT_ALLOWED", "Cannot relate product to itself");
            }
            Product targetProduct = productRepository.findById(req.getTargetProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("RELATED_PRODUCT_NOT_FOUND", "Related product not found: " + req.getTargetProductId()));
            return new RelatedProduct(sourceProduct, targetProduct, req.getSortOrder());
        }).toList();

        // Note: constraint handles duplicate target IDs check in DB (or we can use Set).
        relatedProductRepository.saveAll(newRps);
        auditLogger.log("PRODUCT_RELATED_UPDATE", "Product", productId.toString(), null, "Replaced related products set", "SUCCESS");
        return getAdminRelatedProducts(productId);
    }

    private ProductAdminResponse mapToAdminResponse(Product product) {
        long variantCount = variantRepository.countByProductId(product.getId());
        return new ProductAdminResponse(
                product.getId(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getBrand().getId(),
                product.getBrand().getName(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPublicationStatus(),
                variantCount,
                product.getDeletedAt(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private ProductPublicResponse mapToPublicResponse(Product product) {
        List<ProductVariant> variants = variantRepository.findByProductIdAndStatus(product.getId(), VariantStatus.ACTIVE);
        Map<UUID, Integer> availableByVariantId = stockByVariantIds(
                variants.stream().map(ProductVariant::getId).toList());
        
        List<VariantResponse> variantResponses = variants.stream().map(v -> {
            List<ImageResponse> images = imageRepository.findByVariantIdOrderBySortOrderAsc(v.getId()).stream()
                    .map(img -> new ImageResponse(img.getId(), img.getImageUrl(), img.getAltText(), img.isPrimary(), img.getSortOrder()))
                    .toList();
                    
            return new VariantResponse(
                    v.getId(), v.getProduct().getId(), v.getSku(), v.getName(), v.getColor(), v.getRamGb(), v.getStorageGb(),
                    v.getTrackingType(), v.getWarrantyMonths(), v.getListPrice(), v.getSalePrice(), v.getStatus(), v.getVersion(),
                    availableByVariantId.getOrDefault(v.getId(), 0),
                    warehouseStocksForVariant(v.getId()),
                    images, v.getCreatedAt(), v.getUpdatedAt()
            );
        }).toList();

        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;
        
        for (ProductVariant v : variants) {
            BigDecimal price = v.getSalePrice() != null ? v.getSalePrice() : v.getListPrice();
            if (minPrice == null || price.compareTo(minPrice) < 0) minPrice = price;
            if (maxPrice == null || price.compareTo(maxPrice) > 0) maxPrice = price;
        }

        List<SpecificationResponse> specs = specificationRepository.findByProductIdOrderBySortOrderAsc(product.getId()).stream()
                .map(s -> new SpecificationResponse(s.getId(), s.getGroupName(), s.getSpecName(), s.getSpecValue(), s.getSortOrder()))
                .toList();

        List<AttributeResponse> attrs = attributeRepository.findByProductId(product.getId()).stream()
                .map(a -> new AttributeResponse(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .toList();

        return new ProductPublicResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getBrand().getId(),
                product.getBrand().getName(),
                variantResponses,
                specs,
                attrs,
                minPrice,
                maxPrice,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private Map<UUID, Integer> stockByVariantIds(List<UUID> variantIds) {
        if (variantIds.isEmpty()) return Map.of();
        return warehouseInventoryRepository.sumAvailableQuantityByVariantIds(variantIds).stream()
                .collect(Collectors.toMap(
                        WarehouseInventoryRepository.VariantAvailableStock::getVariantId,
                        row -> Math.max(0, row.getAvailableQuantity().intValue())
                ));
    }

    private List<VariantWarehouseStockResponse> warehouseStocksForVariant(UUID variantId) {
        Map<UUID, Integer> inventoryByWarehouse = warehouseInventoryRepository
                .findByIdProductVariantId(variantId).stream()
                .filter(i -> i.getWarehouse().getStatus() == WarehouseStatus.ACTIVE)
                .collect(Collectors.toMap(i -> i.getWarehouse().getId(),
                        i -> Math.max(0, (i.getOnHandQuantity() == null ? 0 : i.getOnHandQuantity()) -
                                (i.getReservedQuantity() == null ? 0 : i.getReservedQuantity()))));
        return warehouseRepository.findAll().stream()
                .filter(w -> w.getStatus() == WarehouseStatus.ACTIVE)
                .map(w -> new VariantWarehouseStockResponse(w.getId(), w.getName(),
                        inventoryByWarehouse.getOrDefault(w.getId(), 0)))
                .toList();
    }
}
