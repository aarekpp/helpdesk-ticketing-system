import CompanyService from "api/CompanyService";
import Loader from "components/Loader/Loader";
import React, { useContext, useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { ReactComponent as AddSVG } from "../../../../icons/add.svg";
import { ReactComponent as DeleteSVG } from "../../../../icons/delete.svg";
import styles from "./CustomSelect.module.scss";
import NotificationContext from "context/NotificationContext";

export default function CompaniesSelect({
  selectedCompanies,
  setSelectedCompanies,
}) {
  const { addNotification } = useContext(NotificationContext);
  const [companies, setCompanies] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [dataLoadedError, setDataLoadedError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const availableCompanies = companies.filter(
    (company) => !selectedCompanies.map((c) => c.id).includes(company.id),
  );

  const handleCancelAdding = () => setIsAdding(false);

  const handleAccept = (item) => {
    const newCompanies = [...selectedCompanies, item];
    newCompanies.sort((a, b) => a.name.localeCompare(b.name));
    setSelectedCompanies(newCompanies);
    setIsAdding(false);
  };

  const handleRemoveService = (index) => {
    const newCompanies = selectedCompanies.filter(
      (company, companyIndex) => index !== companyIndex,
    );
    setSelectedCompanies(newCompanies);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await CompanyService.getAllCompanies(addNotification);
      response ? setCompanies(response.data.data) : setDataLoadedError(true);
      setIsDataLoaded(true);
    };
    fetchData();
  }, [addNotification]);

  if (!isDataLoaded) return <Loader />;

  if (dataLoadedError) {
    return (
      <div className={styles.companySelectContainer}>
        <p className={`${styles.infoText} ${styles.error}`}>
          Błąd podczas pobierania danych z serwera
        </p>
      </div>
    );
  }

  if (companies.length === 0)
    return (
      <div className={styles.selectContainer}>
        <p className={styles.textInfo}>Brak firm</p>
      </div>
    );

  return (
    <div className={styles.selectContainer}>
      {selectedCompanies.length === 0 && companies.length !== 0 && (
        <p className={styles.textInfo}>Brak wybranych firm</p>
      )}
      <div className={styles.selectedItems}>
        {selectedCompanies.map((company, index) => (
          <div key={index} className={styles.selectedItem}>
            <p className={styles.itemName}>{company.name}</p>
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
          data={availableCompanies}
          onAccept={handleAccept}
          onCancel={handleCancelAdding}
        />
      </div>
      <div className={styles.buttonBox}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setIsAdding(true)}
          disabled={isAdding || selectedCompanies.length === companies.length}
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
