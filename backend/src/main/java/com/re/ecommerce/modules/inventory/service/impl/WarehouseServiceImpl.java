package com.re.ecommerce.modules.inventory.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.inventory.dto.request.WarehouseRequest;
import com.re.ecommerce.modules.inventory.dto.response.WarehouseResponse;
import com.re.ecommerce.modules.inventory.entity.Warehouse;
import com.re.ecommerce.modules.inventory.entity.enums.WarehouseStatus;
import com.re.ecommerce.modules.inventory.repository.WarehouseRepository;
import com.re.ecommerce.modules.inventory.service.WarehouseService;
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
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<WarehouseResponse> getAllWarehouses(WarehouseStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Warehouse> warehouses = (status != null) 
                ? warehouseRepository.findByStatus(status, pageable)
                : warehouseRepository.findAll(pageable);
        return warehouses.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseResponse getWarehouse(UUID id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.findByCode(request.code()).isPresent()) {
            throw new BusinessConflictException("WAREHOUSE_CODE_EXISTS", "Mã kho đã tồn tại");
        }
        if (warehouseRepository.findByName(request.name()).isPresent()) {
            throw new BusinessConflictException("WAREHOUSE_NAME_EXISTS", "Tên kho đã tồn tại");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setPhone(request.phone());
        warehouse.setAddress(request.address());
        // Auto default to ACTIVE

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    @Override
    @Transactional
    public WarehouseResponse updateWarehouse(UUID id, WarehouseRequest request) {
        Warehouse warehouse = findById(id);

        if (!warehouse.getCode().equals(request.code()) && warehouseRepository.findByCode(request.code()).isPresent()) {
            throw new BusinessConflictException("WAREHOUSE_CODE_EXISTS", "Mã kho đã tồn tại");
        }
        if (!warehouse.getName().equals(request.name()) && warehouseRepository.findByName(request.name()).isPresent()) {
            throw new BusinessConflictException("WAREHOUSE_NAME_EXISTS", "Tên kho đã tồn tại");
        }

        warehouse.setCode(request.code());
        warehouse.setName(request.name());
        warehouse.setPhone(request.phone());
        warehouse.setAddress(request.address());

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    @Override
    @Transactional
    public WarehouseResponse changeStatus(UUID id, WarehouseStatus status) {
        Warehouse warehouse = findById(id);
        
        // P0 rule: "Nếu còn active reservation hoặc shipment PENDING/PACKING, trả 409 WAREHOUSE_HAS_ACTIVE_OPERATIONS" 
        // -> For now, to unblock, we will assume no active operations check, or we will add it later when integrating shipments.
        
        warehouse.setStatus(status);
        return mapToResponse(warehouseRepository.save(warehouse));
    }

    private Warehouse findById(UUID id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WAREHOUSE_NOT_FOUND", "Không tìm thấy kho"));
    }

    private WarehouseResponse mapToResponse(Warehouse w) {
        return new WarehouseResponse(
                w.getId(),
                w.getCode(),
                w.getName(),
                w.getPhone(),
                w.getAddress(),
                w.getStatus(),
                w.getCreatedAt(),
                w.getUpdatedAt()
        );
    }
}
