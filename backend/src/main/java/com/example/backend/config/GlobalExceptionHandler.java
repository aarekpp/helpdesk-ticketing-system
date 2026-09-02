package com.example.backend.config;

import com.example.backend.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private HttpStatus mapOperationTypeToStatus(OperationType type) {
        return switch (type) {
            case CREATION -> HttpStatus.BAD_REQUEST;
            case UPDATE -> HttpStatus.CONFLICT;
            case DELETION, RETRIEVAL, GET -> HttpStatus.NOT_FOUND;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }

    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ApiResponse<String>> handleTokenException(TokenException ex) {
        HttpStatus status = switch (ex.getType()) {
            case CREATION -> HttpStatus.UNAUTHORIZED;
            case UPDATE -> HttpStatus.FORBIDDEN;
            case DELETION -> HttpStatus.FORBIDDEN;
            case RETRIEVAL -> HttpStatus.UNAUTHORIZED;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        String errorMessage = String.format("Operation %s on token failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(ServiceProductException.class)
    public ResponseEntity<ApiResponse<String>> handleServiceProductException(ServiceProductException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        return ResponseEntity.status(status).body(ApiResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse<String>> handleUserException(UserException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s failed for %s: %s",
                ex.getType().name().toLowerCase(),
                ex.getRole(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(RoleException.class)
    public ResponseEntity<ApiResponse<String>> handleRoleException(RoleException ex){
        String errorMessage = String.format("Operation failed: %s",ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(CompanyException.class)
    public ResponseEntity<ApiResponse<String>> handleCompanyException(CompanyException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on company failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(TicketException.class)
    public ResponseEntity<ApiResponse<String>> handleTicketException(TicketException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on ticket failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(MessageException.class)
    public ResponseEntity<ApiResponse<String>> handleMessageException(TicketException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on message failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(FileException.class)
    public ResponseEntity<ApiResponse<String>> handleFileException(TicketException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on file failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(TicketHistoryException.class)
    public ResponseEntity<ApiResponse<String>> handleTicketHistoryException(TicketException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on ticket history failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(TicketReadStatusException.class)
    public ResponseEntity<ApiResponse<String>> handleTicketReadStatusException(TicketException ex){
        HttpStatus status = mapOperationTypeToStatus(ex.getType());
        String errorMessage = String.format("Operation %s on ticket read status failed: %s",
                ex.getType().name().toLowerCase(),
                ex.getMessage());

        return ResponseEntity.status(status).body(ApiResponse.failure(errorMessage));
    }
}