package com.re.ecommerce.modules.catalog.service.impl;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.common.utils.SlugUtils;
import com.re.ecommerce.modules.catalog.dto.request.BrandRequest;
import com.re.ecommerce.modules.catalog.dto.response.BrandResponse;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.BrandStatus;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.service.BrandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final AuditLogger auditLogger;

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> listPublicBrands(String keyword) {
        List<Brand> brands = brandRepository.findByStatus(BrandStatus.ACTIVE);
        return filterAndSortBrands(brands, keyword);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> adminListBrands(String keyword, BrandStatus status) {
        List<Brand> brands = status != null ? brandRepository.findByStatus(status) : brandRepository.findAll();
        return filterAndSortBrands(brands, keyword);
    }

    @Override
    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        String slug = SlugUtils.toSlug(request.name());
        
        if (brandRepository.existsBySlug(slug)) {
            auditLogger.log("BRAND_CREATE", "Brand", null, null, request, "FAILURE");
            throw new BusinessConflictException("BRAND_SLUG_EXISTS", "Brand slug already exists: " + slug);
        }
        
        Brand brand = new Brand(request.name(), slug, request.logoUrl(), request.description());
        brand = brandRepository.save(brand);
        
        BrandResponse response = mapToResponse(brand);
        auditLogger.log("BRAND_CREATE", "Brand", brand.getId().toString(), null, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional
    public BrandResponse updateBrand(UUID id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BRAND_NOT_FOUND", "Brand not found"));

        String newSlug = SlugUtils.toSlug(request.name());
        if (brandRepository.existsBySlugAndIdNot(newSlug, id)) {
            auditLogger.log("BRAND_UPDATE", "Brand", id.toString(), mapToResponse(brand), request, "FAILURE");
            throw new BusinessConflictException("BRAND_SLUG_EXISTS", "Brand slug already exists: " + newSlug);
        }

        BrandResponse oldState = mapToResponse(brand);

        brand.setName(request.name());
        brand.setSlug(newSlug);
        brand.setLogoUrl(request.logoUrl());
        brand.setDescription(request.description());

        brand = brandRepository.save(brand);
        
        BrandResponse response = mapToResponse(brand);
        auditLogger.log("BRAND_UPDATE", "Brand", brand.getId().toString(), oldState, response, "SUCCESS");
        return response;
    }

    @Override
    @Transactional
    public BrandResponse changeBrandStatus(UUID id, BrandStatus status) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BRAND_NOT_FOUND", "Brand not found"));

        if (brand.getStatus() == status) {
            return mapToResponse(brand);
        }

        BrandResponse oldState = mapToResponse(brand);

        if (status == BrandStatus.INACTIVE) {
            // Check if there are active products using this brand
            boolean hasActiveProducts = productRepository.existsByBrandIdAndPublicationStatus(id, PublicationStatus.ACTIVE);
            if (hasActiveProducts) {
                auditLogger.log("BRAND_STATUS_CHANGE", "Brand", id.toString(), oldState, status, "FAILURE");
                throw new BusinessConflictException("BRAND_IN_USE", "Cannot deactivate brand because there are active products using it");
            }
        }

        brand.setStatus(status);
        brand = brandRepository.save(brand);

        BrandResponse response = mapToResponse(brand);
        auditLogger.log("BRAND_STATUS_CHANGE", "Brand", brand.getId().toString(), oldState, response, "SUCCESS");
        return response;
    }

    private List<BrandResponse> filterAndSortBrands(List<Brand> brands, String keyword) {
        return brands.stream()
                .filter(b -> keyword == null || keyword.trim().isEmpty() ||
                        b.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                        (b.getDescription() != null && b.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .map(this::mapToResponse)
                .sorted(Comparator.comparing(BrandResponse::createdAt).reversed())
                .collect(Collectors.toList());
    }

    private BrandResponse mapToResponse(Brand brand) {
        return new BrandResponse(
                brand.getId(),
                brand.getName(),
                brand.getSlug(),
                brand.getLogoUrl(),
                brand.getDescription(),
                brand.getStatus(),
                brand.getCreatedAt(),
                brand.getUpdatedAt()
        );
    }
}
