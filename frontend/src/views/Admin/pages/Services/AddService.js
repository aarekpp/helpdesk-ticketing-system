import React, { useCallback, useContext, useEffect, useState } from "react";
import Loader from "components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import formStyles from "../../../../scss/Form.module.scss";
import ServiceProductService from "api/ServiceProductService";
import useFocusEnd from "hooks/useFocusEnd";
import NotificationContext from "context/NotificationContext";
import CompaniesSelect from "views/Admin/components/CustomSelect/CompaniesSelect";

export default function AddService() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [serviceName, setServiceName] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isServiceNameValid, setIsServiceNameValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serviceNameRef, setFocusToEnd] = useFocusEnd();

  const validateData = useCallback(() => {
    const regex = /^[a-zA-Z0-9-_.ąęółśżźćńĄĘÓŁŚŻŹĆŃ ]+$/;
    if (!serviceName) {
      setErrorMessage("Nazwa usługi nie może być pusta");
      return false;
    }
    if (
      serviceName.trim().length < 2 ||
      serviceName.length > 500 ||
      !regex.test(serviceName)
    ) {
      setErrorMessage("Niepoprawna nazwa usługi");
      return false;
    }
    setErrorMessage("");
    return true;
  }, [serviceName]);

  useEffect(() => {
    if (serviceName || submitAttempted) {
      setIsServiceNameValid(validateData());
    }
  }, [serviceName, submitAttempted, validateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!validateData()) {
      return;
    }

    setIsLoading(true);

    const response = await ServiceProductService.createService(
      {
        name: serviceName,
        companyIds: selectedCompanies.map((company) => company.id),
      },
      addNotification,
    );

    setIsLoading(false);

    if (response && response.status === 201) {
      navigate("/admin/services", { replace: true });
    }
  };

  return (
    <div className={formStyles.formContainer}>
      <form
        className={formStyles.form}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className={formStyles.formSection}>
          <label htmlFor="serviceName" className={formStyles.formLabel}>
            Nazwa usługi:
          </label>
          <input
            id="serviceName"
            name="serviceName"
            className={`${formStyles.formInput} ${
              isServiceNameValid === false
                ? formStyles.error
                : isServiceNameValid
                  ? formStyles.success
                  : ""
            }`}
            type="text"
            placeholder="Usługa xyz"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            onFocus={setFocusToEnd}
            ref={serviceNameRef}
          />
          {errorMessage && (
            <p className={formStyles.errorInfo}>{errorMessage}</p>
          )}
        </div>
        <div className={formStyles.formSection}>
          <label className={formStyles.formLabel}>
            Firmy korzystające z usługi (opcjonalne)
          </label>
          <CompaniesSelect
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
          />
        </div>
        <div
          className={`${formStyles.formSection} ${formStyles.buttonSection}`}
        >
          <button type="submit" className={formStyles.button}>
            {isLoading ? <Loader /> : "Dodaj usługę"}
          </button>
        </div>
        <div className={formStyles.infoSection}>
          <p>Wymagania dla nazwy usługi:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Nazwa musi być unikalna</li>
            <li className={formStyles.listElement}>Wielkie i małe litery</li>
            <li className={formStyles.listElement}>Liczby</li>
            <li className={formStyles.listElement}>
              Znaki specjalne takie jak - _ .
            </li>
            <li className={formStyles.listElement}>
              Wymagana ilość znaków z zakresu 2 - 500
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
