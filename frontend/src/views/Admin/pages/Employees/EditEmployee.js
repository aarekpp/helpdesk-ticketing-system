import EmployeeService from "api/EmployeeService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import useUserForm from "hooks/useUserForm";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formStyles from "../../../../scss/Form.module.scss";
import UserFormInfoSection from "views/Admin/components/UserFormInfoSection";

export default function EditEmployee() {
  const { addNotification } = useContext(NotificationContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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
    const getEmployee = async () => {
      const response = await EmployeeService.getEmployeeById(
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
        setDataLoaded(true);
      } else {
        navigate("/admin/employees", { replace: true });
      }
    };
    getEmployee();
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

    const employeeData = {
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
      email: inputValues.email,
      username: inputValues.username,
    };

    if (inputValues.password.trim()) {
      employeeData.password = inputValues.password;
    }

    const response = await EmployeeService.updateEmployee(
      id,
      employeeData,
      addNotification,
    );

    setIsLoading(false);

    if (response && response.status === 200) {
      navigate("/admin/employees", { replace: true });
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
