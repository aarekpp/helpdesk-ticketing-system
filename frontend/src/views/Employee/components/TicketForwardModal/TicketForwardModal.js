import React, { useContext, useEffect, useState } from "react";
import styles from "./TicketForwardModal.module.scss";
import Loader from "components/Loader/Loader";
import { FormControl, MenuItem, Select } from "@mui/material";
import EmployeeService from "api/EmployeeService";
import NotificationContext from "context/NotificationContext";

export default function TicketForwardModal({ onClick, onClose }) {
  const { addNotification } = useContext(NotificationContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    const getEmployees = async () => {
      const response = await EmployeeService.getEmployeesToForward();
      if (response) {
        setEmployees(response.data.data);
        setIsDataLoaded(true);
      }
    };
    getEmployees();
  }, [addNotification]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>Przekaż zgłoszenie</p>
        <div className={styles.selectContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : employees.length === 0 ? (
            <p>Brak pracowników</p>
          ) : (
            <FormControl fullWidth>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Wybierz pracownika
                </MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstName +
                      " " +
                      employee.lastName +
                      " - " +
                      employee.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Anuluj
          </button>
          <button
            className={styles.forwardButton}
            disabled={employees.length === 0 || !selectedEmployee}
            onClick={(e) => onClick(selectedEmployee)}
          >
            Przekaż
          </button>
        </div>
      </div>
    </div>
  );
}
