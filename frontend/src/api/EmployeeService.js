import ApiClient from "./ApiClient";

const EmployeeService = {
  getAllEmployees: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/employees");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during GET operation on employees.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getEmployeesToForward: async (addNotification) => {
    try {
      const response = await ApiClient.get("/users/employees/to-forward");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during GET operation on employees.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  getEmployeeById: async (id, addNotification) => {
    try {
      const response = await ApiClient.get(`/users/employees/${id}`);
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during GET operation on employee.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  createEmployee: async (data, addNotification) => {
    try {
      const response = await ApiClient.post("/users/employees", data);
      const successMessage =
        response.data.message || "Employee created successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during POST operation on employee.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  updateEmployee: async (id, data, addNotification) => {
    try {
      const response = await ApiClient.put(`/users/employees/${id}`, data);
      const successMessage =
        response.data.message || "Employee updated successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during PUT operation on employee.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
  deleteEmployee: async (id, addNotification) => {
    try {
      const response = await ApiClient.delete(`/users/employees/${id}`);
      const successMessage =
        response.data.message || "Employee deleted successfully!";
      addNotification(successMessage, "success");
      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred during DELETE operation on employee.";
      addNotification(`Error: ${errorMessage}`, "error");
      return null;
    }
  },
};

export default EmployeeService;
