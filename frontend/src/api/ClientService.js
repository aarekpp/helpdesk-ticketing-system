import ApiClient from "./ApiClient";

const ClientService = {
  getAllClients: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/clients");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting clients.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getAllClientsWithoutCompany: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/clients/without-company");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting clients without company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getAllClientsWithCompanyData: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/clients/with-company");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting clients with company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getClientById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/users/clients/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the client.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getClientWithCompanyDataById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/users/clients/${id}/with-company`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the client with company data.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  createClient: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/users/clients", data);
      if (response.status === 201) {
        const successMessage =
          response.data.message || "Client added successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while adding the client.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  updateClient: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.put(`/users/clients/${id}`, data);
      if (response.status === 200) {
        const successMessage =
          response.data.message || "Client updated successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating the client.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  deleteClient: async (id, addNotification) => {
    try {
      const response = await ApiClient.delete(`/users/clients/${id}`);
      if (response.status === 200) {
        const successMessage =
          response.data.message || "Client deleted successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while deleting the client.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default ClientService;
