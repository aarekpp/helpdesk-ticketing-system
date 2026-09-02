import React from "react";
import formStyles from "../../../scss/Form.module.scss";

export default function UserFormInfoSection() {
  return (
    <div className={formStyles.infoSection}>
      <p>Wymagania dla Imienia:</p>
      <ul className={formStyles.list}>
        <li className={formStyles.listElement}>Małe i wielkie litery</li>
        <li className={formStyles.listElement}>
          Ilość znaków z zakresu 2 - 50
        </li>
      </ul>
      <p>Wymagania dla Nazwiska:</p>
      <ul className={formStyles.list}>
        <li className={formStyles.listElement}>Małe i wielkie litery</li>
        <li className={formStyles.listElement}>
          Znaki specjalne takie jak znak pusty oraz ' -
        </li>
        <li className={formStyles.listElement}>
          Ilość znaków z zakresu 2 - 100
        </li>
      </ul>
      <p>Wymagania dla adresu e-mail:</p>
      <ul className={formStyles.list}>
        <li className={formStyles.listElement}>Musi być unikalny</li>
        <li className={formStyles.listElement}>
          Spełniać kryteria adresu e-mail
        </li>
      </ul>
      <p>Wymagania dla nazwy użytkownika:</p>
      <ul className={formStyles.list}>
        <li className={formStyles.listElement}>Musi być unikalna</li>
        <li className={formStyles.listElement}>Małe i wielkie litery</li>
        <li className={formStyles.listElement}>Cyfry</li>
        <li className={formStyles.listElement}>
          Znaki specjalne takie jak - _ .
        </li>
        <li className={formStyles.listElement}>
          Wymagana ilość znaków z zakresu 3 - 50
        </li>
      </ul>
      <p>Hasło powinno być złożone co najmniej z:</p>
      <ul className={formStyles.list}>
        <li className={formStyles.listElement}>8 znaków</li>
        <li className={formStyles.listElement}>Małej litery</li>
        <li className={formStyles.listElement}>Wielkiej litery</li>
        <li className={formStyles.listElement}>Cyfry</li>
        <li className={formStyles.listElement}>
          Znaku specjalnego takiego jak ! @ # $ % ^ & *
        </li>
      </ul>
    </div>
  );
}
