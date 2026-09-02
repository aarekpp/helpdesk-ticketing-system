package com.example.backend.exception;

public class TicketReadStatusException extends RuntimeException{
    private final OperationType type;

    public TicketReadStatusException(String message, OperationType type){
        super(message);
        this.type = type;
    }

    public OperationType getType(){return type;}
}
