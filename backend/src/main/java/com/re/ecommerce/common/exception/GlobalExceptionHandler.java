package com.re.ecommerce.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .errorCode("BAD_REQUEST")
                .message(ex.getMessage())
                .correlationId(UUID.randomUUID().toString())
                .build();
        
        log.warn("Business Exception [{}]: {}", response.getCorrelationId(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse response = ErrorResponse.builder()
                .errorCode("FORBIDDEN")
                .message("Bạn không có quyền thực hiện thao tác này.")
                .correlationId(UUID.randomUUID().toString())
                .build();
        
        log.warn("Access Denied [{}]: {}", response.getCorrelationId(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage()));
            
        ErrorResponse response = ErrorResponse.builder()
                .errorCode("VALIDATION_FAILED")
                .message("Dữ liệu đầu vào không hợp lệ.")
                .fieldErrors(fieldErrors)
                .correlationId(UUID.randomUUID().toString())
                .build();
        
        log.warn("Validation Failed [{}]: {}", response.getCorrelationId(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllUncaughtException(Exception ex) {
        ErrorResponse response = ErrorResponse.builder()
                .errorCode("INTERNAL_SERVER_ERROR")
                .message("Đã có lỗi hệ thống xảy ra.")
                .correlationId(UUID.randomUUID().toString())
                .build();
                
        log.error("System Error [{}]: ", response.getCorrelationId(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
