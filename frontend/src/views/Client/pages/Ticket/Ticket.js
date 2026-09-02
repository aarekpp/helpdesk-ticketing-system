import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Ticket.module.scss";
import TicketPreview from "components/TicketPreview/TicketPreview";
import NotificationContext from "context/NotificationContext";
import TicketHistory from "components/TicketHistory/TicketHistory";
import TicketChat from "components/TicketChat/TicketChat";
import TicketService from "api/TicketService";
import { useWebSocketContext } from "context/WebSocketContext";

export default function Ticket() {
  const { id } = useParams();
  const { addNotification } = useContext(NotificationContext);
  const { subscribe, unsubscribe } = useWebSocketContext();
  const [activeTab, setActiveTab] = useState(1);
  const [history, setHistory] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const getTicketDetails = async () => {
      const response = await TicketService.getTicketDetails(
        id,
        addNotification,
      );
      if (response) {
        setHistory(response.data.data.history || []);
        setMessages(response.data.data.messages || []);
        setStatus(response.data.data.status);
      }
      setIsLoading(false);
    };

    getTicketDetails();
  }, [id, addNotification]);

  useEffect(() => {
    if (status !== "ASSIGNED" && activeTab === 3) {
      setActiveTab(2);
    }
  }, [status, activeTab]);

  const areMessagesEqual = (prevMessages, newMessages) => {
    if (prevMessages.length !== newMessages.length) return false;
    for (let i = 0; i < prevMessages.length; i++) {
      if (prevMessages[i].id !== newMessages[i].id) {
        return false;
      }
    }
    return true;
  };

  const handleUpdate = useCallback((data) => {
    if (data.history) {
      setHistory((prevHistory) => {
        if (JSON.stringify(prevHistory) !== JSON.stringify(data.history)) {
          return data.history;
        }
        return prevHistory;
      });
    }
    if (data.messages) {
      setMessages((prevMessages) => {
        if (!areMessagesEqual(prevMessages, data.messages)) {
          return data.messages;
        }
        return prevMessages;
      });
    }
    if (data.status) {
      setStatus(data.status);
    }
  }, []);

  useEffect(() => {
    const topic = `/topic/ticket/${id}`;
    let isSubscribed = false;

    if (!isSubscribed) {
      subscribe(topic, handleUpdate);
      isSubscribed = true;
    }

    return () => {
      if (isSubscribed) {
        unsubscribe(topic);
        isSubscribed = false;
      }
    };
  }, [id, subscribe, unsubscribe, handleUpdate]);

  return (
    <div className={styles.ticketContainer}>
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
          className={`${styles.tab} ${activeTab === 3 ? styles.selected : ""} ${
            status !== "ASSIGNED" ? styles.disabled : ""
          }`}
          onClick={() => setActiveTab(3)}
        >
          <p>Konwersacja</p>
        </div>
      </div>
      <div className={styles.content}>
        <TicketPreview id={id} activeTab={activeTab} />
        <TicketHistory
          activeTab={activeTab}
          history={history}
          isLoading={isLoading}
        />
        <TicketChat
          id={id}
          activeTab={activeTab}
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
