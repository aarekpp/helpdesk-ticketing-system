import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import Loader from "components/Loader/Loader";
import TicketService from "api/TicketService";
import NotificationContext from "context/NotificationContext";
import styles from "../../../../scss/Archive.module.scss";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function Archive() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  const fetchTickets = useCallback(
    async (pageNumber) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoadingMore(true);

      const size = 10;
      const response = await TicketService.getEmployeeArchive(
        pageNumber,
        size,
        addNotification,
      );

      if (response && response.data && response.data.data) {
        const newTickets = response.data.data.content;
        setTickets((prevTickets) => [...prevTickets, ...newTickets]);
        setHasMore(response.data.data.totalPages > pageNumber + 1);
      }

      setIsDataLoaded(true);
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    },
    [addNotification],
  );

  useEffect(() => {
    fetchTickets(0);
  }, [fetchTickets]);

  useEffect(() => {
    if (!isLoadingMore && loaderRef.current && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            fetchTickets(page + 1);
            setPage((prevPage) => prevPage + 1);
          }
        },
        { root: null, rootMargin: "100px", threshold: 1.0 },
      );

      observer.observe(loaderRef.current);

      return () => observer.disconnect();
    }
  }, [isLoadingMore, hasMore, page, fetchTickets]);

  if (!isDataLoaded) return <Loader />;

  return (
    <div className={styles.archiveContainer}>
      {tickets.length === 0 ? (
        <p>Brak zakończonych zgłoszeń</p>
      ) : (
        tickets.map((ticket, index) => (
          <div key={index} className={styles.ticket}>
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
                onClick={() =>
                  navigate(`/employee/archive/ticket/${ticket.id}`)
                }
              >
                Szczegóły
              </button>
            </div>
          </div>
        ))
      )}
      <div ref={loaderRef} style={{ height: "1px" }}></div>
      {isLoadingMore && <Loader />}
    </div>
  );
}
