import Loader from "components/Loader/Loader";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ZipCodeInput from "./components/ZipCodeInput/ZipCodeInput";
import NotificationContext from "context/NotificationContext";
import useFocusEnd from "hooks/useFocusEnd";
import CompanyService from "api/CompanyService";
import formStyles from "../../../../scss/Form.module.scss";
import ServiceSelect from "views/Admin/components/CustomSelect/ServiceSelect";
import ClientSelect from "views/Admin/components/CustomSelect/ClientSelect";

export default function EditCompany() {
  const { addNotification } = useContext(NotificationContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    cityName: "",
    address: "",
    zipCode: "",
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  const [formValidation, setFormValidation] = useState({
    companyName: { isValid: true, errorMessage: "", touched: true },
    cityName: { isValid: true, errorMessage: "", touched: true },
    address: { isValid: true, errorMessage: "", touched: true },
    zipCode: { isValid: true, errorMessage: "", touched: true },
  });

  const namesMap = {
    companyName: "Nazwa firmy",
    cityName: "Miasto",
    address: "Adres",
    zipCode: "Kod pocztowy",
  };

  const [companyNameRef, setCompanyNameFocusToEnd] = useFocusEnd();
  const [cityNameRef, setCityNameFocusToEnd] = useFocusEnd();
  const [addressRef, setAddressFocusToEnd] = useFocusEnd();

  const validateField = (name, value) => {
    let isValid = true;
    let errorMessage = "";

    const regex = {
      companyName: /^.{3,150}$/,
      cityName: /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]{2,80}$/,
      address: /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ,./-]{2,200}$/,
      zipCode: /^\d{2}-\d{3}$/,
    };

    if (value === "") {
      errorMessage = `${namesMap[name]} nie może być puste.`;
      isValid = false;
    } else if (!regex[name].test(value)) {
      errorMessage = `Pole ${namesMap[name]} jest niepoprawne.`;
      isValid = false;
    }

    return { isValid, errorMessage };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const validation = validateField(name, value);

    setFormValidation((prevValidation) => ({
      ...prevValidation,
      [name]: {
        isValid: validation.isValid,
        errorMessage: validation.errorMessage,
        touched: true,
      },
    }));
  };

  const sortUsers = (users) => {
    return users.sort((a, b) => {
      const lastNameComparision = a.lastName.localeCompare(b.lastName);
      if (lastNameComparision !== 0) return lastNameComparision;
      const firstNameComparision = a.firstName.localeCompare(b.firstName);
      if (firstNameComparision !== 0) return firstNameComparision;
      return a.username.localeCompare(b.username);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let isFormValid = true;
    const updatedValidation = { ...formValidation };
    for (const field in formData) {
      const validation = validateField(field, formData[field]);
      if (!validation.isValid) {
        isFormValid = false;
      }
      updatedValidation[field] = {
        ...validation,
        touched: true,
      };
    }
    setFormValidation(updatedValidation);

    if (!isFormValid) {
      setIsLoading(false);
      return;
    }

    const response = await CompanyService.updateCompany(
      id,
      {
        name: formData.companyName,
        city: formData.cityName,
        address: formData.address,
        zipCode: formData.zipCode,
        serviceProducts: selectedServices.map((service) => service.id),
        clients: selectedClients.map((client) => client.id),
      },
      addNotification,
    );

    setIsLoading(false);

    if (response && response.status === 200) {
      navigate("/admin/companies", { replace: true });
    }
  };

  useEffect(() => {
    const getCompany = async () => {
      const response = await CompanyService.getCompanyWithExtendedData(
        id,
        addNotification,
      );
      if (response && response.status === 200) {
        setFormData({
          companyName: response.data.data.name,
          cityName: response.data.data.city,
          address: response.data.data.address,
          zipCode: response.data.data.zipCode,
        });
        setSelectedServices(
          response.data.data.serviceProducts.sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        );
        setSelectedClients(sortUsers(response.data.data.clients));
        setIsDataLoaded(true);
      } else {
        navigate("/admin/companies", { replace: true });
      }
    };

    getCompany();
  }, [id, navigate, addNotification]);

  if (!isDataLoaded) {
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
        <div className={formStyles.formSection}>
          <label className={formStyles.formLabel} htmlFor="companyName">
            Nazwa firmy:
          </label>
          <input
            id="companyName"
            name="companyName"
            className={`${formStyles.formInput} ${
              formValidation.companyName.touched &&
              !formValidation.companyName.isValid
                ? formStyles.error
                : formValidation.companyName.touched &&
                    formValidation.companyName.isValid
                  ? formStyles.success
                  : ""
            }`}
            type="text"
            placeholder="MojaFirma"
            value={formData.companyName}
            onChange={handleInputChange}
            ref={companyNameRef}
            onFocus={setCompanyNameFocusToEnd}
          />
          {formValidation.companyName.touched &&
            !formValidation.companyName.isValid && (
              <p className={formStyles.errorInfo}>
                {formValidation.companyName.errorMessage}
              </p>
            )}
        </div>

        <div className={formStyles.formSection}>
          <label htmlFor="cityName" className={formStyles.formLabel}>
            Miasto:
          </label>
          <input
            id="cityName"
            name="cityName"
            className={`${formStyles.formInput} ${
              formValidation.cityName.touched &&
              !formValidation.cityName.isValid
                ? formStyles.error
                : formValidation.cityName.touched &&
                    formValidation.cityName.isValid
                  ? formStyles.success
                  : ""
            }`}
            type="text"
            placeholder="Rzeszów"
            value={formData.cityName}
            onChange={handleInputChange}
            ref={cityNameRef}
            onFocus={setCityNameFocusToEnd}
          />
          {formValidation.cityName.touched &&
            !formValidation.cityName.isValid && (
              <p className={formStyles.errorInfo}>
                {formValidation.cityName.errorMessage}
              </p>
            )}
        </div>

        <div className={formStyles.formSection}>
          <label htmlFor="address" className={formStyles.formLabel}>
            Adres:
          </label>
          <input
            id="address"
            name="address"
            className={`${formStyles.formInput} ${
              formValidation.address.touched && !formValidation.address.isValid
                ? formStyles.error
                : formValidation.address.touched &&
                    formValidation.address.isValid
                  ? formStyles.success
                  : ""
            }`}
            type="text"
            placeholder="Aleja Józefa Piłsudskiego 44/2"
            value={formData.address}
            onChange={handleInputChange}
            ref={addressRef}
            onFocus={setAddressFocusToEnd}
          />
          {formValidation.address.touched &&
            !formValidation.address.isValid && (
              <p className={formStyles.errorInfo}>
                {formValidation.address.errorMessage}
              </p>
            )}
        </div>

        <div className={formStyles.formSection}>
          <label htmlFor="zipCode" className={formStyles.formLabel}>
            Kod pocztowy:
          </label>
          <ZipCodeInput
            id="zipCode"
            zipCodeValue={formData.zipCode}
            onZipCodeChange={(zipCode) =>
              handleInputChange({ target: { name: "zipCode", value: zipCode } })
            }
            isTouched={formValidation.zipCode.touched}
            isValid={formValidation.zipCode.isValid}
            errorMessage={formValidation.zipCode.errorMessage}
          />
          {formValidation.zipCode.touched &&
            !formValidation.zipCode.isValid && (
              <p className={formStyles.errorInfo}>
                {formValidation.zipCode.errorMessage}
              </p>
            )}
        </div>

        <div className={formStyles.formSection}>
          <p className={formStyles.formLabel}>
            Świadczone usługi (opcjonalne):
          </p>
          <ServiceSelect
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        </div>

        <div className={formStyles.formSection}>
          <p className={formStyles.formLabel}>Pracownicy firmy (opcjonalne):</p>
          <ClientSelect
            selectedClients={selectedClients}
            setSelectedClients={setSelectedClients}
          />
        </div>

        <div
          className={`${formStyles.formSection} ${formStyles.buttonSection}`}
        >
          <button type="submit" className={formStyles.button}>
            {isLoading ? <Loader /> : "Zapisz zmiany"}
          </button>
        </div>

        <div className={formStyles.infoSection}>
          <p>Nazwa firmy może zawierać dowolne:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Litery</li>
            <li className={formStyles.listElement}>Cyfry</li>
            <li className={formStyles.listElement}>Znaki specjalne</li>
            <li className={formStyles.listElement}>Ilość znaków: 3 - 150</li>
          </ul>
          <p>Nazwa miasta może zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Małe i wielkie litery</li>
            <li className={formStyles.listElement}>Znak -</li>
            <li className={formStyles.listElement}>Ilość znaków: 2 - 80</li>
          </ul>
          <p>Adres może zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Małe i wielkie litery</li>
            <li className={formStyles.listElement}>Liczby</li>
            <li className={formStyles.listElement}>
              Znaki specjalne takie jak - / . ,
            </li>
            <li className={formStyles.listElement}>Ilość znaków: 2 - 200</li>
          </ul>
          <p>Kod pocztowy może zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Cyfry</li>
            <li className={formStyles.listElement}>Znak -</li>
            <li className={formStyles.listElement}>
              Musi być w formacie XX-XXX
            </li>
            <li className={formStyles.listElement}>Ilość znaków: 6</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
