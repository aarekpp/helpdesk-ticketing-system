import NotificationContext from "context/NotificationContext";
import React, { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./FileUpload.module.scss";

export default function FileUpload({ onFilesChange }) {
  const { addNotification } = useContext(NotificationContext);
  const [validFiles, setValidFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const maxFileSize = 100 * 1024 * 1024;
  const forbiddenChars = /[*|":<>[\]{}`\\()';@&$]/;
  const forbiddenExtensions = [".exe", ".bat", ".sh"];

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter += 1;
      if (dragCounter === 1) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounter -= 1;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleWindowDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      dragCounter = 0;
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  const validateFile = (file) => {
    let errorMessage = "";

    if (file.size > maxFileSize) {
      errorMessage = `Plik ${file.name} jest za duży. Limit to 100MB.`;
    }
    if (forbiddenChars.test(file.name)) {
      errorMessage = `Plik ${file.name} zawiera niedozwolone znaki w nazwie.`;
    }
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    if (forbiddenExtensions.includes(fileExtension)) {
      errorMessage = `Plik ${file.name} ma niedozwolone rozszerzenie (${fileExtension}).`;
    }

    if (errorMessage.length > 0) {
      addNotification(`Error: ${errorMessage}`, "error");
      return false;
    }

    return true;
  };

  const isDuplicateFile = (file) => {
    return validFiles.some(
      (existingFile) =>
        existingFile.name === file.name &&
        existingFile.size === file.size &&
        existingFile.type === file.type,
    );
  };

  const onDrop = (acceptedFiles) => {
    const newValidFiles = [];

    acceptedFiles.forEach((file) => {
      const isValid = validateFile(file);
      const isDuplicate = isDuplicateFile(file);

      if (isValid && !isDuplicate) {
        newValidFiles.push(file);
      } else if (isDuplicate) {
        addNotification(`Plik ${file.name} został już dodany.`, "error");
      }
    });

    if (newValidFiles.length > 0) {
      setValidFiles((prevFiles) => [...prevFiles, ...newValidFiles]);
      onFilesChange([...validFiles, ...newValidFiles]);
    }

    setIsDragging(false);
  };

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = validFiles.filter((_, index) => index !== fileIndex);
    setValidFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handlePreviewFile = (file, event) => {
    event.stopPropagation();

    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const nonMediaFiles = validFiles.filter(
    (file) =>
      !file.type.startsWith("image/") && !file.type.startsWith("video/"),
  );
  const mediaFiles = validFiles.filter(
    (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
  );

  return (
    <div className={styles.fileUploadContainer}>
      {isDragging && <div className={styles.overlay} />}
      <div className={styles.dropZone} {...getRootProps()}>
        <input {...getInputProps()} />
        <p className={styles.dopZoneText}>
          Kliknij lub przeciągnij pliki tutaj
        </p>

        {nonMediaFiles.length > 0 && (
          <div className={styles.fileList}>
            <ul>
              {nonMediaFiles.map((file, index) => (
                <li
                  key={index}
                  className={styles.fileItem}
                  onClick={(e) => handlePreviewFile(file, e)}
                >
                  <p className={styles.fileName}>{file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className={styles.removeButton}
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mediaFiles.length > 0 && (
          <div className={styles.galleryContainer}>
            {mediaFiles.map((file, index) => (
              <div
                key={index}
                className={styles.previewItem}
                onClick={(e) => handlePreviewFile(file, e)}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className={styles.thumbnail}
                    onDragStart={handleDragStart}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className={styles.thumbnail}
                    controls
                    onDragStart={handleDragStart}
                  />
                )}
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(validFiles.indexOf(file));
                  }}
                  className={styles.removeButtonOnPreview}
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
