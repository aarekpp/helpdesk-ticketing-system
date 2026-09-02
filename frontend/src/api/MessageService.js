import ApiClient from "./ApiClient";

const MessageService = {
  sendMessage: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.post(`/messages/${id}`, data);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending message.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default MessageService;
