import React, { useContext, useEffect, useState } from "react";
import styles from "./TicketModal.module.scss";
import { ReactComponent as CloseSVG } from "../../../../icons/close.svg";
import { format } from "date-fns";
import TicketService from "api/TicketService";
import { useNavigate } from "react-router-dom";
import NotificationContext from "context/NotificationContext";
import FileService from "api/FileService";

export default function TicketModal({ show, onClose, ticket }) {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [files, setFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    const martkTicketAsRead = async (id) => {
      await TicketService.markAsRead(id, addNotification);
    };

    const fetchFiles = async () => {
      const response = await TicketService.getFiles(ticket.id, addNotification);
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

    if (ticket != null && !ticket.isRead) {
      martkTicketAsRead(ticket.id);
    }

    if (ticket) {
      fetchFiles();
    }
  }, [ticket, addNotification]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  const handleClick = async () => {
    const response = await TicketService.assignTicket(
      ticket.id,
      addNotification,
    );
    if (!response || response.data.data.status === 2) {
      navigate("/employee/home", { replace: true });
    } else if (
      response &&
      response.status === 200 &&
      response.data.data.status === 1
    ) {
      navigate(`/employee/ticket/${ticket.id}`);
    }
  };

  const handlePreviewFile = async (fileId, event) => {
    event.stopPropagation();
    let existingUrl = fileUrls[fileId];
    if (!existingUrl) {
      const blobResponse = await FileService.getFileById(
        fileId,
        addNotification,
      );
      if (blobResponse && blobResponse.status === 200) {
        const blob = new Blob([blobResponse.data], {
          type: files.find((file) => file.id === fileId).fileType,
        });
        existingUrl = URL.createObjectURL(blob);
        setFileUrls((prev) => ({ ...prev, [fileId]: existingUrl }));
      } else {
        addNotification("Nie udało się otworzyć pliku.", "error");
        return;
      }
    }
    window.open(existingUrl, "_blank");
  };

  const imageFiles = files.filter((file) => file.fileType.startsWith("image/"));
  const otherFiles = files.filter(
    (file) => !file.fileType.startsWith("image/"),
  );

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [ticket, fileUrls]);

  return (
    <div
      className={`${styles.ticketModalContainer} ${show ? styles.show : ""}`}
    >
      <div className={styles.modalHeader}>
        <p>Szczegóły zgłoszenia</p>
        <div className={styles.iconBox}>
          <button className={styles.button} onClick={onClose}>
            <CloseSVG className={styles.icon} />
          </button>
        </div>
      </div>
      {ticket && (
        <div className={styles.modalContent}>
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
          <div className={styles.buttonsBox}>
            <button
              type="button"
              className={styles.button}
              onClick={handleClick}
              disabled={ticket.assignedTo != null}
            >
              Przyjmij zgłoszenie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
