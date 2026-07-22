package com.re.ecommerce.modules.inventory.service;

import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface SupplierService {

    Page<SupplierResponse> getAllSuppliers(SupplierStatus status, int page, int size);

    SupplierResponse getSupplier(UUID id);

    SupplierResponse createSupplier(SupplierRequest request);

    SupplierResponse updateSupplier(UUID id, SupplierRequest request);

    SupplierResponse changeStatus(UUID id, SupplierStatus status);
}
