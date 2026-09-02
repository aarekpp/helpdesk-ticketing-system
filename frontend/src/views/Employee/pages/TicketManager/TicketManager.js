import React, { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./TicketManager.module.scss"
import TicketPreview from "components/TicketPreview/TicketPreview"
import TicketChat from "components/TicketChat/TicketChat"
import TicketForwardModal from "views/Employee/components/TicketForwardModal/TicketForwardModal"
import TicketService from "api/TicketService"
import NotificationContext from "context/NotificationContext"
import CloseTicketModal from "views/Employee/components/CloseTicketModal/CloseTicketModal"
import TicketHistory from "components/TicketHistory/TicketHistory"
import { useWebSocketContext } from "context/WebSocketContext"

export default function TicketManager() {
  const { id } = useParams()
  const { addNotification } = useContext(NotificationContext)
  const { subscribe, unsubscribe } = useWebSocketContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false)
  const [history, setHistory] = useState(null)
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getTicketDetails = async () => {
      const response = await TicketService.getTicketDetails(id, addNotification)
      if (response) {
        setHistory(response.data.data.history || [])
        setMessages(response.data.data.messages || [])
      }
      setIsLoading(false)
    }

    getTicketDetails()
  }, [id, addNotification])

  const handleUpdate = useCallback((data) => {
    if (data.history) {
      setHistory((prevHistory) => {
        if (JSON.stringify(prevHistory) !== JSON.stringify(data.history)) {
          return data.history
        }
        return prevHistory
      })
    }
    if (data.messages) {
      setMessages((prevMessages) => {
        if (JSON.stringify(prevMessages) !== JSON.stringify(data.messages)) {
          return data.messages
        }
        return prevMessages
      })
    }
  }, [])

  useEffect(() => {
    const topic = `/topic/ticket/${id}`
    subscribe(topic, handleUpdate)

    return () => {
      unsubscribe(topic)
    }
  }, [id, subscribe, unsubscribe, handleUpdate])

  const handlePassButtonClick = () => {
    setShowModal(true)
  }

  const handleCloseButtonClick = () => {
    setShowCloseTicketModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseTicketModal = () => {
    setShowCloseTicketModal(false)
  }

  const handleCloseTicket = async () => {
    const response = await TicketService.closeTicket(id, addNotification)
    if (response) {
      navigate("/employee/home", { replace: true })
    }
  }

  const handleForwardTicket = async (userId) => {
    await TicketService.forwardTicket(id, { userId: userId }, addNotification)
    navigate("/employee/home", { replace: true })
  }

  useEffect(() => {
    const updateTicketStatus = async () => {
      await TicketService.acceptForward(id, addNotification)
    }
    updateTicketStatus()
  }, [id, addNotification])

  return (
    <div className={styles.ticketManagerContainer}>
      <div className={styles.header}>
        <button
          type="button"
          className={`${styles.button} ${styles.passButton}`}
          onClick={handlePassButtonClick}
        >
          Przekaż zgłoszenie
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.closeButton}`}
          onClick={handleCloseButtonClick}
        >
          Zamknij zgłoszenie
        </button>
      </div>
      <div className={styles.box}>
        <div className={styles.tabsContainer}>
          <div
            className={`${styles.tab} ${
              activeTab === 1 ? styles.selected : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            <p>Szczegóły</p>
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === 2 ? styles.selected : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            <p>Historia</p>
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === 3 ? styles.selected : ""
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
      {showModal && (
        <TicketForwardModal
          onClick={handleForwardTicket}
          onClose={handleCloseModal}
        />
      )}
      {showCloseTicketModal && (
        <CloseTicketModal
          onClick={handleCloseTicket}
          onClose={handleCloseTicketModal}
        />
      )}
    </div>
  )
}
