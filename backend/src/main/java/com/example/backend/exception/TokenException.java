package com.example.backend.exception;

public class TokenException extends RuntimeException {
    private final OperationType type;

    public TokenException(String message, OperationType type) {
        super(message);
        this.type = type;
    }

    public OperationType getType() {
        return type;
    }
}

