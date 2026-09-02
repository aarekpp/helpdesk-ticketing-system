import ApiClient from "./ApiClient";

const AdminService = {
  getAllAdmins: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/admins");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during GET operation on admins.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getAdminById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/users/admins/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during GET operation on admin.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  createAdmin: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/users/admins", data);
      const successMessage =
        response.data.message || "Admin created successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during POST operation on admin.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  updateAdmin: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.put(`/users/admins/${id}`, data);
      const successMessage =
        response.data.message || "Admin updated successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during PUT operation on admin.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  deleteAdmin: async (id, addNotification) => {
    try {
      const response = await ApiClient.delete(`/users/admins/${id}`);
      const successMessage =
        response.data.message || "Admin deleted successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during DELETE operation on admin.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default AdminService;
