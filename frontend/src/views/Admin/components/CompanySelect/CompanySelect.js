import Loader from "components/Loader/Loader";
import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as ArrowUpSvg } from "../../../../icons/arrow_up.svg";
import { ReactComponent as ArrowDownSvg } from "../../../../icons/arrow_down.svg";
import CompanyService from "api/CompanyService";
import styles from "./CompanySelect.module.scss";
import NotificationContext from "context/NotificationContext";

export default function CompanySelect({ selectedCompany, setSelectedCompany }) {
  const { addNotification } = useContext(NotificationContext);
  const [companies, setCompanies] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (item) => {
    setSelectedCompany(item);
    setIsOpen(false);
  };

  useEffect(() => {
    const getAllCompanies = async () => {
      const response = await CompanyService.getAllCompanies(addNotification);
      if (response) {
        setCompanies([{ id: -1, name: "Wybierz" }, ...response.data.data]);
      }
      setIsDataLoaded(true);
    };

    getAllCompanies();
  }, [addNotification]);

  if (!isDataLoaded) return <Loader />;

  return (
    <div className={styles.customCompanySelect}>
      <div
        className={`${styles.selectBox} ${isOpen ? styles.open : ""}`}
        onClick={toggleDropdown}
      >
        <p className={styles.selectedItem}>{selectedCompany.name}</p>
        <div className={styles.arrowIconBox}>
          {isOpen ? (
            <ArrowUpSvg className={styles.icon} />
          ) : (
            <ArrowDownSvg className={styles.icon} />
          )}
        </div>
      </div>
      <div className={`${styles.companies} ${isOpen ? styles.show : ""}`}>
        {companies.map((item, index) => (
          <p
            key={index}
            className={`${styles.option} ${
              item.id === selectedCompany.id ? styles.selected : ""
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
