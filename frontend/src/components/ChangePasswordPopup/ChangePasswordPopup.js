import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFirstLoginState } from "../../redux/AuthSlice";
import BaseUserService from "api/BaseUserService";
import styles from "./ChangePasswordPopup.module.scss";
import formStyles from "../../scss/Form.module.scss";

export default function ChangePasswordPopup() {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (newPassword.length > 0) {
      setIsPasswordValid(validatePassword(newPassword));
      setDoPasswordsMatch(newPassword === confirmNewPassword);
    }
  }, [newPassword, confirmNewPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setPasswordError("Podaj obecne hasło.");
      return;
    }

    if (isPasswordValid && doPasswordsMatch) {
      const dataToSend = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
      const response = await BaseUserService.changePassword(dataToSend);
      if (response.status === 200) {
        dispatch(setFirstLoginState(false));
      } else {
        setPasswordError("Niepoprawne dane do zmiany hasła.");
      }
    } else {
      setPasswordError(
        "Hasło nie spełnia wymagań lub hasła nie są identyczne.",
      );
    }
  };

  return (
    <div className={styles.changePasswordPopupBox}>
      <header>
        <h1>Ustaw nowe hasło</h1>
      </header>
      <main>
        <form className={formStyles.form} onSubmit={handleSubmit}>
          <div className={formStyles.formSection}>
            <label htmlFor="current-password" className={formStyles.formLabel}>
              Obecne hasło
            </label>
            <input
              type="password"
              id="current-password"
              className={`${formStyles.formInput} ${
                !currentPassword && passwordError ? styles.error : ""
              }`}
              autoComplete="off"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className={formStyles.formSection}>
            <label htmlFor="new-password" className={formStyles.formLabel}>
              Nowe hasło
            </label>
            <input
              type="password"
              id="new-password"
              className={`${formStyles.formInput} ${
                isPasswordValid ? formStyles.success : formStyles.error
              }`}
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className={formStyles.formSection}>
            <label
              htmlFor="new-password-confirm"
              className={formStyles.formLabel}
            >
              Powtórz nowe hasło
            </label>
            <input
              type="password"
              id="new-password-confirm"
              className={`${formStyles.formInput} ${
                doPasswordsMatch ? formStyles.success : formStyles.error
              }`}
              autoComplete="new-password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          {passwordError && (
            <p className={formStyles.errorInfo}>{passwordError}</p>
          )}
          <div
            className={`${formStyles.formSection} ${formStyles.buttonSection}`}
          >
            <button type="submit" className={formStyles.button}>
              Zapisz
            </button>
          </div>
        </form>
        <div className={formStyles.infoSection}>
          <p>Hasło powinno zawierać:</p>
          <ul className={formStyles.list}>
            <li className={formStyles.listElement}>Minimum 8 znaków</li>
            <li className={formStyles.listElement}>
              Co najmniej jedną wielką i jedną małą literę
            </li>
            <li className={formStyles.listElement}>Co najmniej jedną cyfrę</li>
            <li className={formStyles.listElement}>
              Co najmniej jeden znak specjalny: ! @ # $ % ^ & *
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
