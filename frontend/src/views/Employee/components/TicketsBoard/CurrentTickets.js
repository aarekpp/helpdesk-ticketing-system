import React from "react";
import styles from "./TicketsBoard.module.scss";
import { format } from "date-fns";

export default function CurrentTickets({
  tickets,
  highlightedTickets,
  flashingTickets,
  showModal,
}) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  if (tickets.length === 0)
    return (
      <div style={{ padding: "1rem 0" }} className={styles.ticketList}>
        <p style={{ textAlign: "center" }}>Brak nowych zgłoszeń</p>
      </div>
    );

  return (
    <div className={styles.ticketList}>
      {tickets.map((ticket) => {
        const isHighlighted = highlightedTickets.has(ticket.id);
        const isFlashing = flashingTickets.has(ticket.id);

        return (
          <div
            key={ticket.id}
            className={`${styles.ticket} ${ticket.isRead ? styles.readed : ""} 
              ${isHighlighted ? styles.ticketHighlight : ""} 
              ${isFlashing ? styles.ticketFlash : ""} 
              ${!isHighlighted && isFlashing ? styles.ticketUpdateFlash : ""}`}
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
              <p>
                Przyjęte przez:{" "}
                {ticket.assignedTo
                  ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                  : "Nieprzyjęte"}
              </p>
              <p>Data zgłoszenia: {formatDate(ticket.createdAt)}</p>
              <p>Ostatnia aktualizacja: {formatDate(ticket.updatedAt)}</p>
            </div>
            <div className={styles.buttonBox}>
              <button
                type="button"
                className={styles.button}
                onClick={() => showModal(ticket)}
              >
                Szczegóły
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
