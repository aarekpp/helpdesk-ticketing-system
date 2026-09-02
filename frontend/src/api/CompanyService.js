import ApiClient from "./ApiClient";

const CompanyService = {
  getAllCompanies: async (addNotification) => {
    try {
      const response = await ApiClient.get("/companies");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting companies.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getAllCompaniesWithExtendedData: async (addNotification) => {
    try {
      const response = await ApiClient.get("/companies/extended");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting companies with extended data.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getCompany: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/companies/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getServicesByCompanyId: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/companies/${id}/services`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting services by company ID.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getCompanyWithExtendedData: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/companies/${id}/extended`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while getting the company with extended data.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  createCompany: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/companies", data);
      const successMessage =
        response.data.message || "Company added successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while adding the company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  updateCompany: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.put(`/companies/${id}`, data);
      const successMessage =
        response.data.message || "Company updated successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while updating the company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  deleteCompany: async (id, addNotification) => {
    try {
      const response = await ApiClient.delete(`/companies/${id}`);
      const successMessage =
        response.data.message || "Company deleted successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while deleting the company.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default CompanyService;
