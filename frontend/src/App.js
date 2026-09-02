import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebFont from "webfontloader";
import { setFontLoaded, stopLoading } from "./redux/LoadingSlice";
import { setLoginState } from "./redux/AuthSlice";
import Loader from "./components/Loader/Loader";
import ChangePasswordPopup from "./components/ChangePasswordPopup/ChangePasswordPopup";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import SignIn from "./views/SignIn/SignIn";
import AdminRouting from "./views/Admin/AdminRouting";
import EmployeeRouting from "./views/Employee/EmployeeRouting";
import ClientRouting from "./views/Client/ClientRouting";
import AuthService from "api/AuthService";
import { redirectMap } from "routes/routes";
import ProtectedRoute from "routes/ProtectedRoutes";
import RouteManager from "routes/RouteManager";
import NotificationContext from "context/NotificationContext";
import EmployeeService from "api/EmployeeService";
import ClientService from "api/ClientService";
import { setUser } from "./redux/UserSlice";

export default function App() {
  const { addNotification } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const { isLoading, fontLoaded } = useSelector((state) => state.loading);
  const { role, isLoggedIn, isFirstLogin } = useSelector((state) => state.auth);
  const [tokenVerified, setTokenVerified] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      WebFont.load({
        google: {
          families: ["Roboto:300,500,700", "sans-serif"],
        },
        active: () => dispatch(setFontLoaded()),
      });

      if (!isLoggedIn && !tokenVerified) {
        const response = await AuthService.verifyToken();
        if (response && response.data) {
          if (response.data.role === "EMPLOYEE") {
            const employeeResponse = await EmployeeService.getEmployeeById(
              response.data.userId,
              addNotification,
            );
            if (employeeResponse && employeeResponse.status === 200) {
              dispatch(
                setUser({
                  currentUser: employeeResponse.data.data,
                }),
              );
            }
          } else if (response.data.role === "CLIENT") {
            const clientResponse =
              await ClientService.getClientWithCompanyDataById(
                response.data.userId,
                addNotification,
              );
            if (clientResponse && clientResponse.status === 200) {
              dispatch(
                setUser({
                  currentUser: clientResponse.data.data,
                }),
              );
            }
          }
          dispatch(
            setLoginState({
              isLoggedIn: true,
              role: response.data.role,
              isFirstLogin: response.data.isFirstLogin,
              userId: response.data.userId,
            }),
          );
        }
        setTokenVerified(true);
      }
    };

    loadResources();
  }, [dispatch, isLoggedIn, tokenVerified]);

  useEffect(() => {
    if (fontLoaded && tokenVerified) {
      dispatch(stopLoading());
    }
  }, [dispatch, fontLoaded, tokenVerified]);

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!isLoading && isFirstLogin) {
    return <ChangePasswordPopup />;
  }

  return (
    <Router>
      <RouteManager />
      <Routes>
        <Route path="/" element={<Navigate replace to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminRouting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeRouting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <ClientRouting />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate replace to={redirectMap[role] || "/signin"} />}
        />
      </Routes>
    </Router>
  );
}
