import React from "react";
import styles from "./Home.module.scss";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AdminSVG } from "../../../../icons/admin.svg";
import { ReactComponent as EmplyeeSVG } from "../../../../icons/employee.svg";
import { ReactComponent as ClientsSVG } from "../../../../icons/clients.svg";
import { ReactComponent as CompanySVG } from "../../../../icons/company.svg";
import { ReactComponent as ServicesSVG } from "../../../../icons/services.svg";

export default function Home() {
  const navigate = useNavigate();

  const tiles = [
    {
      path: "admins",
      icon: <AdminSVG className={styles.icon} />,
      text: "Administratorzy",
    },
    {
      path: "employees",
      icon: <EmplyeeSVG className={styles.icon} />,
      text: "Pracownicy",
    },
    {
      path: "clients",
      icon: <ClientsSVG className={styles.icon} />,
      text: "Klienci",
    },
    {
      path: "services",
      icon: <ServicesSVG className={styles.icon} />,
      text: "Usługi",
    },
    {
      path: "companies",
      icon: <CompanySVG className={styles.icon} />,
      text: "Firmy",
    },
  ];

  const handleClick = (path) => {
    navigate("/admin/" + path);
  };

  return (
    <div className={styles.adminHomeContainer}>
      {tiles.map(({ path, icon, text }) => (
        <div key={path} className={styles.tile}>
          <button
            type="button"
            className={styles.tileButton}
            onClick={() => handleClick(path)}
          >
            {icon}
            <p className={styles.tileText}>{text}</p>
          </button>
        </div>
      ))}
    </div>
  );
}
