package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.modules.catalog.dto.request.BrandRequest;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.BrandStatus;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.service.impl.BrandServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BrandServiceTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AuditLogger auditLogger;

    @InjectMocks
    private BrandServiceImpl brandService;

    private Brand brand;
    private UUID brandId;

    @BeforeEach
    void setUp() {
        brandId = UUID.randomUUID();
        brand = new Brand("Apple", "apple", "logo", "desc");
        brand.setId(brandId);
    }

    @Test
    void createBrand_shouldThrowConflictWhenSlugExists() {
        BrandRequest request = new BrandRequest("Apple", "url", "desc");
        when(brandRepository.existsBySlug("apple")).thenReturn(true);

        assertThrows(BusinessConflictException.class, () -> brandService.createBrand(request));
        
        verify(auditLogger).log(eq("BRAND_CREATE"), any(), any(), any(), any(), eq("FAILURE"));
        verify(brandRepository, never()).save(any());
    }

    @Test
    void changeBrandStatus_shouldThrowConflictWhenDeactivatingWithActiveProducts() {
        when(brandRepository.findById(brandId)).thenReturn(Optional.of(brand));
        when(productRepository.existsByBrandIdAndPublicationStatus(eq(brandId), any())).thenReturn(true);

        assertThrows(BusinessConflictException.class, () -> brandService.changeBrandStatus(brandId, BrandStatus.INACTIVE));
        
        verify(auditLogger).log(eq("BRAND_STATUS_CHANGE"), any(), any(), any(), any(), eq("FAILURE"));
    }
}
