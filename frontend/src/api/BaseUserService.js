import ApiClient from "./ApiClient";

const BaseUserService = {
  changePassword: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/users/change-password", data);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during change password.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default BaseUserService;
