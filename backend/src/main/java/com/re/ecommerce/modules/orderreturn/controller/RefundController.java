package com.re.ecommerce.modules.orderreturn.controller;

import com.re.ecommerce.common.dto.PagedResponse;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.orderreturn.dto.response.AdminRefundResponse;
import com.re.ecommerce.modules.orderreturn.dto.response.AdminRefundSummaryResponse;
import com.re.ecommerce.modules.orderreturn.entity.Refund;
import com.re.ecommerce.modules.orderreturn.enumeration.RefundStatus;
import com.re.ecommerce.modules.orderreturn.repository.RefundRepository;
import com.re.ecommerce.modules.orderreturn.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.re.ecommerce.modules.auth.entity.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/refunds")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RefundController {

    private final RefundRepository refundRepository;
    private final RefundService refundService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PagedResponse<AdminRefundResponse>> getAdminRefunds(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Page<Refund> refunds = refundRepository.findAll(
                PageRequest.of(safePage - 1, safeSize, Sort.by("createdAt").descending()));
        List<AdminRefundResponse> items = refunds.getContent().stream().map(this::toResponse).toList();
        return ResponseEntity.ok(PagedResponse.of(refunds, items));
    }

    @GetMapping("/summary")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminRefundSummaryResponse> getSummary() {
        List<Refund> refunds = refundRepository.findAll();
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(new AdminRefundSummaryResponse(
                count(refunds, RefundStatus.PENDING), amount(refunds, RefundStatus.PENDING),
                count(refunds, RefundStatus.PROCESSING), amount(refunds, RefundStatus.PROCESSING),
                refunds.stream().filter(refund -> refund.getStatus() == RefundStatus.SUCCESS
                                && refund.getUpdatedAt() != null
                                && refund.getUpdatedAt().toLocalDate().equals(today))
                        .count(),
                refunds.stream().filter(refund -> refund.getStatus() == RefundStatus.SUCCESS
                                && refund.getUpdatedAt() != null
                                && refund.getUpdatedAt().toLocalDate().equals(today))
                        .map(Refund::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add),
                count(refunds, RefundStatus.FAILED)));
    }

    @GetMapping("/{refundId}")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminRefundResponse> getAdminRefund(@PathVariable Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("REFUND_NOT_FOUND", "Refund not found"));
        return ResponseEntity.ok(toResponse(refund));
    }

    @PostMapping("/{refundId}/execute")
    public ResponseEntity<Void> executeRefund(
            @PathVariable Long refundId,
            @AuthenticationPrincipal User currentUser) {
        refundService.approveRefund(refundId, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    private long count(List<Refund> refunds, RefundStatus status) {
        return refunds.stream().filter(refund -> refund.getStatus() == status).count();
    }

    private BigDecimal amount(List<Refund> refunds, RefundStatus status) {
        return refunds.stream().filter(refund -> refund.getStatus() == status)
                .map(Refund::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private AdminRefundResponse toResponse(Refund refund) {
        return new AdminRefundResponse(
                refund.getId(),
                refund.getRefundCode(),
                refund.getPayment().getId(),
                refund.getPayment().getOrder().getOrderCode(),
                refund.getReturnRequest() != null ? refund.getReturnRequest().getReturnCode() : null,
                refund.getAmount(),
                refund.getMethod().name(),
                refund.getRequester().getUsername(),
                refund.getStatus().name(),
                refund.getReason(),
                refund.getCreatedAt());
    }
}
