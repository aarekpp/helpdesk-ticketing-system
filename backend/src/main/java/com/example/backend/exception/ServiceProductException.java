package com.example.backend.exception;

public class ServiceProductException extends RuntimeException{
    private final OperationType type;

    public ServiceProductException(String message, OperationType type) {
        super(message);
        this.type = type;
    }

    public OperationType getType() {
        return type;
    }
}
