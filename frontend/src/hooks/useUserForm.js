import { useState } from "react";
import useFocusEnd from "./useFocusEnd";

export default function useUserForm(
  initialValues,
  shouldValidatePassword = true,
) {
  const defaultFieldNames = {
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "E-mail",
    username: "Nazwa użytkownika",
    password: "Hasło",
    passwordConfirmation: "Potwierdzenie hasła",
  };

  const defaultPlaceholders = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jankowalski@example.com",
    username: "jankowalski",
    password: "********",
    passwordConfirmation: "********",
  };

  const [inputValues, setInputValues] = useState(initialValues);
  const [inputValidity, setInputValidity] = useState({});
  const [inputErrors, setInputErrors] = useState({});

  const [firstNameRef, setFirstNameFocusToEnd] = useFocusEnd();
  const [lastNameRef, setLastNameFocusToEnd] = useFocusEnd();
  const [emailRef, setEmailFocusToEnd] = useFocusEnd();
  const [usernameRef, setUsernameFocusToEnd] = useFocusEnd();
  const [passwordRef, setPasswordFocusToEnd] = useFocusEnd();
  const [passwordConfirmationRef, setPasswordConfirmationFocusToEnd] =
    useFocusEnd();

  const refMap = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    email: emailRef,
    username: usernameRef,
    password: passwordRef,
    passwordConfirmation: passwordConfirmationRef,
  };

  const focusMap = {
    firstName: setFirstNameFocusToEnd,
    lastName: setLastNameFocusToEnd,
    email: setEmailFocusToEnd,
    username: setUsernameFocusToEnd,
    password: setPasswordFocusToEnd,
    passwordConfirmation: setPasswordConfirmationFocusToEnd,
  };

  const handleInputChange = (field) => (e) => {
    const { value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    validateField(field, value);
  };

  const validateField = (field, value) => {
    let isValid = true;
    let errorMessage = "";
    if (
      !value.trim() &&
      field !== "password" &&
      field !== "passwordConfirmation"
    ) {
      errorMessage = `${defaultFieldNames[field]} nie może być puste.`;
      isValid = false;
    } else {
      switch (field) {
        case "firstName":
          isValid = /^[a-zA-ZąęółśżźćńĄĘÓŁŚŻŹĆŃ]{2,50}$/.test(value);
          break;
        case "lastName":
          isValid = /^[a-zA-ZąęółśżźćńĄĘÓŁŚŻŹĆŃ '-]{2,100}$/.test(value);
          break;
        case "email":
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case "username":
          isValid = /^[a-zA-Z0-9-_.]{3,50}$/.test(value);
          break;
        case "password":
          if (shouldValidatePassword) {
            if (!value.trim()) {
              isValid = false;
              errorMessage = "Hasło nie może być puste.";
            } else {
              isValid =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
                  value,
                );
              if (!isValid) {
                errorMessage = "Hasło nie spełnia wymagań.";
              }
            }
          }
          break;
        case "passwordConfirmation":
          if (shouldValidatePassword) {
            if (!value.trim()) {
              isValid = false;
              errorMessage = "Pole potwierdzenia hasła nie może być puste.";
            } else if (value !== inputValues.password) {
              isValid = false;
              errorMessage = "Potwierdzenie hasła nie jest zgodne z hasłem.";
            }
          }
          break;
        default:
          break;
      }
      if (!isValid) {
        errorMessage = `Niepoprawne ${defaultFieldNames[field].toLowerCase()}.`;
      }
    }
    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [field]: isValid,
    }));
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));
  };

  return {
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
  };
}
