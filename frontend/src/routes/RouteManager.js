import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { redirectMap } from "./routes";

const RouteManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  useEffect(() => {
    const homePath = redirectMap[role] || redirectMap.DEFAULT;
    const shouldRedirect =
      isLoggedIn && !location.pathname.startsWith(homePath.split("/home")[0]);

    if (shouldRedirect) {
      navigate(homePath, { replace: true });
    }
  }, [isLoggedIn, role, navigate, location.pathname]);

  return null;
};

export default RouteManager;
