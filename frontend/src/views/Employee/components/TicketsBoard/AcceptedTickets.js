import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketsBoard.module.scss";
import { format } from "date-fns";

export default function AcceptedTickets({ tickets }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  const handleClick = (id) => {
    navigate(`/employee/ticket/${id}`);
  };

  return (
    <div className={styles.ticketList}>
      {tickets.map((ticket) => {
        const isBlinking = ticket.status === "Przekazany";
        return (
          <div
            key={ticket.id}
            className={`${styles.ticket} ${
              ticket.isRead ? styles.readed : ""
            } ${isBlinking ? styles.ticketFlasInf : ""}`}
          >
            <div className={styles.ticketHeader}>
              <p>{ticket.title}</p>
            </div>
            <div className={styles.ticketContent}>
              <p>Status: {ticket.status}</p>
              <p>
                Usługa:{" "}
                {ticket.service
                  ? `${ticket.service.name}`
                  : "Brak przypisanej usługi"}
              </p>
              <p>
                Zgłaszający:{" "}
                {`${ticket.client.firstName} ${ticket.client.lastName}`}
              </p>
              <p>Firma: {ticket.company.name}</p>
              <p>Data zgłoszenia: {formatDate(ticket.createdAt)}</p>
              <p>Ostatnia aktualizacja: {formatDate(ticket.updatedAt)}</p>
            </div>
            <div className={styles.buttonBox}>
              <button
                type="button"
                className={styles.button}
                onClick={() => handleClick(ticket.id)}
              >
                Zarządzaj
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
