package com.example.backend.exception;

public class MessageException extends RuntimeException{
    private final OperationType type;

    public MessageException(String message, OperationType type){
        super(message);
        this.type = type;
    }

    public OperationType getType(){return type;}

}
