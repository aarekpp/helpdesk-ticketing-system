import ApiClient from "./ApiClient";

const ServiceProductService = {
  getAllServices: async (addNotification) => {
    try {
      const response = await ApiClient.get("/services");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting services.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getAllServicesWithCompanies: async (addNotification) => {
    try {
      const response = await ApiClient.get("/services/with-companies");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting services with companies.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getService: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/services/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the service.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  getServiceWithCompanies: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/services/${id}/with-companies`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the service with companies.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  createService: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/services", data);
      if (response.status === 201) {
        const successMessage =
          response.data.message || "Service added successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while adding the service.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  updateService: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.put(`/services/${id}`, data);
      if (response.status === 200) {
        const successMessage =
          response.data.message || "Service updated successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating the service.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },

  deleteService: async (id, addNotification) => {
    try {
      const response = await ApiClient.delete(`/services/${id}`);
      if (response.status === 200) {
        const successMessage =
          response.data.message || "Service deleted successfully!";
        addNotification(successMessage, "success");
      }
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while deleting the service.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default ServiceProductService;
