import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const RequireAdmin = ({ children }) => {
  const { isAdmin } = useAuth();
  const hasToken = Boolean(localStorage.getItem("access_token"));

  if (!hasToken || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAdmin;
