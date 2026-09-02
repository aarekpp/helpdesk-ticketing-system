import React, { useEffect, useState } from "react";
import styles from "./CustomSelect.module.scss";
import { ReactComponent as ArrowUpSvg } from "../../../../icons/arrow_up.svg";
import { ReactComponent as ArrowDownSvg } from "../../../../icons/arrow_down.svg";

export default function CustomSelect({ show, data, onAccept, onCancel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectOption = (item) => {
    setSelectedOption(item);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedOption(null);
  }, [show, data]);

  return (
    <div className={`${styles.customSelect} ${show ? styles.show : ""}`}>
      <div
        className={`${styles.selectBox} ${isOpen ? styles.open : ""}`}
        onClick={toggleDropdown}
      >
        <p className={styles.selectedItem}>
          {selectedOption ? selectedOption.name : "Wybierz"}
        </p>
        <div className={styles.arrowIconBox}>
          {isOpen ? (
            <ArrowUpSvg className={styles.icon} />
          ) : (
            <ArrowDownSvg className={styles.icon} />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={`${styles.options} ${isOpen ? styles.show : ""}`}>
          {data.map((item, index) => (
            <p
              key={index}
              className={styles.option}
              onClick={() => handleSelectOption(item)}
            >
              {item.name}
            </p>
          ))}
        </div>
      )}

      <div className={styles.buttonsBox}>
        <button
          className={`${styles.button} ${styles.acceptButton}`}
          type="button"
          onClick={() => onAccept(selectedOption)}
          disabled={!selectedOption}
        >
          Akceptuj
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          type="button"
          onClick={onCancel}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}
