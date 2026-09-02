package com.example.backend.exception;

public class CompanyException extends RuntimeException{
    private final OperationType type;

    public CompanyException(String message, OperationType type) {
        super(message);
        this.type = type;
    }

    public OperationType getType(){return type;}
}
