import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth?.isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole) {
      const userRole = getUserRole(auth);
      const requiredRoles = Array.isArray(requiredRole)
        ? requiredRole.map((r) => r.toLowerCase())
        : [requiredRole.toLowerCase()];

      if (!userRole || !requiredRoles.includes(userRole.toLowerCase())) {
        router.replace("/");
      }
    }
  }, [auth, requiredRole, router, pathname]);

  if (!auth?.isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const userRole = getUserRole(auth);
    const requiredRoles = Array.isArray(requiredRole)
      ? requiredRole.map((r) => r.toLowerCase())
      : [requiredRole.toLowerCase()];

    if (!userRole || !requiredRoles.includes(userRole.toLowerCase())) {
      return null;
    }
  }

  return children;
};

export default ProtectedRoute;
