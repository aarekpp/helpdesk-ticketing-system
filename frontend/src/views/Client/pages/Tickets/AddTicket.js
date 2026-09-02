import TicketService from "api/TicketService";
import NotificationContext from "context/NotificationContext";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import formStyles from "../../../../scss/Form.module.scss";
import useFocusEnd from "hooks/useFocusEnd";
import FileUpload from "./components/FileUpload/FileUpload";
import ServiceSelect from "./components/ServiceSelect/ServiceSelect";
import TextEditor from "./components/TextEditor/TextEditor";
import Loader from "components/Loader/Loader";

export default function AddTicket() {
  const { addNotification } = useContext(NotificationContext);
  const { userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    service: { id: -1, name: "Wybierz" },
    description: "",
    clientId: userId,
    files: [],
  });

  const [formValidation, setFormValidation] = useState({
    title: { isValid: true, errorMessage: "", touched: false },
    description: { isValid: true, errorMessage: "", touched: false },
  });

  const namesMap = {
    title: "Tytuł zgłoszenia",
    description: "Opis problemu",
  };

  const [titleRef, setTitleFocusToEnd] = useFocusEnd();

  const validateField = (name, value) => {
    let isValid = true;
    let errorMessage = "";

    if (value === "") {
      errorMessage = `${namesMap[name]} nie może być pusty.`;
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

  const handleServiceSelect = (service) => {
    setFormData((prevData) => ({
      ...prevData,
      service: service,
    }));
  };

  const handleEditorChange = (htmlContent) => {
    setFormData((prevData) => ({
      ...prevData,
      description: htmlContent,
    }));
  };

  const handleFileUpload = (validFiles) => {
    setFormData((prevData) => ({
      ...prevData,
      files: validFiles,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const ticketFormData = new FormData();
    ticketFormData.append(
      "ticket",
      JSON.stringify({
        title: formData.title,
        description: formData.description,
        clientId: formData.clientId,
        serviceProductId:
          formData.service.id !== -1 ? formData.service.id : null,
      }),
    );

    if (formData.files && formData.files.length > 0) {
      for (let i = 0; i < formData.files.length; i++) {
        ticketFormData.append("files", formData.files[i]);
      }
    }

    const response = await TicketService.createTicket(
      ticketFormData,
      addNotification,
    );
    if (response && response.status === 201) {
      navigate("/client/home", { replace: true });
    }

    setIsLoading(false);
  };

  return (
    <div className={formStyles.formContainer}>
      <form
        className={formStyles.form}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className={formStyles.formSection}>
          <label className={formStyles.formLabel} htmlFor="title">
            Tytuł zgłoszenia:
          </label>
          <input
            id="title"
            name="title"
            className={`${formStyles.formInput} ${
              formValidation.title.touched && !formValidation.title.isValid
                ? formStyles.error
                : formValidation.title.touched && formValidation.title.isValid
                  ? formStyles.success
                  : ""
            }`}
            type="text"
            placeholder="Przykładowy tytuł"
            value={formData.title}
            onChange={handleInputChange}
            ref={titleRef}
            onFocus={setTitleFocusToEnd}
          />
          {formValidation.title.touched && !formValidation.title.isValid && (
            <p className={formStyles.errorInfo}>
              {formValidation.title.errorMessage}
            </p>
          )}
        </div>
        <div
          className={`${formStyles.formSection} ${formStyles.selectSection}`}
        >
          <p className={formStyles.formLabel}>
            Usługa której dotyczy zgłoszenie:
          </p>
          <ServiceSelect
            selectedService={formData.service}
            onServiceSelect={handleServiceSelect}
          />
        </div>
        <div className={formStyles.formSection}>
          <p className={formStyles.formLabel}>Opis problemu:</p>
          <TextEditor onChange={handleEditorChange} />
          {formValidation.description.touched &&
            !formValidation.description.isValid && (
              <p className={formStyles.errorInfo}>
                {formValidation.description.errorMessage}
              </p>
            )}
        </div>
        <div className={formStyles.formSection}>
          <p className={formStyles.formLabel}>Pliki (opcjonalne):</p>
          <FileUpload onFilesChange={handleFileUpload} />
        </div>
        <div
          className={`${formStyles.formSection} ${formStyles.buttonSection}`}
        >
          <button type="submit" className={formStyles.button}>
            {isLoading ? <Loader /> : "Wyślij zgłoszenie"}
          </button>
        </div>
        <div className={formStyles.infoSection}>
          <p>Tytuł zgłoszenia może zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Dowolne znaki</li>
            <li className={formStyles.listElement}>Ilość znaków: 1 - 500</li>
          </ul>
          <p>
            Usługa nie powinna zostać wybrana tylko w przypadku, gdy błędem jest
            brak jakiejś usługi w systemie
          </p>
          <ul className={formStyles.list}></ul>
          <p>Opis może zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Dowolne znaki</li>
            <li className={formStyles.listElement}>Wybrane style</li>
          </ul>
          <p>Pliki:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>
              Maksymalny rozmiar pliku to 100MB
            </li>
            <li className={formStyles.listElement}>
              Niedozwolone rozszerzenia: .exe .sh .bat
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
}
