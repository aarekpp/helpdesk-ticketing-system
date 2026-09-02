package com.example.backend.dto.Message;

import com.example.backend.dto.FileResponseDTO;
import com.example.backend.dto.user.BasicUserResponseDTO;
import com.example.backend.model.Message;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class MessageResponseDTO {
    private Long id;
    private String content;
    private BasicUserResponseDTO author;
    private LocalDateTime createdAt;
    private Boolean readByRecipient;
    private List<FileResponseDTO> attachments;

    private static String serverAddress;
    private static String serverPort;

    @Value("${server.address}")
    private String injectedServerAddress;

    @Value("${server.port}")
    private String injectedServerPort;

    @PostConstruct
    private void init() {
        serverAddress = injectedServerAddress;
        serverPort = injectedServerPort;
    }

    private static String getUrl() {
        return "https://" + serverAddress + ":" + serverPort;
    }

    public static MessageResponseDTO fromEntity(Message message){
        String baseUrl = getUrl();
        MessageResponseDTO responseDTO = new MessageResponseDTO();
        responseDTO.setId(message.getId());
        responseDTO.setContent(message.getContent());
        responseDTO.setAuthor(BasicUserResponseDTO.fromEntity(message.getAuthor()));
        responseDTO.setCreatedAt(message.getTimestamp());
        responseDTO.setReadByRecipient(message.getReadByRecipient());
        responseDTO.setAttachments(message.getAttachments().stream().map(msg -> FileResponseDTO.fromEntityForMessage(msg, baseUrl)).toList());

        return responseDTO;
    }
}
