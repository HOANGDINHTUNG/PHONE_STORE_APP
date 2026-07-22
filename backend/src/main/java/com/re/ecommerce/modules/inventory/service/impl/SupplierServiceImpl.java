package com.re.ecommerce.modules.inventory.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.inventory.dto.request.SupplierRequest;
import com.re.ecommerce.modules.inventory.dto.response.SupplierResponse;
import com.re.ecommerce.modules.inventory.entity.Supplier;
import com.re.ecommerce.modules.inventory.entity.enums.SupplierStatus;
import com.re.ecommerce.modules.inventory.repository.SupplierRepository;
import com.re.ecommerce.modules.inventory.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SupplierResponse> getAllSuppliers(SupplierStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Supplier> suppliers = (status != null)
                ? supplierRepository.findByStatus(status, pageable)
                : supplierRepository.findAll(pageable);
        return suppliers.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getSupplier(UUID id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional
    public SupplierResponse createSupplier(SupplierRequest request) {
        if (supplierRepository.findBySupplierCode(request.supplierCode()).isPresent()) {
            throw new BusinessConflictException("SUPPLIER_CODE_EXISTS", "Mã NCC đã tồn tại");
        }
        if (request.taxCode() != null && supplierRepository.findByTaxCode(request.taxCode()).isPresent()) {
            throw new BusinessConflictException("TAX_CODE_EXISTS", "Mã số thuế NCC đã tồn tại");
        }

        Supplier supplier = new Supplier();
        supplier.setSupplierCode(request.supplierCode());
        supplier.setName(request.name());
        supplier.setTaxCode(request.taxCode());
        supplier.setContactName(request.contactName());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        supplier.setAddress(request.address());

        return mapToResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public SupplierResponse updateSupplier(UUID id, SupplierRequest request) {
        Supplier supplier = findById(id);

        if (!supplier.getSupplierCode().equals(request.supplierCode()) 
                && supplierRepository.findBySupplierCode(request.supplierCode()).isPresent()) {
            throw new BusinessConflictException("SUPPLIER_CODE_EXISTS", "Mã NCC đã tồn tại");
        }

        if (request.taxCode() != null 
                && !request.taxCode().equals(supplier.getTaxCode()) 
                && supplierRepository.findByTaxCode(request.taxCode()).isPresent()) {
            throw new BusinessConflictException("TAX_CODE_EXISTS", "Mã số thuế NCC đã tồn tại");
        }

        supplier.setSupplierCode(request.supplierCode());
        supplier.setName(request.name());
        supplier.setTaxCode(request.taxCode());
        supplier.setContactName(request.contactName());
        supplier.setPhone(request.phone());
        supplier.setEmail(request.email());
        supplier.setAddress(request.address());

        return mapToResponse(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public SupplierResponse changeStatus(UUID id, SupplierStatus status) {
        Supplier supplier = findById(id);
        supplier.setStatus(status);
        return mapToResponse(supplierRepository.save(supplier));
    }

    private Supplier findById(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SUPPLIER_NOT_FOUND", "Không tìm thấy nhà cung cấp"));
    }

    private SupplierResponse mapToResponse(Supplier s) {
        return new SupplierResponse(
                s.getId(),
                s.getSupplierCode(),
                s.getName(),
                s.getTaxCode(),
                s.getContactName(),
                s.getPhone(),
                s.getEmail(),
                s.getAddress(),
                s.getStatus(),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
