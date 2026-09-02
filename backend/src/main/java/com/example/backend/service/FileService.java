package com.example.backend.service;

import com.example.backend.exception.FileException;
import com.example.backend.exception.OperationType;
import com.example.backend.model.File;
import com.example.backend.model.Message;
import com.example.backend.model.Ticket;
import com.example.backend.repository.FileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {
    private final FileRepository fileRepository;

    @Autowired
    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public List<File> getFilesForTicket(Ticket ticket){
        return fileRepository.findAllByTicket(ticket);
    }

    public File getFileById(Long id){
        return fileRepository.findById(id).orElseThrow(() -> new FileException("File does not exist.", OperationType.GET));
    }

    @Transactional
    public void saveFiles(List<MultipartFile> files, Ticket ticket){
        String ticketFolderPath = "uploads/tickets/" + ticket.getUuid();
        Path ticketFolder = Paths.get(ticketFolderPath);

        try {
            if (!Files.exists(ticketFolder)) {
                Files.createDirectories(ticketFolder);
            }
        } catch (IOException e) {
            throw new FileException("Failed to create directory for ticket " + ticket.getUuid() + ": " + e.getMessage(), OperationType.CREATION);
        }

        for(MultipartFile file : files){
            String originalFileName = file.getOriginalFilename();
            String fileType = file.getContentType();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = ticketFolder.resolve(uniqueFileName);
            try{
                Files.write(filePath, file.getBytes());
            }catch (IOException ex){
                throw new FileException("Failed to store file " + originalFileName + ": " + ex.getMessage(), OperationType.CREATION);
            }

            File dbFile = new File();
            dbFile.setFilePath(filePath.toString());
            dbFile.setFileType(fileType);
            dbFile.setOriginalFileName(originalFileName);
            dbFile.setTicket(ticket);

            try{
                fileRepository.save(dbFile);
            }catch (Exception ex){
                throw new FileException("Failed to save file info in database: " + ex.getMessage(), OperationType.CREATION);
            }
        }
    }

    @Transactional
    public void saveMessageFiles(List<MultipartFile> files, Message message) {
        String ticketId = message.getTicket().getUuid();
        String chatFolderPath = "uploads/chats/" + ticketId;
        Path chatFolder = Paths.get(chatFolderPath);

        try {
            if (!Files.exists(chatFolder)) {
                Files.createDirectories(chatFolder);
            }
        } catch (IOException e) {
            throw new FileException("Failed to create directory for chat " + ticketId + ": " + e.getMessage(), OperationType.CREATION);
        }

        List<File> savedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFileName = file.getOriginalFilename();
            String fileType = file.getContentType();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = chatFolder.resolve(uniqueFileName);

            try {
                Files.write(filePath, file.getBytes());
            } catch (IOException ex) {
                throw new FileException("Failed to store file " + originalFileName + ": " + ex.getMessage(), OperationType.CREATION);
            }

            File dbFile = new File();
            dbFile.setFilePath(filePath.toString());
            dbFile.setFileType(fileType);
            dbFile.setOriginalFileName(originalFileName);
            dbFile.setMessage(message);
            savedFiles.add(dbFile);
        }

        try {
            fileRepository.saveAll(savedFiles);
            message.getAttachments().addAll(savedFiles);
        } catch (Exception ex) {
            throw new FileException("Failed to save file info in database: " + ex.getMessage(), OperationType.CREATION);
        }
    }
}
