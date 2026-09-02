import React from "react";
import styles from "./Button.module.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AddSVG } from "../../../../icons/add.svg";

const typeMapping = {
  service: {
    path: "/admin/services/add-service",
    text: "Dodaj usługę",
  },
  admin: {
    path: "/admin/admins/add-admin",
    text: "Dodaj administratora",
  },
  employee: {
    path: "/admin/employees/add-employee",
    text: "Dodaj pracownika",
  },
  client: {
    path: "/admin/clients/add-client",
    text: "Dodaj klienta",
  },
  manager: {
    path: "/admin/managers/add-manager",
    text: "Dodaj menadżera",
  },
  company: {
    path: "/admin/companies/add-company",
    text: "Dodaj firmę",
  },
};

export default function AddButton({ type }) {
  const navigate = useNavigate();
  const { path, text } = typeMapping[type] || { path: "", text: "Dodaj" };

  if (!path) {
    return null;
  }

  return (
    <div className={styles.buttonBox}>
      <button
        type="button"
        className={styles.button}
        onClick={() => navigate(path)}
      >
        <div className={styles.iconBox}>
          <AddSVG className={styles.icon} />
        </div>
        <span>{text}</span>
      </button>
    </div>
  );
}
