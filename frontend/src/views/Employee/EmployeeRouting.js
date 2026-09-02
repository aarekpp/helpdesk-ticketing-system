import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import EmployeeHeader from "./components/EmployeeHeader/EmployeeHeader";
import { WebSocketProvider } from "context/WebSocketContext";
import TicketManager from "./pages/TicketManager/TicketManager";
import Archive from "./pages/Archive/Archive";
import ArchiveTicketDetails from "../../components/ArchiveTicketDetails/ArchiveTicketDetails";

export default function EmployeeRouting() {
  return (
    <WebSocketProvider>
      <EmployeeHeader />
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="ticket/:id" element={<TicketManager />} />
        <Route path="archive" element={<Archive />} />
        <Route path="archive/ticket/:id" element={<ArchiveTicketDetails />} />
      </Routes>
    </WebSocketProvider>
  );
}
