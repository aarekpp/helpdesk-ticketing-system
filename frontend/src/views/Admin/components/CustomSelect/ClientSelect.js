import React, { useContext, useEffect, useState } from "react";
import styles from "./CustomSelect.module.scss";
import Loader from "components/Loader/Loader";
import { ReactComponent as AddSVG } from "../../../../icons/add.svg";
import { ReactComponent as DeleteSVG } from "../../../../icons/delete.svg";
import NotificationContext from "context/NotificationContext";
import ClientService from "api/ClientService";
import CustomSelect from "./CustomSelect";

export default function ClientSelect({ selectedClients, setSelectedClients }) {
  const { addNotification } = useContext(NotificationContext);
  const [clients, setClients] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const availableClients = clients.filter(
    (client) => !selectedClients.map((c) => c.id).includes(client.id),
  );

  const handleCancelAdding = () => setIsAdding(false);

  const handleAccept = (item) => {
    const selectedClient = clients.find((client) => client.id === item.id);
    const newClients = [...selectedClients, selectedClient];
    newClients.sort((a, b) => {
      const lastNameComparision = a.lastName.localeCompare(b.lastName);
      if (lastNameComparision !== 0) return lastNameComparision;
      const firstNameComparision = a.firstName.localeCompare(b.firstName);
      if (firstNameComparision !== 0) return firstNameComparision;
      return a.username.localeCompare(b.username);
    });
    setSelectedClients(newClients);
    setIsAdding(false);
  };

  const handleRemoveClient = (index) => {
    const removedClient = selectedClients[index];
    const newSelectedClients = selectedClients.filter(
      (client, clientIndex) => index !== clientIndex,
    );
    setSelectedClients(newSelectedClients);

    const newAvailableClients = [...availableClients, removedClient];
    newAvailableClients.sort((a, b) => {
      const lastNameComparision = a.lastName.localeCompare(b.lastName);
      if (lastNameComparision !== 0) return lastNameComparision;
      const firstNameComparision = a.firstName.localeCompare(b.firstName);
      if (firstNameComparision !== 0) return firstNameComparision;
      return a.username.localeCompare(b.username);
    });
    setClients(newAvailableClients);
  };

  const formatClients = (users) => {
    return users.map((client) => ({
      id: client.id,
      name: `${client.firstName} ${client.lastName} - ${client.username}`,
    }));
  };

  useEffect(() => {
    const getAllClients = async () => {
      const response =
        await ClientService.getAllClientsWithoutCompany(addNotification);
      if (response && response.status === 200) {
        setClients(response.data.data);
      }
      setIsDataLoaded(true);
    };
    getAllClients();
  }, [addNotification]);

  if (!isDataLoaded) return <Loader />;

  if (clients.length === 0 && selectedClients.length === 0)
    return (
      <div className={styles.selectContainer}>
        <p className={styles.textInfo}>Brak klientów</p>
      </div>
    );

  return (
    <div className={styles.selectContainer}>
      {selectedClients.length === 0 && (
        <p className={styles.textInfo}>Brak wybranych pracowników</p>
      )}
      <div className={styles.selectedItems}>
        {selectedClients.map((client, index) => (
          <div key={index} className={styles.selectedItem}>
            <p className={styles.itemName}>
              {client.firstName +
                " " +
                client.lastName +
                " - " +
                client.username}
            </p>
            <button
              className={styles.deleteButton}
              onClick={() => handleRemoveClient(index)}
            >
              <DeleteSVG className={styles.icon} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.customSelectContainer}>
        <CustomSelect
          show={isAdding}
          data={formatClients(availableClients)}
          onAccept={handleAccept}
          onCancel={handleCancelAdding}
        />
      </div>
      <div className={styles.buttonBox}>
        <button
          className={styles.button}
          onClick={() => setIsAdding(true)}
          disabled={isAdding || availableClients.length === 0}
        >
          <div className={styles.iconBox}>
            <AddSVG className={styles.icon} />
          </div>
          <span>Dodaj</span>
        </button>
      </div>
    </div>
  );
}
