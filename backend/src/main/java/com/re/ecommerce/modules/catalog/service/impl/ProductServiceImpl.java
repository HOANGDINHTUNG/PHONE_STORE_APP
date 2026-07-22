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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
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
    private final AuditLogger auditLogger;

    @Override
    @Transactional(readOnly = true)
    public List<ProductPublicResponse> searchProducts(String keyword, UUID categoryId, UUID brandId) {
        List<Product> products = productRepository.findAllByFilters(PublicationStatus.ACTIVE, keyword);

        return products.stream()
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> brandId == null || p.getBrand().getId().equals(brandId))
                .map(this::mapToPublicResponse)
                .collect(Collectors.toList());
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
                .collect(Collectors.toList());
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
                .collect(Collectors.toList());
                
        List<ProductSpecification> saved = specificationRepository.saveAll(newSpecs);
        
        auditLogger.log("PRODUCT_SPEC_UPDATE", "Product", productId.toString(), null, "Replaced " + newSpecs.size() + " specs", "SUCCESS");
        
        return saved.stream()
                .map(s -> new SpecificationResponse(s.getId(), s.getGroupName(), s.getSpecName(), s.getSpecValue(), s.getSortOrder()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AttributeResponse> replaceAttributes(UUID productId, AttributeRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("PRODUCT_NOT_FOUND", "Product not found"));

        attributeRepository.deleteAllByProductId(productId);
        
        List<ProductAttribute> newAttrs = request.items().stream()
                .map(item -> new ProductAttribute(product, item.attributeName(), item.attributeValue()))
                .collect(Collectors.toList());
                
        List<ProductAttribute> saved = attributeRepository.saveAll(newAttrs);
        
        auditLogger.log("PRODUCT_ATTR_UPDATE", "Product", productId.toString(), null, "Replaced " + newAttrs.size() + " attrs", "SUCCESS");
        
        return saved.stream()
                .map(a -> new AttributeResponse(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .collect(Collectors.toList());
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
        
        List<VariantResponse> variantResponses = variants.stream().map(v -> {
            List<ImageResponse> images = imageRepository.findByVariantIdOrderBySortOrderAsc(v.getId()).stream()
                    .map(img -> new ImageResponse(img.getId(), img.getImageUrl(), img.getAltText(), img.isPrimary(), img.getSortOrder()))
                    .collect(Collectors.toList());
                    
            return new VariantResponse(
                    v.getId(), v.getProduct().getId(), v.getSku(), v.getName(), v.getColor(), v.getRamGb(), v.getStorageGb(),
                    v.getTrackingType(), v.getWarrantyMonths(), v.getListPrice(), v.getSalePrice(), v.getStatus(), v.getVersion(),
                    images, v.getCreatedAt(), v.getUpdatedAt()
            );
        }).collect(Collectors.toList());

        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;
        
        for (ProductVariant v : variants) {
            BigDecimal price = v.getSalePrice() != null ? v.getSalePrice() : v.getListPrice();
            if (minPrice == null || price.compareTo(minPrice) < 0) minPrice = price;
            if (maxPrice == null || price.compareTo(maxPrice) > 0) maxPrice = price;
        }

        List<SpecificationResponse> specs = specificationRepository.findByProductIdOrderBySortOrderAsc(product.getId()).stream()
                .map(s -> new SpecificationResponse(s.getId(), s.getGroupName(), s.getSpecName(), s.getSpecValue(), s.getSortOrder()))
                .collect(Collectors.toList());

        List<AttributeResponse> attrs = attributeRepository.findByProductId(product.getId()).stream()
                .map(a -> new AttributeResponse(a.getId(), a.getAttributeName(), a.getAttributeValue()))
                .collect(Collectors.toList());

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
}
