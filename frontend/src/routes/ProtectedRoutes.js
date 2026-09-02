import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { redirectMap } from "./routes";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate replace to="/signin" />;
  }

  if (!allowedRoles.includes(role)) {
    const redirectPath = redirectMap[role] || redirectMap.DEFAULT;
    return <Navigate replace to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;
