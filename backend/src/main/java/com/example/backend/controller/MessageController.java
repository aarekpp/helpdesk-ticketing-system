package com.example.backend.controller;

import com.example.backend.config.ApiResponse;
import com.example.backend.dto.Message.MessageResponseDTO;
import com.example.backend.model.Message;
import com.example.backend.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ApiResponse<MessageResponseDTO>> addMessage(
            HttpServletRequest request,
            @PathVariable String id,
            @RequestPart(value = "message", required = false) String message,
            @RequestPart(value = "files", required = false)List<MultipartFile> files) throws IOException {
        Message savedMessage = messageService.saveMessage(request, id, message, files);
        return ResponseEntity.ok(ApiResponse.success(MessageResponseDTO.fromEntity(savedMessage), "Message saved successfully."));
    }
}
