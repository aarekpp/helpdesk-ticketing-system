import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import "./scss/index.scss";
import { NotificationProvider } from "context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NotificationProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </NotificationProvider>,
);
reportWebVitals();
