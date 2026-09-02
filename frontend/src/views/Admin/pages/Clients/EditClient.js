import ClientService from "api/ClientService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import useUserForm from "hooks/useUserForm";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formStyles from "../../../../scss/Form.module.scss";
import UserFormInfoSection from "views/Admin/components/UserFormInfoSection";
import CompanySelect from "views/Admin/components/CompanySelect/CompanySelect";

export default function EditClient() {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState({
    id: -1,
    name: "Wybierz",
  });

  const {
    inputValues,
    inputValidity,
    inputErrors,
    handleInputChange,
    validateField,
    setInputValues,
    refMap,
    focusMap,
    defaultFieldNames,
    defaultPlaceholders,
  } = useUserForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    false,
  );

  useEffect(() => {
    const getClient = async () => {
      const response = await ClientService.getClientWithCompanyDataById(
        id,
        addNotification,
      );
      if (response && response.status === 200) {
        setInputValues({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          username: response.data.data.username,
          password: "",
          passwordConfirmation: "",
        });
        if (response.data.data.company) {
          setSelectedCompany(response.data.data.company);
        }
        setDataLoaded(true);
      } else {
        navigate("/admin/clients", { replace: true });
      }
    };
    getClient();
  }, [id, navigate, setInputValues, addNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let allValid = true;
    for (let field in inputValues) {
      if (field !== "password" && field !== "passwordConfirmation") {
        validateField(field, inputValues[field]);
      }

      if (
        (field === "password" || field === "passwordConfirmation") &&
        inputValues[field].trim()
      ) {
        validateField(field, inputValues[field]);
      }
    }

    for (let field in inputValidity) {
      if (inputValidity[field] === false) {
        allValid = false;
      }
    }

    if (!allValid) return;

    setIsLoading(true);

    const clientData = {
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
      email: inputValues.email,
      username: inputValues.username,
      companyId: selectedCompany.id !== -1 ? selectedCompany.id : null,
    };

    if (inputValues.password.trim()) {
      clientData.password = inputValues.password;
    }

    const response = await ClientService.updateClient(
      id,
      clientData,
      addNotification,
    );

    setIsLoading(false);

    if (response && response.status === 200) {
      navigate("/admin/clients", { replace: true });
    }
  };

  if (!dataLoaded) {
    return (
      <div className={formStyles.formContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={formStyles.formContainer}>
      <form
        className={formStyles.form}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        {[
          "firstName",
          "lastName",
          "email",
          "username",
          "password",
          "passwordConfirmation",
        ].map((field) => (
          <div key={field} className={formStyles.formSection}>
            <label htmlFor={field} className={formStyles.formLabel}>
              {field === "passwordConfirmation"
                ? "Potwierdź hasło:"
                : defaultFieldNames[field]}
              :
            </label>
            <input
              id={field}
              name={field}
              className={`${formStyles.formInput} ${
                inputValidity[field] === false
                  ? formStyles.error
                  : inputValidity[field]
                    ? formStyles.success
                    : ""
              }`}
              type={field.includes("password") ? "password" : "text"}
              placeholder={defaultPlaceholders[field]}
              value={inputValues[field]}
              onChange={handleInputChange(field)}
              onFocus={focusMap[field]}
              ref={refMap[field]}
            />
            {inputErrors[field] && (
              <p className={formStyles.errorInfo}>{inputErrors[field]}</p>
            )}
          </div>
        ))}
        <div
          className={`${formStyles.formSection} ${formStyles.selectSection}`}
        >
          <CompanySelect
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
          />
        </div>
        <div
          className={`${formStyles.formSection} ${formStyles.buttonSection}`}
        >
          <button type="submit" className={formStyles.button}>
            {isLoading ? <Loader /> : "Zapisz zmiany"}
          </button>
        </div>
        <UserFormInfoSection />
      </form>
    </div>
  );
}
