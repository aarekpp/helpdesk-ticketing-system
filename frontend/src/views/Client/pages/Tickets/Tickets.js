import React, { useContext, useEffect, useState } from "react";
import styles from "./Tickets.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { ReactComponent as AddSVG } from "../../../../icons/add.svg";
import Loader from "components/Loader/Loader";
import TicketService from "api/TicketService";
import NotificationContext from "context/NotificationContext";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { useWebSocketContext } from "context/WebSocketContext";

export default function Tickets() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const { userId } = useSelector((state) => state.auth);
  const [activeTickets, setActiveTickets] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { subscribe, unsubscribe } = useWebSocketContext();

  useEffect(() => {
    const getActiveTickets = async () => {
      const response =
        await TicketService.getAllActiveTicketsByClient(addNotification);
      if (response && response.status === 200) {
        setActiveTickets(response.data.data);
      }
      setIsDataLoaded(true);
    };

    getActiveTickets();

    const topic = `/topic/client/${userId}/tickets`;

    const handleTicketUpdate = (updatedTicket) => {
      setActiveTickets((prevTickets) => {
        if (updatedTicket.status === "Rozwiązany") {
          return prevTickets.filter((ticket) => ticket.id !== updatedTicket.id);
        }

        const ticketIndex = prevTickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id,
        );

        if (ticketIndex !== -1) {
          const updatedTickets = [...prevTickets];
          updatedTickets[ticketIndex] = updatedTicket;
          return updatedTickets;
        } else {
          return [updatedTicket, ...prevTickets];
        }
      });
    };

    subscribe(topic, handleTicketUpdate);

    return () => {
      unsubscribe(topic);
    };
  }, [addNotification, subscribe, unsubscribe, userId]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  if (!isDataLoaded) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.buttonBox}>
        <NavLink to="/client/add-ticket" className={styles.linkButton}>
          <div className={styles.iconBox}>
            <AddSVG className={styles.icon} />
          </div>
          <p className={styles.buttonText}>Dodaj zgłoszenie</p>
        </NavLink>
      </div>
      <div className={styles.activeTickets}>
        {activeTickets.length === 0 ? (
          <p>Brak aktywnych zgłoszeń</p>
        ) : (
          activeTickets.map((ticket, index) => (
            <div key={index} className={styles.ticket}>
              <div className={styles.ticketHeader}>
                <p>{ticket.title}</p>
              </div>
              <div className={styles.ticketContent}>
                <p>Status: {ticket.status}</p>
                <p>
                  Usługa:{" "}
                  {ticket.service ? `${ticket.service.name}` : "Brak usługi"}
                </p>
                <p>
                  Przyjęte przez:{" "}
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                    : "Brak"}
                </p>
                <p>Data zgłoszenia: {formatDate(ticket.createdAt)}</p>
                <p>Ostatnia aktualizacja: {formatDate(ticket.updatedAt)}</p>
              </div>
              <div className={styles.buttonBox}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => navigate(`/client/ticket/${ticket.id}`)}
                >
                  Szczegóły
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
