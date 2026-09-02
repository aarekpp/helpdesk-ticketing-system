import React from "react";
import styles from "./ConfirmDeletePopup.module.scss";

export default function ConfirmDeletePopup({
  isOpen,
  onClose,
  onDelete,
  itemLabel,
  itemType,
}) {
  if (!isOpen) return null;

  const getDeleteMessage = (type) => {
    switch (type) {
      case "company":
        return "Potwierdź usunięcie firmy:";
      case "admin":
        return "Potwierdź usunięcie konta administratora:";
      case "employee":
        return "Potwierdź usunięcie konta pracownika:";
      case "client":
        return "Potwierdź usunięcie konta klienta:";
      case "service":
        return "Potwierdź usunięcie usługi:";
      case "manager":
        return "Potwierdź usunięcie manager:";
      default:
        return "Potwierdź usunięcie:";
    }
  };

  const deleteMessage = getDeleteMessage(itemType);

  return (
    <div className={styles.confirmDeleteOverlay}>
      <div className={styles.confirmDeleteContainer}>
        <p className={styles.messageHeader}>{deleteMessage}</p>
        <p className={styles.messageValue}>{itemLabel}</p>
        <div className={styles.confirmDeleteButtons}>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={onDelete}
          >
            Usuń
          </button>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
