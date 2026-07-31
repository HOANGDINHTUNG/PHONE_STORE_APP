package com.re.ecommerce.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ProblemDetail;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private ProblemDetail buildProblemDetail(HttpStatus status, String errorCode, String message) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, message);
        problemDetail.setProperty("errorCode", errorCode);
        String correlationId = UUID.randomUUID().toString();
        problemDetail.setProperty("correlationId", correlationId);
        log.warn("{} [{}]: {}", errorCode, correlationId, message);
        return problemDetail;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildProblemDetail(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildProblemDetail(HttpStatus.NOT_FOUND, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(BusinessConflictException.class)
    public ProblemDetail handleBusinessConflictException(BusinessConflictException ex) {
        return buildProblemDetail(HttpStatus.CONFLICT, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(UnprocessableEntityException.class)
    public ProblemDetail handleUnprocessableEntityException(UnprocessableEntityException ex) {
        return buildProblemDetail(HttpStatus.UNPROCESSABLE_ENTITY, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorizedException(UnauthorizedException ex) {
        return buildProblemDetail(HttpStatus.UNAUTHORIZED, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(AccountLockedException.class)
    public ProblemDetail handleAccountLockedException(AccountLockedException ex) {
        return buildProblemDetail(HttpStatus.LOCKED, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ProblemDetail handleRateLimitExceededException(RateLimitExceededException ex) {
        return buildProblemDetail(HttpStatus.TOO_MANY_REQUESTS, ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDeniedException(AccessDeniedException ex) {
        return buildProblemDetail(HttpStatus.FORBIDDEN, "FORBIDDEN", "Bạn không có quyền thực hiện thao tác này.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage()));
            
        ProblemDetail problemDetail = buildProblemDetail(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Dữ liệu đầu vào không hợp lệ.");
        problemDetail.setProperty("fieldErrors", fieldErrors);
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        return buildProblemDetail(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Dữ liệu đầu vào không đúng định dạng.");
    }

    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolationException(jakarta.validation.ConstraintViolationException ex) {
        return buildProblemDetail(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Dữ liệu đầu vào không hợp lệ: " + ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleAllUncaughtException(Exception ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Đã có lỗi hệ thống xảy ra.");
        problemDetail.setProperty("errorCode", "INTERNAL_SERVER_ERROR");
        String correlationId = UUID.randomUUID().toString();
        problemDetail.setProperty("correlationId", correlationId);
        log.error("System Error [{}]: ", correlationId, ex);
        return problemDetail;
    }
}
