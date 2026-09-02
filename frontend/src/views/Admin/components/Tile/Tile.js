import React from "react";
import styles from "./Tile.module.scss";
import { ReactComponent as EditSVG } from "../../../../icons/edit.svg";
import { ReactComponent as DeleteSVG } from "../../../../icons/delete.svg";
import { format } from "date-fns";

const Tile = ({
  title,
  data,
  keysToShow = null,
  keyMappings = {},
  nullReplacements = {},
  onEdit,
  onDelete,
}) => {
  const keys = keysToShow || Object.keys(data);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm:ss");
  };

  const formatValue = (key) => {
    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    };

    const value = getNestedValue(data, key);
    const mapping = keyMappings[key];

    if (value === null || value === undefined) {
      return nullReplacements[key] || "Brak danych";
    }

    if (mapping?.transform) {
      return mapping.transform(value);
    }

    if (
      typeof value === "string" &&
      !/[a-zA-Z]/.test(value) &&
      !isNaN(Date.parse(value))
    ) {
      return formatDate(value);
    }

    if (Array.isArray(value)) {
      return `Liczba elementów: ${value.length}`;
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <div className={styles.tile}>
      <div className={styles.tileInfo}>
        <div className={styles.tileHeader}>
          <h1>{title || "Brak nazwy"}</h1>
        </div>
        <div className={styles.tileData}>
          {keys.map((key) => (
            <p key={key}>
              {`${keyMappings[key]?.label || key}: ${formatValue(key)}`}
            </p>
          ))}
        </div>
      </div>
      <div className={styles.tileButtons}>
        {onEdit && (
          <button
            type="button"
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => onEdit(data.id)}
          >
            <div className={styles.iconBox}>
              <EditSVG className={styles.icon} />
            </div>
            <span>Edytuj</span>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={() => onDelete(data.id)}
          >
            <div className={styles.iconBox}>
              <DeleteSVG className={styles.icon} />
            </div>
            <span>Usuń</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Tile;
