import React, { useContext, useEffect, useState } from "react";
import NotificationContext from "context/NotificationContext";
import TicketService from "api/TicketService";
import styles from "./TicketsBoard.module.scss";
import CurrentTickets from "./CurrentTickets";
import AcceptedTickets from "./AcceptedTickets";
import { useWebSocketContext } from "context/WebSocketContext";
import { useSelector } from "react-redux";
import TicketModal from "../TicketModal/TicketModal";

export default function TicketsBoard() {
  const { addNotification } = useContext(NotificationContext);
  const { userId } = useSelector((state) => state.auth);
  const { subscribe, unsubscribe } = useWebSocketContext();
  const [currentTickets, setCurrentTickets] = useState([]);
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [highlightedTickets, setHighlightedTickets] = useState(new Set());
  const [flashingTickets, setFlashingTickets] = useState(new Set());
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [ticketToShow, setTicketToShow] = useState(null);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const getAllTickets = async () => {
      const response =
        await TicketService.getAllTicketsByEmployee(addNotification);
      if (response && response.status === 200) {
        const transformedTickets = response.data.data.allTickets
          .map((ticket) => {
            const isRead = ticket.readBy.includes(userId);
            return {
              ...ticket,
              isRead,
              readBy: undefined,
            };
          })
          .sort((a, b) => {
            if (a.assignedTo !== b.assignedTo) {
              return a.assignedTo ? 1 : -1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

        setCurrentTickets(transformedTickets);

        const transformedAcceptedTickets = response.data.data.assignedTickets
          .map((ticket) => {
            const isRead = ticket.readBy.includes(userId);
            return {
              ...ticket,
              isRead,
              readBy: undefined,
            };
          })
          .sort((a, b) => {
            if (a.status !== b.status) {
              return a.status === "Przekazany" ? -1 : 1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

        setAcceptedTickets(transformedAcceptedTickets);

        if (isInitialRender) {
          setActiveTab(
            transformedAcceptedTickets.length > 0 ? "accepted" : "current",
          );
          setIsInitialRender(false);
        }

        const unreadTicketsCount = transformedTickets.filter(
          (ticket) => !ticket.isRead,
        ).length;
        setUnreadCount(unreadTicketsCount);
      }
    };

    getAllTickets();

    subscribe("/topic/tickets", (updatedTicket) => {
      const isRead = updatedTicket.readBy.includes(userId);
      const ticketWithReadStatus = {
        ...updatedTicket,
        isRead,
        readBy: undefined,
      };

      if (ticketToShow && ticketToShow.id === updatedTicket.id) {
        setTicketToShow(ticketWithReadStatus);
      }

      switch (updatedTicket.status) {
        case "Nowy":
          setCurrentTickets((prevTickets) => {
            const isNewTicket = !prevTickets.some(
              (ticket) => ticket.id === updatedTicket.id,
            );
            if (isNewTicket) {
              setHighlightedTickets((prev) =>
                new Set(prev).add(ticketWithReadStatus.id),
              );
              setFlashingTickets((prev) =>
                new Set(prev).add(ticketWithReadStatus.id),
              );

              setTimeout(() => {
                setHighlightedTickets((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(ticketWithReadStatus.id);
                  return newSet;
                });
                setFlashingTickets((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(ticketWithReadStatus.id);
                  return newSet;
                });
              }, 5000);

              return [ticketWithReadStatus, ...prevTickets].sort((a, b) => {
                if (a.assignedTo !== b.assignedTo) {
                  return a.assignedTo ? 1 : -1;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            } else {
              return prevTickets.map((ticket) =>
                ticket.id === updatedTicket.id ? ticketWithReadStatus : ticket,
              );
            }
          });
          break;

        case "Przyjęty":
          setAcceptedTickets((prevTickets) => {
            const isNewTicket = !prevTickets.some(
              (ticket) => ticket.id === updatedTicket.id,
            );

            const updatedTickets = isNewTicket
              ? [ticketWithReadStatus, ...prevTickets]
              : prevTickets.map((ticket) =>
                  ticket.id === updatedTicket.id
                    ? ticketWithReadStatus
                    : ticket,
                );

            return updatedTickets.sort((a, b) => {
              if (a.status !== b.status) {
                return a.status === "Przyjęty" ? -1 : 1;
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          });

          setCurrentTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id),
          );
          break;

        case "Przekazany":
          setAcceptedTickets((prevTickets) => {
            const isNewTicket = !prevTickets.some(
              (ticket) => ticket.id === updatedTicket.id,
            );

            const updatedTickets = isNewTicket
              ? [ticketWithReadStatus, ...prevTickets]
              : prevTickets.map((ticket) =>
                  ticket.id === updatedTicket.id
                    ? ticketWithReadStatus
                    : ticket,
                );

            return updatedTickets.sort((a, b) => {
              if (a.status !== b.status) {
                return a.status === "Przekazany" ? -1 : 1;
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
          });

          setCurrentTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id),
          );
          break;

        case "Rozwiązany":
          setAcceptedTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id),
          );
          setCurrentTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.id !== updatedTicket.id),
          );
          break;

        default:
          console.warn(`Nieobsługiwany status: ${updatedTicket.status}`);
      }
    });

    return () => {
      unsubscribe("/topic/tickets");
    };
  }, [
    subscribe,
    unsubscribe,
    addNotification,
    userId,
    isInitialRender,
    ticketToShow,
  ]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleShowModal = (ticket) => {
    setTicketToShow(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTicketToShow(null);
  };

  return (
    <div className={styles.ticketsBoard}>
      <TicketModal
        show={showModal}
        onClose={handleCloseModal}
        ticket={ticketToShow}
      />
      <div className={styles.boardHeader}>
        <div
          className={`${styles.headerButton} ${
            activeTab === "current" ? styles.selected : ""
          }`}
          onClick={() => setActiveTab("current")}
        >
          <p className={styles.buttonText}>
            Obecne zgłoszenia
            {unreadCount > 0 && (
              <span
                className={`${styles.unreadBadge} ${
                  activeTab === "current" ? styles.active : styles.inactive
                }`}
              >
                {unreadCount <= 9 ? unreadCount : "9+"}
              </span>
            )}
          </p>
        </div>
        <div
          className={`${styles.headerButton} ${
            acceptedTickets.length === 0 ? styles.disabled : ""
          } ${activeTab === "accepted" ? styles.selected : ""}`}
          onClick={() => acceptedTickets.length > 0 && setActiveTab("accepted")}
        >
          <p className={styles.buttonText}>Przyjęte zgłoszenia</p>
        </div>
      </div>
      <div className={styles.ticketsContainer}>
        {activeTab === "current" && (
          <CurrentTickets
            tickets={currentTickets}
            highlightedTickets={highlightedTickets}
            flashingTickets={flashingTickets}
            showModal={handleShowModal}
          />
        )}
        {activeTab === "accepted" && (
          <AcceptedTickets tickets={acceptedTickets} />
        )}
      </div>
    </div>
  );
}
