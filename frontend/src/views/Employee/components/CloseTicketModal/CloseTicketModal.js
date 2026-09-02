import React, { useState } from "react";
import styles from "./CloseTicketModal.module.scss";
import modalStyles from "../TicketForwardModal/TicketForwardModal.module.scss";

export default function CloseTicketModal({ onClick, onClose }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className={modalStyles.modalOverlay} onClick={onClose}>
      <div
        className={modalStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.title}>Zamknięcie zgłoszenia</p>
        <div className={styles.inputContainer}>
          <input
            type="checkbox"
            className={styles.inputCheckbox}
            value={isChecked}
            onClick={() => setIsChecked(!isChecked)}
          />
          <p className={styles.text}>Potwierdzam zamknięcie tego zgłoszenia</p>
        </div>
        <div className={modalStyles.buttonContainer}>
          <button className={modalStyles.cancelButton} onClick={onClose}>
            Anuluj
          </button>
          <button
            className={modalStyles.forwardButton}
            disabled={!isChecked}
            onClick={onClick}
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
