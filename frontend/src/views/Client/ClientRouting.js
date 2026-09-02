import React from "react";
import { Route, Routes } from "react-router-dom";
import ClientHeader from "./components/ClientHeader/ClientHeader";
import Tickets from "./pages/Tickets/Tickets";
import Archive from "./pages/Archive/Archive";
import AddTicket from "./pages/Tickets/AddTicket";
import { WebSocketProvider } from "context/WebSocketContext";
import ArchiveTicketDetails from "components/ArchiveTicketDetails/ArchiveTicketDetails";
import Ticket from "./pages/Ticket/Ticket";

export default function ClientRouting() {
  return (
    <WebSocketProvider>
      <ClientHeader />
      <Routes>
        <Route path="/home" element={<Tickets />} />
        <Route path="/add-ticket" element={<AddTicket />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/ticket/:id" element={<ArchiveTicketDetails />} />
      </Routes>
    </WebSocketProvider>
  );
}
