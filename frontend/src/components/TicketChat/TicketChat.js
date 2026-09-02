import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./TicketChat.module.scss";
import { useSelector } from "react-redux";
import {
  faPaperclip,
  faPaperPlane,
  faFile,
  faX,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationContext from "context/NotificationContext";
import { useDropzone } from "react-dropzone";
import MessageService from "api/MessageService";
import { format } from "date-fns";
import FileService from "api/FileService";

export default function TicketChat({ id, activeTab, messages, isLoading }) {
  const { addNotification } = useContext(NotificationContext);
  const { userId } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [validFiles, setValidFiles] = useState([]);
  const [messageQueue, setMessageQueue] = useState([]);
  const textAreaRef = useRef(null);
  const uploadedFilesRef = useRef(null);
  const messagesEndRef = useRef(null);

  const maxFileSize = 100 * 1024 * 1024;
  const forbiddenChars = /[*|":<>[\]{}`\\()';@&$]/;
  const forbiddenExtensions = [".exe", ".bat", ".sh"];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (activeTab === 3 && messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [activeTab, messages]);

  useEffect(() => {
    if (!Array.isArray(messageQueue) || messageQueue.length === 0) return;

    const processQueue = async () => {
      const [currentMessage, ...remainingQueue] = messageQueue;

      if (currentMessage.status === "pending") {
        try {
          const formData = new FormData();
          formData.append("message", currentMessage.text);
          currentMessage.files.forEach((file) =>
            formData.append("files", file),
          );

          await MessageService.sendMessage(id, formData, addNotification);

          setMessageQueue((prevQueue) =>
            prevQueue.map((msg) =>
              msg.id === currentMessage.id ? { ...msg, status: "sent" } : msg,
            ),
          );
        } catch (error) {
          setMessageQueue((prevQueue) =>
            prevQueue.map((msg) =>
              msg.id === currentMessage.id ? { ...msg, status: "error" } : msg,
            ),
          );
        }
      }

      setMessageQueue(remainingQueue);
    };

    processQueue();
  }, [messageQueue, id, addNotification]);

  useEffect(() => {
    const filesElement = uploadedFilesRef.current;
    if (!filesElement) return;

    const handleWheelScroll = (event) => {
      const scrollStep = 5.5 * 16;
      event.preventDefault();
      filesElement.scrollLeft += event.deltaY > 0 ? scrollStep : -scrollStep;
    };

    filesElement.addEventListener("wheel", handleWheelScroll);

    return () => {
      filesElement.removeEventListener("wheel", handleWheelScroll);
    };
  }, [validFiles.length]);

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
    }

    setIsDragging(false);
  };

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = validFiles.filter((_, index) => index !== fileIndex);
    setValidFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
  });

  const handleInputChange = (event) => {
    setMessage(event.target.value);
    autoResizeTextArea();
  };

  const autoResizeTextArea = () => {
    if (textAreaRef.current) {
      const minHeight = 16 * 1.2;
      textAreaRef.current.style.height = `${minHeight}px`;
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        5 * 16 * 1.2,
      )}px`;
    }
  };

  const handleSendButtonClick = () => {
    const newMessage = {
      id: Date.now(),
      text: message,
      files: [...validFiles],
      status: "pending",
    };

    setMessageQueue((prevQueue) => [...prevQueue, newMessage]);
    setMessage("");
    setValidFiles([]);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "HH:mm");
  };

  const handleDownloadFile = async (id, fileName) => {
    const blob = await FileService.downloadMessageFile(id, addNotification);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`${styles.chatContainer} ${
        activeTab === 3 ? styles.visible : ""
      }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragging && (
        <div className={styles.dragOverlay}>
          <p>Upuść pliki tutaj</p>
        </div>
      )}
      <div className={styles.messagesContainer}>
        {!messages || messages.length === 0 ? (
          <p className={styles.noMessages}>Brak wiadomości</p>
        ) : (
          messages.map((msg, index) => {
            const hasText = msg?.content && msg.content.trim() !== "";
            const hasFiles = msg?.attachments && msg.attachments.length > 0;

            const isDifferentAuthor =
              index === 0 || messages[index - 1]?.author?.id !== msg.author?.id;
            const isCurrentUser = msg.author.id === userId;

            return (
              <React.Fragment key={msg.id}>
                {isDifferentAuthor && !isCurrentUser && (
                  <div className={styles.authorHeader}>
                    <p>
                      {msg.author.firstName} {msg.author.lastName} - @
                      {msg.author.username}
                    </p>
                  </div>
                )}
                {hasFiles && !hasText ? (
                  <div
                    className={`${styles.fileOnlyMessage} ${
                      isCurrentUser ? styles.authorMessage : styles.otherMessage
                    }`}
                  >
                    <div className={styles.container}>
                      {msg.attachments.map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className={styles.fileContainer}
                          onClick={() =>
                            handleDownloadFile(file.id, file.originalFileName)
                          }
                        >
                          <div className={styles.iconBox}>
                            <FontAwesomeIcon
                              icon={faDownload}
                              className={styles.icon}
                            />
                          </div>
                          <p className={styles.fileName}>
                            {file.originalFileName}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className={styles.hourContainer}>
                      <p>{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.message} ${
                      isCurrentUser ? styles.authorMessage : styles.otherMessage
                    }`}
                  >
                    <div className={styles.container}>
                      {hasText && (
                        <p
                          className={`${styles.messageText} ${
                            hasFiles ? styles.withFiles : ""
                          }`}
                        >
                          {msg?.content}
                        </p>
                      )}
                      {hasFiles &&
                        msg.attachments.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className={styles.fileContainer}
                            onClick={() =>
                              handleDownloadFile(file.id, file.originalFileName)
                            }
                          >
                            <div className={styles.iconBox}>
                              <FontAwesomeIcon
                                icon={faDownload}
                                className={styles.icon}
                              />
                            </div>
                            <p className={styles.fileName}>
                              {file.originalFileName}
                            </p>
                          </div>
                        ))}
                    </div>
                    <div className={styles.hourContainer}>
                      <p>{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
        {messageQueue.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.status === "pending"
                ? styles.sending
                : msg.status === "error"
                  ? styles.error
                  : styles.sent
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {validFiles.length > 0 && (
        <div className={styles.uploadedFiles} ref={uploadedFilesRef}>
          {validFiles.map((file, index) => {
            const fileExtension = file.name.slice(
              file.name.lastIndexOf(".") + 1,
            );
            const fileName = file.name.slice(0, file.name.lastIndexOf("."));
            return (
              <div className={styles.file} key={index}>
                <div className={styles.closeButtonContainer}>
                  <button
                    className={styles.closeButton}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <FontAwesomeIcon icon={faX} className={styles.icon} />
                  </button>
                </div>
                <div className={styles.iconBox}>
                  <FontAwesomeIcon icon={faFile} className={styles.icon} />
                  <span className={styles.fileExtension}>
                    {fileExtension.toUpperCase()}
                  </span>
                </div>
                <p className={styles.fileName}>{fileName}</p>
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.inputContainer}>
        <textarea
          ref={textAreaRef}
          className={styles.messageInput}
          placeholder="Nowa wiadomość"
          value={message}
          onChange={handleInputChange}
          rows={1}
        />
        <div className={styles.buttonsBox}>
          <button type="button" className={styles.button} onClick={open}>
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={handleSendButtonClick}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}
