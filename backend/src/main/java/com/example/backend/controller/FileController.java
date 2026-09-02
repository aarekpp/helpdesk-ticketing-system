package com.example.backend.controller;

import com.example.backend.exception.FileException;
import com.example.backend.exception.OperationType;
import com.example.backend.model.File;
import com.example.backend.service.FileService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/preview/{id}")
    public ResponseEntity<Resource> previewFile(@PathVariable Long id) {
        File file = fileService.getFileById(id);
        Resource resource = new FileSystemResource(file.getFilePath());

        if (!resource.exists()) {
            throw new FileException("File not found.", OperationType.GET);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/message/{fileId}")
    public ResponseEntity<Resource> downloadMessageFile(@PathVariable Long fileId) {
        File file = fileService.getFileById(fileId);
        Resource resource = new FileSystemResource(file.getFilePath());

        if (!resource.exists()) {
            throw new FileException("File not found.", OperationType.GET);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getOriginalFileName() + "\"")
                .body(resource);
    }
}
