import useFocusEnd from "hooks/useFocusEnd";
import React, { useEffect, useState } from "react";
import formStyles from "../../../../../../scss/Form.module.scss";

export default function ZipCodeInput({
  id,
  zipCodeValue,
  onZipCodeChange,
  isTouched,
  isValid,
  errorMessage,
}) {
  const [zipCodeRef, setZipCodeFocusToEnd] = useFocusEnd();
  const [zipCode, setZipCode] = useState(zipCodeValue);

  const handleInputChange = (e) => {
    const value = e.target.value;
    let formattedZip = value.replace(/[^\d]/g, "").slice(0, 5);

    if (value.length > zipCode.length) {
      if (formattedZip.length === 2 && !zipCode.includes("-")) {
        formattedZip += "-";
      } else if (formattedZip.length > 2) {
        formattedZip = formattedZip.slice(0, 2) + "-" + formattedZip.slice(2);
      }
    } else if (value.length < zipCode.length) {
      if (zipCode.length === 3 && zipCode.endsWith("-")) {
        formattedZip = formattedZip.slice(0, 1);
      } else if (zipCode.length === 4 && zipCode.includes("-")) {
        formattedZip = formattedZip.slice(0, 2) + "-";
      } else if (zipCode.length > 4) {
        formattedZip = formattedZip.slice(0, 2) + "-" + formattedZip.slice(2);
      }
    }

    setZipCode(formattedZip);
    onZipCodeChange(formattedZip);
  };

  useEffect(() => {
    setZipCode(zipCodeValue);
  }, [zipCodeValue]);

  return (
    <input
      id={id}
      name="zipCode"
      className={`${formStyles.formInput} ${
        isTouched && !isValid
          ? formStyles.error
          : isTouched && isValid
            ? formStyles.success
            : ""
      }`}
      type="text"
      value={zipCode}
      onChange={handleInputChange}
      placeholder="XX-XXX"
      ref={zipCodeRef}
      onFocus={setZipCodeFocusToEnd}
    />
  );
}
