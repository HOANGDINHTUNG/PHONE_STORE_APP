package com.re.ecommerce.common.exception;

public class RateLimitExceededException extends RuntimeException {
    private final String errorCode;

    public RateLimitExceededException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
