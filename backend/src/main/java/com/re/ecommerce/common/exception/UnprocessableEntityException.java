package com.re.ecommerce.common.exception;

import lombok.Getter;

@Getter
public class UnprocessableEntityException extends RuntimeException {
    private final String errorCode;

    public UnprocessableEntityException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
