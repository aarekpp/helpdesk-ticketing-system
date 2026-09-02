import AdminService from "api/AdminService";
import NotificationContext from "context/NotificationContext";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import formStyles from "../../../../scss/Form.module.scss";
import Loader from "components/Loader/Loader";
import UserFormInfoSection from "views/Admin/components/UserFormInfoSection";
import useUserForm from "hooks/useUserForm";

export default function AddAdmin() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    inputValues,
    inputValidity,
    inputErrors,
    handleInputChange,
    validateField,
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
    true,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    let allValid = true;
    for (let field in inputValues) {
      validateField(field, inputValues[field]);
      if (!inputValidity[field]) allValid = false;
    }

    if (!allValid) return;

    setIsLoading(true);

    const response = await AdminService.createAdmin(
      {
        firstName: inputValues.firstName,
        lastName: inputValues.lastName,
        email: inputValues.email,
        username: inputValues.username,
        password: inputValues.password,
      },
      addNotification,
    );

    setIsLoading(false);

    if (response && response.status === 201) {
      navigate("/admin/admins", { replace: true });
    }
  };

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
        ].map((field, index) => {
          return (
            <div key={field} className={formStyles.formSection}>
              <label htmlFor={field} className={formStyles.formLabel}>
                {`${defaultFieldNames[field]}:`}
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
                placeholder={
                  field === "password" || field === "passwordConfirmation"
                    ? "********"
                    : `${defaultPlaceholders[field]}`
                }
                value={inputValues[field]}
                onChange={handleInputChange(field)}
                onFocus={focusMap[field]}
                ref={refMap[field]}
                autoComplete={
                  field.includes("password") ? "new-password" : "nope"
                }
              />
              {inputErrors[field] && (
                <p className={formStyles.errorInfo}>{inputErrors[field]}</p>
              )}
            </div>
          );
        })}
        <div
          className={`${formStyles.formSection} ${formStyles.buttonSection}`}
        >
          <button type="submit" className={formStyles.button}>
            {isLoading ? <Loader /> : "Dodaj administratora"}
          </button>
        </div>
        <UserFormInfoSection />
      </form>
    </div>
  );
}
