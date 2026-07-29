package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.service.impl.SupplierServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SupplierServiceImplTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierServiceImpl supplierService;

    private Supplier supplier;
    private final UUID supplierId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        supplier = new Supplier();
        supplier.setId(supplierId);
        supplier.setSupplierCode("SUP001");
        supplier.setName("Supplier A");
        supplier.setTaxCode("TAX123");
        supplier.setStatus(SupplierStatus.ACTIVE);
    }

    @Test
    void getAllSuppliers_WithStatus_ReturnsPagedResponse() {
        when(supplierRepository.findByStatus(eq(SupplierStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(supplier)));

        Page<SupplierResponse> result = supplierService.getAllSuppliers(SupplierStatus.ACTIVE, 1, 10);
        assertEquals(1, result.getTotalElements());
        assertEquals("SUP001", result.getContent().get(0).supplierCode());
    }

    @Test
    void getAllSuppliers_WithoutStatus_ReturnsPagedResponse() {
        when(supplierRepository.findAll(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(supplier)));

        Page<SupplierResponse> result = supplierService.getAllSuppliers(null, 1, 10);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void getSupplier_Success() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        
        SupplierResponse result = supplierService.getSupplier(supplierId);
        assertEquals(supplierId, result.id());
    }

    @Test
    void getSupplier_NotFound_ThrowsException() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> supplierService.getSupplier(supplierId));
    }

    @Test
    void createSupplier_Success() {
        SupplierRequest request = new SupplierRequest("SUP002", "Supplier B", "TAX456", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findBySupplierCode(request.supplierCode())).thenReturn(Optional.empty());
        when(supplierRepository.findByTaxCode(request.taxCode())).thenReturn(Optional.empty());
        when(supplierRepository.save(any(Supplier.class))).thenAnswer(i -> {
            Supplier s = i.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });

        SupplierResponse result = supplierService.createSupplier(request);
        assertEquals("SUP002", result.supplierCode());
        assertEquals("TAX456", result.taxCode());
    }

    @Test
    void createSupplier_CodeExists_ThrowsException() {
        SupplierRequest request = new SupplierRequest("SUP001", "Supplier B", "TAX456", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findBySupplierCode(request.supplierCode())).thenReturn(Optional.of(new Supplier()));
        assertThrows(BusinessConflictException.class, () -> supplierService.createSupplier(request));
    }

    @Test
    void createSupplier_TaxCodeExists_ThrowsException() {
        SupplierRequest request = new SupplierRequest("SUP002", "Supplier B", "TAX123", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findBySupplierCode(request.supplierCode())).thenReturn(Optional.empty());
        when(supplierRepository.findByTaxCode(request.taxCode())).thenReturn(Optional.of(new Supplier()));
        assertThrows(BusinessConflictException.class, () -> supplierService.createSupplier(request));
    }

    @Test
    void updateSupplier_Success() {
        SupplierRequest request = new SupplierRequest("SUP002", "Supplier B", "TAX456", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.findBySupplierCode(request.supplierCode())).thenReturn(Optional.empty());
        when(supplierRepository.findByTaxCode(request.taxCode())).thenReturn(Optional.empty());
        when(supplierRepository.save(any(Supplier.class))).thenAnswer(i -> i.getArgument(0));

        SupplierResponse result = supplierService.updateSupplier(supplierId, request);
        assertEquals("SUP002", result.supplierCode());
        assertEquals("TAX456", result.taxCode());
    }

    @Test
    void updateSupplier_SameCodeSameTaxCode_Success() {
        SupplierRequest request = new SupplierRequest("SUP001", "Supplier B", "TAX123", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(any(Supplier.class))).thenAnswer(i -> i.getArgument(0));

        SupplierResponse result = supplierService.updateSupplier(supplierId, request);
        assertEquals("SUP001", result.supplierCode());
        assertEquals("TAX123", result.taxCode());
    }

    @Test
    void updateSupplier_CodeChangedExists_ThrowsException() {
        SupplierRequest request = new SupplierRequest("SUP002", "Supplier B", "TAX123", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.findBySupplierCode(request.supplierCode())).thenReturn(Optional.of(new Supplier()));
        assertThrows(BusinessConflictException.class, () -> supplierService.updateSupplier(supplierId, request));
    }

    @Test
    void updateSupplier_TaxCodeChangedExists_ThrowsException() {
        SupplierRequest request = new SupplierRequest("SUP001", "Supplier B", "TAX456", "Contact", "123", "a@b.c", "Address");
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.findByTaxCode(request.taxCode())).thenReturn(Optional.of(new Supplier()));
        assertThrows(BusinessConflictException.class, () -> supplierService.updateSupplier(supplierId, request));
    }

    @Test
    void changeStatus_Success() {
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(any(Supplier.class))).thenAnswer(i -> i.getArgument(0));

        SupplierResponse result = supplierService.changeStatus(supplierId, SupplierStatus.INACTIVE);
        assertEquals(SupplierStatus.INACTIVE, result.status());
    }
}
