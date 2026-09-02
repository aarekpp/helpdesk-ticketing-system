import ApiClient from "./ApiClient";

const FileService = {
  getFileById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/files/preview/${id}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting file with ID: ${id}.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  downloadMessageFile: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/files/message/${id}`, {
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `An error occurred while getting file.`;
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default FileService;
