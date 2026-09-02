import TicketService from "api/TicketService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import React, { useContext, useEffect, useState } from "react";
import styles from "./TicketPreview.module.scss";
import FileService from "api/FileService";
import { format } from "date-fns";

export default function TicketPreview({ id, activeTab }) {
  const { addNotification } = useContext(NotificationContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
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

    const getTicketData = async () => {
      const response = await TicketService.getTicketDetailsById(
        id,
        addNotification,
      );
      if (response && response.status === 200) {
        setTicket(response.data.data);
        getTicketFiles();
      }
      setIsDataLoaded(true);
    };

    getTicketData();
  }, [id, addNotification]);

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  if (!isDataLoaded)
    return (
      <div className={styles.ticketPreviewContainer}>
        <Loader />
      </div>
    );

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
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

  return (
    <div
      className={`${styles.ticketPreviewContainer} ${
        activeTab === 1 ? styles.visible : ""
      }`}
    >
      {ticket && (
        <div className={styles.content}>
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
              <span className={styles.boldText}>{ticket.company.name}</span> dla
              usługi{" "}
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
  );
}
