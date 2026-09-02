import React from "react";
import styles from "./Loader.module.scss";

function Loader({ fullScreen = false }) {
  return (
    <div
      className={`${styles.loader} ${
        fullScreen ? styles.fullScreen : styles.componentLoader
      }`}
    >
      <div
        className={`${styles.spinner} ${
          fullScreen ? styles.fullScreenSpinner : styles.componentSpinner
        }`}
      ></div>
    </div>
  );
}

export default React.memo(Loader);
