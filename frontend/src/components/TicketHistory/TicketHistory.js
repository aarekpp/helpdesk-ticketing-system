import React from "react";
import styles from "./TicketHistory.module.scss";
import Loader from "components/Loader/Loader";
import { format } from "date-fns";

export default function TicketHistory({ activeTab, history, isLoading }) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "HH:mm:ss dd.MM.yyyy");
  };

  return (
    <div
      className={`${styles.historyContainer} ${
        activeTab === 2 ? styles.visible : ""
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        history &&
        history.map((entry, index) => (
          <div className={styles.entryContainer} key={index}>
            <p className={styles.entryNumber}>{index + 1}.</p>
            <div className={styles.entryText}>
              <p className={styles.date}>{formatDate(entry.createdAt)}</p>
              <p className={styles.text}>{entry.action}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
