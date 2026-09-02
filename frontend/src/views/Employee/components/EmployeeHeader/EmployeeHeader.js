import React, { useContext, useState } from "react";
import styles from "./EmployeeHeader.module.scss";
import NotificationContext from "context/NotificationContext";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import AuthService from "api/AuthService";
import { setLoginState } from "../../../../redux/AuthSlice";
import { ReactComponent as LogoutSVG } from "../../../../icons/logout.svg";
import { ReactComponent as MenuSVG } from "../../../../icons/menu.svg";
import MobileMenu from "../MobileMenu/MobileMenu";

export default function EmployeeHeader() {
  const { addNotification } = useContext(NotificationContext);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);

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
    <div className={styles.header}>
      <div className={`${styles.buttonBox} ${styles.menuButtonBox}`}>
        <IconButton
          className={styles.iconButton}
          onClick={() => setIsMobileMenuOpened(true)}
        >
          <MenuSVG className={styles.icon} />
        </IconButton>
      </div>
      <div className={styles.title}>
        <p>{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
      </div>
      <div className={styles.buttonBox}>
        <IconButton className={styles.iconButton} onClick={handleLogout}>
          <LogoutSVG className={styles.icon} />
        </IconButton>
      </div>
      <MobileMenu
        isMobileMenuOpened={isMobileMenuOpened}
        setIsMobileMenuOpened={setIsMobileMenuOpened}
      />
    </div>
  );
}
