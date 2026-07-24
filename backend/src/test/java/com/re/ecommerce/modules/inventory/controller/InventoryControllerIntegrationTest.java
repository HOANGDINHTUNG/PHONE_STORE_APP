package com.re.ecommerce.modules.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.catalog.entity.Brand;
import com.re.ecommerce.modules.catalog.entity.Category;
import com.re.ecommerce.modules.catalog.entity.Product;
import com.re.ecommerce.modules.catalog.entity.ProductVariant;
import com.re.ecommerce.modules.catalog.repository.BrandRepository;
import com.re.ecommerce.modules.catalog.repository.CategoryRepository;
import com.re.ecommerce.modules.catalog.repository.ProductRepository;
import com.re.ecommerce.modules.catalog.repository.ProductVariantRepository;
import com.re.ecommerce.modules.inventory.dto.request.StockAdjustmentRequest;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventory;
import com.re.ecommerce.modules.inventory.entity.WarehouseInventoryId;
import com.re.ecommerce.modules.inventory.repository.WarehouseInventoryRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class InventoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private WarehouseInventoryRepository warehouseInventoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private ProductVariant testVariant;
    private Warehouse warehouse;

    @BeforeEach
    void setUp() {
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
        jdbcTemplate.execute("TRUNCATE TABLE warehouse_inventories");
        jdbcTemplate.execute("TRUNCATE TABLE stock_transactions");
        jdbcTemplate.execute("TRUNCATE TABLE inventory_units");
        jdbcTemplate.execute("TRUNCATE TABLE warehouses");
        jdbcTemplate.execute("TRUNCATE TABLE product_variants");
        jdbcTemplate.execute("TRUNCATE TABLE products");
        jdbcTemplate.execute("TRUNCATE TABLE brands");
        jdbcTemplate.execute("TRUNCATE TABLE categories");
        jdbcTemplate.execute("TRUNCATE TABLE users");
        jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");

        User adminUser = new User("adminuser", "admin@test.com", "password", "ADMIN");
        adminUser = userRepository.save(adminUser);

        Category cat = new Category(null, "TestCat", "test-cat", "desc", com.re.ecommerce.modules.catalog.entity.CategoryStatus.ACTIVE, 0);
        categoryRepository.save(cat);
        Brand brand = new Brand("TestBrand", "test-brand", "logo", "desc");
        brandRepository.save(brand);
        Product product = new Product(cat, brand, "TestProd", "test-prod", "desc");
        product.setPublicationStatus(com.re.ecommerce.modules.catalog.entity.PublicationStatus.ACTIVE);
        productRepository.save(product);
        
        testVariant = new ProductVariant(product, "SKU_INV", "Variant 1", "Black", 8, 256, null, 12, BigDecimal.valueOf(100), BigDecimal.valueOf(100));
        testVariant = productVariantRepository.save(testVariant);
        
        warehouse = new Warehouse();
        warehouse.setName("WarehouseA");
        warehouse.setCode("WH-INV-01");
        warehouse.setAddress("XYZ");
        warehouse = warehouseRepository.save(warehouse);
        
        WarehouseInventory inv = new WarehouseInventory();
        inv.setId(new WarehouseInventoryId(warehouse.getId(), testVariant.getId()));
        inv.setWarehouse(warehouse);
        inv.setProductVariant(testVariant);
        inv.setOnHandQuantity(100);
        inv.setReservedQuantity(10);
        inv.setReorderLevel(20);
        warehouseInventoryRepository.save(inv);
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW"})
    void getBalances_shouldReturnPage() throws Exception {
        mockMvc.perform(get("/api/v1/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].onHandQuantity").value(100));
    }
    
    @Test
    @org.springframework.security.test.context.support.WithMockUser(authorities = {"SCOPE_INVENTORY_VIEW", "SCOPE_INVENTORY_ADJUST"})
    void prepareAdjustment_shouldIncreaseStock_andCreateLedger() throws Exception {
        StockAdjustmentRequest req = new StockAdjustmentRequest(warehouse.getId(), testVariant.getId(), "ADJUST_IN", 50, "Audit required", null);
        
        mockMvc.perform(post("/api/v1/inventory/adjustments")
                        .header("X-Idempotency-Key", "idem-adj-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());
                
        // Validation query
        mockMvc.perform(get("/api/v1/inventory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].onHandQuantity").value(150));
    }
}
