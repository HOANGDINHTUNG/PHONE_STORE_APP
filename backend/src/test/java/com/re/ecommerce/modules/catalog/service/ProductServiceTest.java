package com.re.ecommerce.modules.catalog.service;

import com.re.ecommerce.common.audit.service.AuditLogger;
import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.modules.catalog.dto.request.ProductCreateRequest;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.CategoryStatus;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.PublicationStatus;
import com.re.ecommerce.modules.catalog.repository.*;
import com.re.ecommerce.modules.catalog.service.impl.ProductServiceImpl;
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
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private BrandRepository brandRepository;
    
    @Mock
    private ProductVariantRepository variantRepository;
    
    @Mock
    private ProductSpecificationRepository specRepository;
    
    @Mock
    private ProductAttributeRepository attrRepository;
    
    @Mock
    private ProductImageRepository imageRepository;

    @Mock
    private AuditLogger auditLogger;

    @InjectMocks
    private ProductServiceImpl productService;

    private UUID catId = UUID.randomUUID();
    private UUID brandId = UUID.randomUUID();
    private UUID prodId = UUID.randomUUID();

    @Test
    void createProduct_shouldThrowIfCategoryInactive() {
        Category cat = new Category(null, "Cat", "cat", "desc", CategoryStatus.INACTIVE, 0);
        when(categoryRepository.findById(catId)).thenReturn(Optional.of(cat));
        
        ProductCreateRequest req = new ProductCreateRequest(catId, brandId, "P1", "desc");
        
        assertThrows(BusinessConflictException.class, () -> productService.createProduct(req));
    }
    
    @Test
    void changeStatus_shouldThrowIfActivatingAndNoActiveVariants() {
        Category cat = new Category(null, "Cat", "cat", "desc", CategoryStatus.ACTIVE, 0);
        Brand brand = new Brand("Brand", "b", "url", "desc");
        
        Product p = new Product(cat, brand, "P1", "p1", "desc");
        p.setId(prodId);
        
        when(productRepository.findById(prodId)).thenReturn(Optional.of(p));
        when(variantRepository.existsByProductIdAndStatus(eq(prodId), any())).thenReturn(false);
        
        assertThrows(BusinessConflictException.class, () -> productService.changeProductStatus(prodId, PublicationStatus.ACTIVE));
    }
}
