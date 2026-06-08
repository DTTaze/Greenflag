import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

const roleMap = {
  1: "Admin",
  2: "User",
  3: "Customer",
};

const getUserRole = (user) => {
  const roleId = user?.roles?.id;
  return roleMap[roleId] || null;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole) {
      const userRole = getUserRole(user);
      const requiredRoles = Array.isArray(requiredRole)
        ? requiredRole.map((r) => r.toLowerCase())
        : [requiredRole.toLowerCase()];

      if (!userRole || !requiredRoles.includes(userRole.toLowerCase())) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, requiredRole, router, pathname]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const userRole = getUserRole(user);
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
