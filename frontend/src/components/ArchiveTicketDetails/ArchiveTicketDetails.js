import TicketService from "api/TicketService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ArchiveTicketDetails.module.scss";
import { format } from "date-fns";
import FileService from "api/FileService";
import { useSelector } from "react-redux";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ArchiveTicketDetails() {
  const { id } = useParams();
  const { userId } = useSelector((state) => state.auth);
  const { addNotification } = useContext(NotificationContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});

  const getTicketFiles = async () => {
    const response = await TicketService.getFiles(id, addNotification);
    if (response.status === 200) {
      setFiles(response.data.data);

      const imageFiles = response.data.data.filter((file) =>
        file.fileType.startsWith("image/"),
      );
      const fileUrlsTemp = {};

      for (const file of imageFiles) {
        const blobResponse = await FileService.getFileById(
          file.id,
          addNotification,
        );
        if (blobResponse.status === 200) {
          const blob = new Blob([blobResponse.data], { type: file.fileType });
          fileUrlsTemp[file.id] = URL.createObjectURL(blob);
        }
      }
      setFileUrls(fileUrlsTemp);
    }
  };

  useEffect(() => {
    const getArchiveData = async () => {
      const response = await TicketService.getTicketArchive(
        id,
        addNotification,
      );
      if (response) {
        setTicket(response.data.data);
        getTicketFiles();
      }
      setIsDataLoaded(true);
    };
    getArchiveData();
  }, [id, addNotification]);

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  if (!isDataLoaded) return <Loader />;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  const formatHour = (dateString) => {
    return format(new Date(dateString), "HH:mm");
  };

  const handlePreviewFile = async (fileId, event) => {
    event.stopPropagation();

    if (fileUrls[fileId]) {
      URL.revokeObjectURL(fileUrls[fileId]);
    }

    const blobResponse = await FileService.getFileById(fileId, addNotification);
    if (blobResponse && blobResponse.status === 200) {
      const blob = new Blob([blobResponse.data], {
        type: files.find((file) => file.id === fileId).fileType,
      });
      const newUrl = URL.createObjectURL(blob);

      setFileUrls((prev) => ({ ...prev, [fileId]: newUrl }));

      window.open(newUrl, "_blank");
    } else {
      addNotification("Nie udało się otworzyć pliku.", "error");
    }
  };

  const imageFiles = files.filter((file) => file.fileType.startsWith("image/"));
  const otherFiles = files.filter(
    (file) => !file.fileType.startsWith("image/"),
  );

  console.log(ticket);

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
    <div className={styles.archiveContainer}>
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${activeTab === 1 ? styles.selected : ""}`}
          onClick={() => setActiveTab(1)}
        >
          <p>Szczegóły</p>
        </div>
        <div
          className={`${styles.tab} ${activeTab === 2 ? styles.selected : ""}`}
          onClick={() => setActiveTab(2)}
        >
          <p>Historia</p>
        </div>
        <div
          className={`${styles.tab} ${activeTab === 3 ? styles.selected : ""}`}
          onClick={() => setActiveTab(3)}
        >
          <p>Konwersacja</p>
        </div>
      </div>
      <div className={styles.content}>
        <div
          className={`${styles.ticketPreviewContainer} ${
            activeTab === 1 ? styles.visible : ""
          }`}
        >
          {ticket && (
            <div className={styles.contentBox}>
              <div className={styles.ticketContent}>
                <p className={styles.title}>{ticket.title}</p>
                <div className={styles.ticketData}>
                  Zgłoszenie wykonano{" "}
                  <span className={styles.boldText}>
                    {formatDate(ticket.createdAt)}
                  </span>{" "}
                  przez{" "}
                  <span className={styles.boldText}>
                    {ticket.client.firstName} {ticket.client.lastName}
                  </span>{" "}
                  w firmie{" "}
                  <span className={styles.boldText}>{ticket.company.name}</span>{" "}
                  dla usługi{" "}
                  <span className={styles.boldText}>
                    {ticket.service?.name || "Brak przypisanej usługi"}
                  </span>
                </div>
                <div
                  className={styles.ticketDescription}
                  dangerouslySetInnerHTML={{ __html: ticket.description }}
                ></div>
              </div>
              <div className={styles.filesSection}>
                {files.length === 0 ? (
                  <p className={styles.noFilesInfo}>Brak przesłanych plików</p>
                ) : (
                  <>
                    {otherFiles.length > 0 && (
                      <div className={styles.fileList}>
                        <h3 className={styles.sectionTitle}>Pozostałe pliki</h3>
                        <ul>
                          {otherFiles.map((file, index) => (
                            <li
                              key={index}
                              className={styles.fileItem}
                              onClick={(e) => handlePreviewFile(file.id, e)}
                            >
                              <p className={styles.fileName}>
                                {file.originalFileName}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {imageFiles.length > 0 && (
                      <div className={styles.galleryContainer}>
                        <h3 className={styles.sectionTitle}>Zdjęcia</h3>
                        {imageFiles.map((file, index) => (
                          <div
                            key={index}
                            className={styles.previewItem}
                            onClick={(e) => handlePreviewFile(file.id, e)}
                          >
                            <img
                              src={fileUrls[file.id]}
                              alt={file.originalFileName}
                              className={styles.thumbnail}
                              onDragStart={(e) => e.preventDefault()}
                            />
                            <div className={styles.fileInfo}>
                              <p className={styles.fileName}>
                                {file.originalFileName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className={`${styles.historyContainer} ${
            activeTab === 2 ? styles.visible : ""
          }`}
        >
          {ticket.history &&
            ticket.history.map((entry, index) => (
              <div className={styles.entryContainer} key={index}>
                <p className={styles.entryNumber}>{index + 1}.</p>
                <div className={styles.entryText}>
                  <p className={styles.date}>{formatDate(entry.createdAt)}</p>
                  <p className={styles.text}>{entry.action}</p>
                </div>
              </div>
            ))}
        </div>
        <div
          className={`${styles.messagesContainer} ${
            activeTab === 3 ? styles.visible : ""
          }`}
        >
          {!ticket.messages || ticket.messages.length === 0 ? (
            <p className={styles.noMessages}>Brak wiadomości</p>
          ) : (
            ticket.messages.map((msg, index) => {
              const hasText = msg?.content && msg.content.trim() !== "";
              const hasFiles = msg?.attachments && msg.attachments.length > 0;

              const isDifferentAuthor =
                index === 0 ||
                ticket.messages[index - 1]?.author?.id !== msg.author?.id;
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
                        isCurrentUser
                          ? styles.authorMessage
                          : styles.otherMessage
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
                        <p>{formatHour(msg.createdAt)}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${styles.message} ${
                        isCurrentUser
                          ? styles.authorMessage
                          : styles.otherMessage
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
                                handleDownloadFile(
                                  file.id,
                                  file.originalFileName,
                                )
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
                        <p>{formatHour(msg.createdAt)}</p>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
