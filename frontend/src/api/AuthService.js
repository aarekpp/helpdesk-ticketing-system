import ApiClient from "./ApiClient";

const AuthService = {
  signIn: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/auth/signin", data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred during sign in.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  verifyToken: async () => {
    try {
      const response = await ApiClient.post("/auth/verify-token", {});
      return response.data;
    } catch (error) {
      return null;
    }
  },
  logout: async (addNotification) => {
    try {
      const response = await ApiClient.post("/auth/logout", {});
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred during logout.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default AuthService;
