import React from "react";
import styles from "../../../../scss/MobileMenu.module.scss";
import { ReactComponent as CloseSVG } from "../../../../icons/close.svg";
import { IconButton } from "@mui/material";
import { ReactComponent as FormSVG } from "../../../../icons/form.svg";
import { ReactComponent as ArchiveSVG } from "../../../../icons/archive.svg";
import { NavLink } from "react-router-dom";

export default function MobileMenu({
  isMobileMenuOpened,
  setIsMobileMenuOpened,
}) {
  const handleCloseMenu = () => {
    setIsMobileMenuOpened(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`${styles.mobileMenu} ${
        isMobileMenuOpened ? styles.open : ""
      }`}
      onClick={handleCloseMenu}
    >
      <div className={styles.mobileMenuContent} onClick={stopPropagation}>
        <div className={styles.menuHeader}>
          <div className={styles.title}>
            <p>Menu</p>
          </div>
          <div className={styles.buttonBox}>
            <IconButton
              className={styles.iconButton}
              onClick={() => setIsMobileMenuOpened(false)}
            >
              <CloseSVG className={styles.icon} />
            </IconButton>
          </div>
        </div>
        <div className={styles.menuContent}>
          <NavLink
            to="/employee/home"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.selected : ""}`
            }
            onClick={() => setIsMobileMenuOpened(false)}
          >
            <div className={styles.itemIconBox}>
              <FormSVG className={styles.icon} />
            </div>
            <div className={styles.itemText}>
              <p>Zgłoszenia</p>
            </div>
          </NavLink>
          <NavLink
            to="/employee/archive"
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.selected : ""}`
            }
            onClick={() => setIsMobileMenuOpened(false)}
          >
            <div className={styles.itemIconBox}>
              <ArchiveSVG className={styles.icon} />
            </div>
            <div className={styles.itemText}>
              <p>Archiwum zgłoszeń</p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
