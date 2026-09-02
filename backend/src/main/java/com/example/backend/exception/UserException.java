package com.example.backend.exception;

public class UserException extends RuntimeException{
    private final OperationType type;
    private final String role;

    public UserException(String message, OperationType type, String role) {
        super(message);
        this.type = type;
        this.role = role;
    }

    public OperationType getType() {
        return type;
    }

    public String getRole() {
        return role;
    }
}

