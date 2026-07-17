package com.re.ecommerce.common.exception;

public class AccountLockedException extends RuntimeException {
    private final String errorCode;

    public AccountLockedException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
