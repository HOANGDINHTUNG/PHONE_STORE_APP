package com.re.ecommerce.modules.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.PurchaseOrderItemRequest;
import com.re.ecommerce.modules.inventory.entity.PurchaseOrder;
import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.PurchaseOrderStatus;
import com.re.ecommerce.modules.inventory.repository.PurchaseOrderRepository;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PurchaseOrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ProductVariant testVariant;
    private PurchaseOrder testPo;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE purchase_order_items");
        jdbcTemplate.execute("TRUNCATE TABLE purchase_orders");
        jdbcTemplate.execute("TRUNCATE TABLE suppliers");
        jdbcTemplate.execute("TRUNCATE TABLE warehouses");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants");
        jdbcTemplate.execute("TRUNCATE TABLE products");
        jdbcTemplate.execute("TRUNCATE TABLE brands");
        jdbcTemplate.execute("TRUNCATE TABLE categories");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

        Category cat = new Category(null, "TestCat", "test-cat", "desc", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);
        Brand brand = new Brand("TestBrand", "test-brand", "logo", "desc");
        brandRepository.save(brand);
        Product product = new Product(cat, brand, "TestProd", "test-prod", "desc");
        product.setPublicationStatus(com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE);
        productRepository.save(product);
        
        testVariant = new ProductVariant(product, "SKU_PO", "Variant 1", "Black", 8, 256, null, 12, BigDecimal.valueOf(100), BigDecimal.valueOf(100));
        testVariant = productVariantRepository.save(testVariant);
        
        Supplier supplier = new Supplier();
        supplier.setName("SupplierA");
        supplier.setSupplierCode("SUP-TEST-001");
        supplier.setContactName("John");
        supplier.setAddress("ABC");
        supplier = supplierRepository.save(supplier);
        
        Warehouse warehouse = new Warehouse();
        warehouse.setName("WarehouseA");
        warehouse.setCode("WH-PO-01");
        warehouse.setAddress("XYZ");
        warehouse = warehouseRepository.save(warehouse);
        
        testPo = new PurchaseOrder();
        testPo.setPurchaseOrderCode("PO-TEST-001");
        testPo.setSupplier(supplier);
        testPo.setWarehouse(warehouse);
        testPo.setStatus(PurchaseOrderStatus.DRAFT);
        testPo.setTotalAmount(BigDecimal.ZERO);
        testPo.setExpectedAt(LocalDateTime.now().plusDays(5));
        testPo = purchaseOrderRepository.save(testPo);
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(authorities = {"SCOPE_PO_MANAGE"})
    void addItem_shouldReturn201_whenValid() throws Exception {
        PurchaseOrderItemRequest req = new PurchaseOrderItemRequest(testVariant.getId(), 50, BigDecimal.valueOf(120.00));
        
        mockMvc.perform(post("/api/v1/purchase-orders/" + testPo.getId() + "/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.items.length()").value(1))
                .andExpect(jsonPath("$.totalAmount").value(6000.0));
    }
}
