import React, { useContext } from "react";
import styles from "./Header.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ReactComponent as LogoutSVG } from "../../../../icons/logout.svg";
import { ReactComponent as ArrowBackSVG } from "../../../../icons/arrow_back.svg";
import { setLoginState } from "../../../../redux/AuthSlice";
import AuthService from "api/AuthService";
import NotificationContext from "context/NotificationContext";

export default function Header() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const pathToTitle = {
    "/admin/home": "Panel administratora",
    "/admin/admins": "Administratorzy",
    "/admin/admins/add-admin": "Dodawanie administratora",
    "/admin/admins/edit-admin": "Edycja administratora",
    "/admin/employees": "Pracownicy",
    "/admin/employees/add-employee": "Dodawanie pracownika",
    "/admin/employees/edit-employee": "Edycja pracownika",
    "/admin/clients": "Klienci",
    "/admin/clients/add-client": "Dodawanie klienta",
    "/admin/clients/edit-client": "Edycja klienta",
    "/admin/managers": "Menadżerzy",
    "/admin/managers/add-manager": "Dodawanie menadżera",
    "/admin/managers/edit-manager": "Edycja menadżera",
    "/admin/companies": "Firmy",
    "/admin/companies/add-company": "Dodawanie firmy",
    "/admin/companies/edit-company": "Edycja firmy",
    "/admin/services": "Usługi",
    "/admin/services/add-service": "Dodawanie usługi",
    "/admin/services/edit-service": "Edycja usługi",
  };

  const pathToBackPath = {
    "/admin/admins/add-admin": "/admin/admins",
    "/admin/admins/edit-admin": "/admin/admins",
    "/admin/companies/add-company": "/admin/companies",
    "/admin/companies/edit-company": "/admin/companies",
    "/admin/services/add-service": "/admin/services",
    "/admin/services/edit-service": "/admin/services",
    "/admin/employees/add-employee": "/admin/employees",
    "/admin/employees/edit-employee": "/admin/employees",
    "/admin/clients/add-client": "/admin/clients",
    "/admin/clients/edit-client": "/admin/clients",
    "/admin/managers/add-manager": "/admin/managers",
    "/admin/managers/edit-manager": "/admin/managers",
  };

  const getTitleFromPath = (path) => {
    const matchingKey = Object.keys(pathToTitle)
      .filter((key) => path.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];
    return matchingKey ? pathToTitle[matchingKey] : "";
  };

  const getBackPathFromPath = (path) => {
    const matchingKey = Object.keys(pathToBackPath)
      .filter((key) => path.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];
    return matchingKey ? pathToBackPath[matchingKey] : "/admin/home";
  };

  const handleBack = (e) => {
    const backPath = getBackPathFromPath(location.pathname);
    navigate(backPath);
    e.currentTarget.blur();
  };

  const title = getTitleFromPath(location.pathname);

  const handleLogout = async () => {
    await AuthService.logout(addNotification);
    dispatch(
      setLoginState({
        isLoggedIn: false,
        role: null,
        isFirstLogin: false,
      }),
    );
  };

  return (
    <header className={styles.pageHeaderContainer}>
      <div className={styles.pageHeader}>
        {location.pathname !== "/admin/home" && (
          <div className={`${styles.buttonBox} ${styles.backButtonBox}`}>
            <button
              type="button"
              className={styles.button}
              onClick={(e) => handleBack(e)}
            >
              <ArrowBackSVG className={styles.icon} />
            </button>
          </div>
        )}
        <h1>{title}</h1>
        <div className={styles.buttonBox}>
          <button
            type="button"
            className={styles.button}
            onClick={handleLogout}
          >
            <LogoutSVG className={styles.icon} />
          </button>
        </div>
      </div>
    </header>
  );
}
