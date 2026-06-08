import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AuthContext } from "../../contexts/auth.context";

const roleMap = {
  1: "Admin",
  2: "User",
  3: "Customer",
};

const getUserRole = (auth) => {
  const roleId = auth?.user?.roles?.id;
  return roleMap[roleId] || null;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requiredRole) {
    return children;
  }

  const userRole = getUserRole(auth);

  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole.map((r) => r.toLowerCase())
    : [requiredRole.toLowerCase()];

  if (!userRole || !requiredRoles.includes(userRole.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
