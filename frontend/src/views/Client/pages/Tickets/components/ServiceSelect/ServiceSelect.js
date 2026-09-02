import CompanyService from "api/CompanyService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceSelect.module.scss";
import { ReactComponent as ArrowUpSvg } from "../../../../../../icons/arrow_up.svg";
import { ReactComponent as ArrowDownSvg } from "../../../../../../icons/arrow_down.svg";

export default function ServiceSelect({ selectedService, onServiceSelect }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [services, setServices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (item) => {
    onServiceSelect(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!currentUser.company.id) {
      addNotification(`Error: Użytkownik nie ma przypisanej firmy`, "error");
      navigate("/clients/home");
    }

    const getServicesByCompanyId = async () => {
      const response = await CompanyService.getServicesByCompanyId(
        currentUser.company.id,
        addNotification,
      );
      if (response && response.status === 200) {
        setServices([{ id: -1, name: "Wybierz" }, ...response.data.data]);
      }
      setIsDataLoaded(true);
    };

    getServicesByCompanyId();
  }, [currentUser.company.id, navigate, addNotification]);

  if (!isDataLoaded) return <Loader />;

  return (
    <div className={styles.customServiceSelect}>
      <div
        className={`${styles.selectBox} ${isOpen ? styles.open : ""}`}
        onClick={toggleDropdown}
      >
        <p className={styles.selectedItem}>{selectedService.name}</p>
        <div className={styles.arrowIconBox}>
          {isOpen ? (
            <ArrowUpSvg className={styles.icon} />
          ) : (
            <ArrowDownSvg className={styles.icon} />
          )}
        </div>
      </div>
      <div className={`${styles.companies} ${isOpen ? styles.show : ""}`}>
        {services.map((item, index) => (
          <p
            key={index}
            className={`${styles.option} ${
              item.id === selectedService.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectOption(item)}
          >
            {item.name}
          </p>
        ))}
      </div>
    </div>
  );
}
