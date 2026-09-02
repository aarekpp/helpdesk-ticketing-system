package com.example.backend.dto;

import com.example.backend.model.File;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileResponseDTO {
    private Long id;
    private String originalFileName;
    private String fileType;
    private String url;

    public static FileResponseDTO fromEntity(File file, String baseUrl) {
        return new FileResponseDTO(
                file.getId(),
                file.getOriginalFileName(),
                file.getFileType(),
                baseUrl + "/api/tickets/files/" + file.getTicket().getUuid() + "/" + file.getId()
        );
    }

    public static FileResponseDTO fromEntityForMessage(File file, String baseUrl) {
        if (file.getMessage() == null) {
            throw new IllegalArgumentException("File is not associated with any message.");
        }

        return new FileResponseDTO(
                file.getId(),
                file.getOriginalFileName(),
                file.getFileType(),
                baseUrl + "/api/files/message/" + file.getId()
        );
    }
}
