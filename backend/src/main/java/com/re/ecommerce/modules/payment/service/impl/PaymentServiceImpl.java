package com.re.ecommerce.modules.payment.service.impl;

import com.re.ecommerce.common.exception.BusinessConflictException;
import com.re.ecommerce.common.exception.ResourceNotFoundException;
import com.re.ecommerce.modules.order.repository.OrderRepository;
import com.re.ecommerce.modules.order.entity.Order;
import com.re.ecommerce.modules.payment.config.VNPayConfig;
import com.re.ecommerce.modules.payment.dto.request.ManualPaymentRequest;
import com.re.ecommerce.modules.payment.dto.request.PaymentAttemptRequest;
import com.re.ecommerce.modules.payment.dto.response.PaymentAttemptResponse;
import com.re.ecommerce.modules.payment.entity.*;
import com.re.ecommerce.modules.payment.repository.PaymentAttemptRepository;
import com.re.ecommerce.modules.payment.repository.PaymentRepository;
import com.re.ecommerce.modules.payment.repository.PaymentWebhookEventRepository;
import com.re.ecommerce.modules.payment.service.PaymentService;
import com.re.ecommerce.modules.payment.utils.VNPayUtils;
import com.re.ecommerce.modules.auth.repository.UserRepository;
import com.re.ecommerce.modules.auth.entity.User;
import com.re.ecommerce.modules.inventory.service.StockReservationService;
import com.re.ecommerce.modules.order.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.servlet.http.HttpServletRequest;
import com.re.ecommerce.modules.system.entity.Notification;
import com.re.ecommerce.modules.system.repository.NotificationRepository;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final PaymentWebhookEventRepository webhookEventRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StockReservationService stockReservationService;
    private final NotificationRepository notificationRepository;
    
    private final VNPayConfig vnPayConfig;

    @Override
    @Transactional
    public PaymentAttemptResponse createPaymentAttempt(String orderCode, String idempotencyKey, PaymentAttemptRequest request, String clientIp) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("ORDER_NOT_FOUND", "Order not found with orderCode: " + orderCode));

        // Older orders may have been created before the checkout flow started
        // initializing payments. Create the aggregate on demand so they remain payable.
        Payment payment = paymentRepository.findByOrder_Id(order.getId())
                .orElseGet(() -> paymentRepository.save(Payment.builder()
                        .order(order)
                        .expectedAmount(order.getGrandTotalAmount())
                        .build()));

        if (payment.getStatus() == PaymentStatus.PAID || payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new BusinessConflictException("PAYMENT_ALREADY_SETTLED", "This order is already fully paid or refunded.");
        }

        BigDecimal remainingAmount = payment.getExpectedAmount().subtract(payment.getPaidAmount());
        if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessConflictException("PAYMENT_AMOUNT_INVALID", "Remaining amount to pay is zero.");
        }

        PaymentAttempt attempt = paymentAttemptRepository.findByMerchantRequestId(idempotencyKey)
            .orElseGet(() -> {
                PaymentAttempt newAttempt = PaymentAttempt.builder()
                    .payment(payment)
                    .merchantRequestId(idempotencyKey)
                    .attemptNumber(generateAttemptNumber(payment))
                    .method(request.getMethod())
                    .providerCode(request.getMethod().name())
                    .amount(remainingAmount)
                    .status(PaymentAttemptStatus.PENDING)
                    .build();
                return paymentAttemptRepository.save(newAttempt);
            });
            
        log.info("Created/Fetched payment attempt {} for order {}", attempt.getId(), orderCode);

        String redirectUrl = "";
        
        if (request.getMethod() == PaymentMethod.VNPAY) {
            redirectUrl = generateVNPayRedirectUrl(attempt, orderCode, clientIp);
        } else if (request.getMethod() == PaymentMethod.MOMO) {
            // Placeholder
            redirectUrl = "https://test-payment.momo.vn/v2/gateway/api/create"; 
        }
        
        return PaymentAttemptResponse.builder()
                .attemptId(attempt.getId() != null ? attempt.getId().toString() : "")
                .method(request.getMethod().name())
                .redirectUrl(redirectUrl)
                .build();
    }
    
    private String generateVNPayRedirectUrl(PaymentAttempt attempt, String orderCode, String clientIp) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = attempt.getId().toString();
        
        String vnp_IpAddr = clientIp;
        if (vnp_IpAddr == null || vnp_IpAddr.isEmpty() || vnp_IpAddr.contains(":")) {
           vnp_IpAddr = "127.0.0.1";
        }
        
        String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
        long amount = attempt.getAmount().longValue() * 100;
        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        
        // Use orderCode as OrderInfo
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderCode);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        
        // Build query url
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        try {
            for (String fieldName : fieldNames) {
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append('&');
                    hashData.append('&');
                }
            }
        } catch (Exception e) {
            log.error("Error generating VNPay URL", e);
        }
        
        query.setLength(query.length() - 1);
        hashData.setLength(hashData.length() - 1);
        
        String vnp_SecureHash = VNPayUtils.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        
        return vnPayConfig.getVnpUrl() + "?" + query.toString();
    }

    @Override
    @Transactional
    public void confirmManualPayment(Long paymentId, String idempotencyKey, ManualPaymentRequest request, java.util.UUID staffId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("PAYMENT_NOT_FOUND", "Payment not found with id: " + paymentId));

        if (paymentAttemptRepository.findByMerchantRequestId(idempotencyKey).isPresent()) {
            return;
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("STAFF_NOT_FOUND", "Staff not found with id: " + staffId));

        PaymentAttempt attempt = PaymentAttempt.builder()
                .payment(payment)
                .merchantRequestId(idempotencyKey)
                .attemptNumber(generateAttemptNumber(payment))
                .method(request.getMethod())
                .providerCode("MANUAL_SYSTEM")
                .amount(request.getAmount())
                .status(PaymentAttemptStatus.SUCCESS)
                .providerMessage(request.getReferenceNote())
                .createdBy(staff)
                .build();

        paymentAttemptRepository.save(attempt);
        updatePaymentAggregate(payment, request.getAmount());
    }

    @Override
    @Transactional
    public void processWebhook(String providerCode, String providerEventId, String rawPayload) {
        if (webhookEventRepository.findByProviderCodeAndProviderEventId(providerCode, providerEventId).isPresent()) {
            log.info("Idempotent webhook. Already processed event {} from {}", providerEventId, providerCode);
            return;
        }
        log.warn("Mock Webhook Processing. Event={}, Provider={}", providerEventId, providerCode);
        
        PaymentWebhookEvent event = PaymentWebhookEvent.builder()
                .providerCode(providerCode)
                .providerEventId(providerEventId)
                .payloadHash(new byte[32])
                .status(WebhookEventStatus.PROCESSED)
                .build();
                
        webhookEventRepository.save(event);
    }

    @Override
    @Transactional
    public ResponseEntity<Map<String, String>> processVNPayIpn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }
        
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");
        
        // Build hashData
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        try {
            for (String fieldName : fieldNames) {
                String fieldValue = fields.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    hashData.append('&');
                }
            }
        } catch (Exception e) {}
        
        if (hashData.length() > 0) {
            hashData.setLength(hashData.length() - 1);
        }
        
        String signValue = VNPayUtils.hmacSHA512(vnPayConfig.getVnpHashSecret(), hashData.toString());
        Map<String, String> response = new HashMap<>();

        if (signValue.equals(vnp_SecureHash)) {
            String txnRefStr = request.getParameter("vnp_TxnRef");
            String vnp_Amount = request.getParameter("vnp_Amount");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
            
            try {
                Long attemptId = Long.parseLong(txnRefStr);
                
                PaymentAttempt attempt = paymentAttemptRepository.findById(attemptId).orElse(null);
                if (attempt != null) {
                    if (attempt.getStatus() == PaymentAttemptStatus.PENDING) {
                        try {
                            if ("00".equals(vnp_ResponseCode)) {
                                attempt.setStatus(PaymentAttemptStatus.SUCCESS);
                                attempt.setProviderMessage(vnp_TransactionNo);
                                BigDecimal amount = new BigDecimal(vnp_Amount).divide(new BigDecimal(100));
                                updatePaymentAggregate(attempt.getPayment(), amount);
                                stockReservationService.confirmForFulfillment(attempt.getPayment().getOrder().getId());
                                
                                if (attempt.getPayment().getOrder().getCustomer() != null) {
                                    notificationRepository.save(new Notification(
                                            attempt.getPayment().getOrder().getCustomer(),
                                            "Thanh toán thành công",
                                            "Thanh toán thành công qua VNPay cho đơn hàng " + attempt.getPayment().getOrder().getOrderCode(),
                                            "PAYMENT",
                                            "Order",
                                            attempt.getPayment().getOrder().getId().toString(),
                                            "/account/orders/" + attempt.getPayment().getOrder().getOrderCode()
                                    ));
                                }
                            } else {
                                attempt.setStatus(PaymentAttemptStatus.FAILED);
                                attempt.setProviderMessage("Response Code: " + vnp_ResponseCode);
                                Order failedOrder = attempt.getPayment().getOrder();
                                if (failedOrder.getStatus() == OrderStatus.PENDING) {
                                    failedOrder.setStatus(OrderStatus.CANCELLED);
                                    failedOrder.setCancelledAt(LocalDateTime.now());
                                    failedOrder.setNote((failedOrder.getNote() == null ? "" : failedOrder.getNote() + " | ") + "Thanh toán thất bại");
                                    stockReservationService.releaseForOrder(failedOrder.getId(), "Thanh toán thất bại");
                                    orderRepository.save(failedOrder);
                                }
                                
                                if (failedOrder.getCustomer() != null) {
                                    notificationRepository.save(new Notification(
                                            failedOrder.getCustomer(),
                                            "Thanh toán thất bại",
                                            "Giao dịch bị từ chối hoặc có lỗi cho đơn hàng " + failedOrder.getOrderCode(),
                                            "PAYMENT",
                                            "Order",
                                            failedOrder.getId().toString(),
                                            "/account/orders/" + failedOrder.getOrderCode()
                                    ));
                                }
                            }
                            paymentAttemptRepository.save(attempt);
                            paymentRepository.save(attempt.getPayment());
                            
                            response.put("RspCode", "00");
                            response.put("Message", "Confirm Success");
                        } catch (Exception e) {
                            response.put("RspCode", "99");
                            response.put("Message", "Unknow error");
                        }
                    } else {
                        response.put("RspCode", "02");
                        response.put("Message", "Order already confirmed");
                    }
                } else {
                    response.put("RspCode", "01");
                    response.put("Message", "Order not found");
                }
            } catch (Exception e) {
                response.put("RspCode", "99");
                response.put("Message", "Unknow error");
            }
        } else {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum");
        }
        return ResponseEntity.ok(response);
    }

    private Integer generateAttemptNumber(Payment payment) {
        return 1;
    }

    private void updatePaymentAggregate(Payment payment, BigDecimal successAmount) {
        payment.setPaidAmount(payment.getPaidAmount().add(successAmount));

        if (payment.getPaidAmount().compareTo(payment.getExpectedAmount()) >= 0) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
        } else if (payment.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            payment.setStatus(PaymentStatus.PARTIALLY_PAID);
        }

        paymentRepository.save(payment);
    }
}
