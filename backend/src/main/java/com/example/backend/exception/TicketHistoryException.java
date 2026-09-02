package com.example.backend.exception;

public class TicketHistoryException extends  RuntimeException{
    private final OperationType type;

    public TicketHistoryException(String message, OperationType type){
        super(message);
        this.type = type;
    }

    public OperationType getType(){return type;}
}
