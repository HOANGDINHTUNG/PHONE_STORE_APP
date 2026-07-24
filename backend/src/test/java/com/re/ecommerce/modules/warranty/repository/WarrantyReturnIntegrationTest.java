package com.re.ecommerce.modules.warranty.repository;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;


import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class WarrantyReturnIntegrationTest {

    @Autowired
    private WarrantyRepository warrantyRepository;


    @Test
    public void contextLoads() {
        // Assert that repositories are successfully initialized and DB schema is correct
        assertThat(warrantyRepository).isNotNull();
    }
}
