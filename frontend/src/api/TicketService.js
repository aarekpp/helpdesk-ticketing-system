import ApiClient from "./ApiClient";

const TicketService = {
  getAllTicketsByEmployee: async (addNotification) => {
    try {
      const response = await ApiClient.get("/tickets/employee");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting tickets.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getAllActiveTicketsByClient: async (addNotification) => {
    try {
      const response = await ApiClient.get("/tickets/client");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting active tickets.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getTicketDetailsById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting ticket with ID: ${id}.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getFiles: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/${id}/files`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting ticket files.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getTicketDetails: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/details/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting ticket details.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getEmployeeArchive: async (page, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/employee/archive`, {
        params: { page, size: 10 },
      });
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting tickets archive.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getClientArchive: async (page, size, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/client/archive`, {
        params: { page, size },
      });
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting tickets archive.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getTicketArchive: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/tickets/archive/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting ticket with ID: ${id}.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  createTicket: async (ticketData, addNotification) => {
    try {
      const response = await ApiClient.post("/tickets", ticketData);
      const successMessage =
        response.data.message || "Ticket created successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while creating the ticket.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  assignTicket: async (id, addNotification) => {
    try {
      const response = await ApiClient.post(`/tickets/assign/${id}`, {});
      if (response.data.data.status === 2) {
        const errorMessage =
          "Ticket has already been assigned to another employee";
        addNotification(errorMessage, "error");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while assign employee to ticket.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  markAsRead: async (id, addNotification) => {
    try {
      const response = await ApiClient.post(`/tickets/mark-as-read/${id}`, {});
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating the ticket read status.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  forwardTicket: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.post(`/tickets/forward/${id}`, data);
      addNotification("Ticket forwaded successfully", "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while forwarding the ticket.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  acceptForward: async (id, addNotification) => {
    try {
      const response = await ApiClient.put(`/tickets/accept-forward/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while accepting forward.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  closeTicket: async (id, addNotification) => {
    try {
      const response = await ApiClient.put(`/tickets/close/${id}`);
      addNotification("Ticket closed successfully", "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while closing ticket.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default TicketService;
