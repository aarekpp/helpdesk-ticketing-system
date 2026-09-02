import React, { useContext, useEffect, useState } from "react";
import styles from "./CustomSelect.module.scss";
import Loader from "components/Loader/Loader";
import { ReactComponent as AddSVG } from "../../../../icons/add.svg";
import { ReactComponent as DeleteSVG } from "../../../../icons/delete.svg";
import CustomSelect from "views/Admin/components/CustomSelect/CustomSelect";
import ServiceProductService from "api/ServiceProductService";
import NotificationContext from "context/NotificationContext";

export default function ServiceSelect({
  selectedServices,
  setSelectedServices,
}) {
  const { addNotification } = useContext(NotificationContext);
  const [services, setServices] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const availableServices = services.filter(
    (service) => !selectedServices.map((s) => s.id).includes(service.id),
  );

  useEffect(() => {
    const getAllServices = async () => {
      const response =
        await ServiceProductService.getAllServices(addNotification);
      if (response && response.status === 200) {
        setServices(response.data.data);
      }
      setIsDataLoaded(true);
    };
    getAllServices();
  }, [addNotification]);

  const handleCancelAdding = () => setIsAdding(false);

  const handleAccept = (item) => {
    const newServices = [...selectedServices, item];
    newServices.sort((a, b) => a.name.localeCompare(b.name));
    setSelectedServices(newServices);
    setIsAdding(false);
  };

  const handleRemoveService = (index) => {
    const newServices = selectedServices.filter(
      (service, serviceIndex) => index !== serviceIndex,
    );
    setSelectedServices(newServices);
  };

  if (!isDataLoaded) return <Loader />;

  if (services.length === 0)
    return (
      <div className={styles.selectContainer}>
        <p className={styles.textInfo}>Brak usług</p>
      </div>
    );

  return (
    <div className={styles.selectContainer}>
      {selectedServices.length === 0 && (
        <p className={styles.textInfo}>Brak wybranych usług</p>
      )}
      <div className={styles.selectedItems}>
        {selectedServices.map((service, index) => (
          <div key={index} className={styles.selectedItem}>
            <p className={styles.itemName}>{service.name}</p>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleRemoveService(index)}
            >
              <DeleteSVG className={styles.icon} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.customSelectContainer}>
        <CustomSelect
          show={isAdding}
          data={availableServices}
          onAccept={handleAccept}
          onCancel={handleCancelAdding}
        />
      </div>
      <div className={styles.buttonBox}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setIsAdding(true)}
          disabled={isAdding || selectedServices.length === services.length}
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
