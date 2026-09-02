import React, { useContext, useState } from "react";
import styles from "./SignIn.module.scss";
import formStyles from "../../scss/Form.module.scss";
import { useDispatch } from "react-redux";
import Loader from "components/Loader/Loader";
import { setLoginState } from "../../redux/AuthSlice";
import AuthService from "api/AuthService";
import NotificationContext from "context/NotificationContext";
import { setUser } from "../../redux/UserSlice";
import EmployeeService from "api/EmployeeService";
import ClientService from "api/ClientService";

export default function SignIn() {
  const { addNotification } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (username.length > 0 && password.length > 0) {
      const dataToSend = {
        username: username,
        password: password,
      };
      const response = await AuthService.signIn(dataToSend, addNotification);
      if (response && response.data) {
        if (response.data.role === "EMPLOYEE") {
          const employeeResponse = await EmployeeService.getEmployeeById(
            response.data.userId,
            addNotification,
          );
          if (employeeResponse && employeeResponse.status === 200) {
            dispatch(
              setUser({
                currentUser: employeeResponse.data.data,
              }),
            );
          }
        } else if (response.data.role === "CLIENT") {
          const clientResponse =
            await ClientService.getClientWithCompanyDataById(
              response.data.userId,
              addNotification,
            );
          if (clientResponse && clientResponse.status === 200) {
            dispatch(
              setUser({
                currentUser: clientResponse.data.data,
              }),
            );
          }
        }
        dispatch(
          setLoginState({
            isLoggedIn: true,
            role: response.data.role,
            isFirstLogin: response.data.isFirstLogin,
            userId: response.data.userId,
          }),
        );
      }
    } else {
      setAuthError(true);
    }
    setLoading(false);
  };

  return (
    <div className={styles.signinContainer}>
      <header className={styles.pageHeader}>
        <h1>HELPDESK APP</h1>
      </header>
      <form
        action="#"
        className={`${formStyles.form} ${styles.signInForm}`}
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="on"
      >
        <header className={formStyles.formHeader}>
          <h1>Panel logowania</h1>
        </header>
        <main className={formStyles.formMain}>
          <div className={formStyles.formSection}>
            <label htmlFor="username" className={formStyles.formLabel}>
              Nazwa użytkownika
            </label>
            <input
              id="username"
              type="text"
              className={`${formStyles.formInput} ${
                authError ? formStyles.error : ""
              }`}
              placeholder="mojafirma"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={formStyles.formSection}>
            <label htmlFor="password" className={formStyles.formLabel}>
              Hasło
            </label>
            <input
              id="password"
              type="password"
              className={`${formStyles.formInput} ${
                authError ? formStyles.error : ""
              }`}
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {authError && (
            <p className={`${formStyles.errorInfo}`}>
              Niepoprawna nazwa użytkownika lub hasło
            </p>
          )}
          <div
            className={`${formStyles.formSection} ${formStyles.buttonSection}`}
          >
            <button type="submit" className={formStyles.button}>
              {loading ? <Loader /> : "Zaloguj się"}
            </button>
          </div>
        </main>
      </form>
    </div>
  );
}
