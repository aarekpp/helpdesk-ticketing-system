package com.example.backend.exception;

public class TicketException extends RuntimeException{
    private final OperationType type;

    public TicketException(String message, OperationType type){
        super(message);
        this.type = type;
    }

    public OperationType getType(){return type;}
}
