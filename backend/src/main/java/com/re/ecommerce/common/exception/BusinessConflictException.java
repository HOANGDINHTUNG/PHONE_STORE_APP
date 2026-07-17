package com.re.ecommerce.common.exception;

import lombok.Getter;

@Getter
public class BusinessConflictException extends RuntimeException {
    private final String errorCode;

    public BusinessConflictException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
