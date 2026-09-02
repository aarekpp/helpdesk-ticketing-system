import React, { useEffect, useRef, useState } from "react";
import styles from "./SortSelect.module.scss";
import { ReactComponent as ArrowUpSvg } from "../../../../icons/arrow_up.svg";
import { ReactComponent as ArrowDownSvg } from "../../../../icons/arrow_down.svg";

const SortSelect = ({ fields, sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);
  const selectedOptionRef = useRef(null);

  useEffect(() => {
    const initialOption = fields.find(
      (field) =>
        `${field.key}-asc` === sortBy || `${field.key}-desc` === sortBy,
    );
    if (initialOption) {
      setSelectedOption({
        name: `${initialOption.label} - ${
          sortBy.includes("asc") ? "Rosnąco" : "Malejąco"
        }`,
        value: sortBy,
      });
    }
  }, [sortBy, fields]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelectOption = (value, label) => {
    setSelectedOption({ name: label, value });
    setSortBy(value);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideEvent = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideEvent);
    document.addEventListener("touchstart", handleOutsideEvent);
    document.addEventListener("scroll", handleOutsideEvent, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideEvent);
      document.removeEventListener("touchstart", handleOutsideEvent);
      document.removeEventListener("scroll", handleOutsideEvent, true);
    };
  }, []);

  return (
    <div className={styles.sortSelect} ref={selectRef}>
      <div
        className={`${styles.selectBox} ${isOpen ? styles.open : ""}`}
        onClick={toggleDropdown}
      >
        <p className={styles.selectedItem}>
          {selectedOption ? selectedOption.name : "Sortowanie"}
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
          {fields.map((field) => (
            <React.Fragment key={field.key}>
              <p
                ref={
                  selectedOption?.value === `${field.key}-asc`
                    ? selectedOptionRef
                    : null
                }
                className={`${styles.option} ${
                  selectedOption?.value === `${field.key}-asc`
                    ? styles.selected
                    : ""
                }`}
                onClick={() =>
                  handleSelectOption(
                    `${field.key}-asc`,
                    `${field.label} - Rosnąco`,
                  )
                }
              >
                {field.label} - Rosnąco
              </p>
              <p
                ref={
                  selectedOption?.value === `${field.key}-desc`
                    ? selectedOptionRef
                    : null
                }
                className={`${styles.option} ${
                  selectedOption?.value === `${field.key}-desc`
                    ? styles.selected
                    : ""
                }`}
                onClick={() =>
                  handleSelectOption(
                    `${field.key}-desc`,
                    `${field.label} - Malejąco`,
                  )
                }
              >
                {field.label} - Malejąco
              </p>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortSelect;
