"use client";

import NextLink from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

// Context to simulate react-router's Outlet context
const OutletContext = createContext<unknown>(null);

// 1. useNavigate shim
export const useNavigate = () => {
  const router = useRouter();

  return (
    to: string | number,
    options?: { replace?: boolean; state?: unknown },
  ) => {
    if (typeof to === "number") {
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
      return;
    }

    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

// 2. useLocation shim
export const useLocation = () => {
  const pathname = usePathname() || "/";
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : "";

  return {
    pathname,
    search,
    hash: "",
    state: null as unknown,
  };
};

// 3. useSearchParams shim
export const useSearchParams = (): [
  URLSearchParams,
  (params: URLSearchParams | string | Record<string, string>) => void,
] => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams = new URLSearchParams(
    searchParams ? searchParams.toString() : "",
  );

  const setSearchParams = (
    params: URLSearchParams | string | Record<string, string>,
  ) => {
    const nextParams = new URLSearchParams(params as Record<string, string>);
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  return [currentParams, setSearchParams];
};

// 4. Link shim
export const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NextLink> & { to?: string }
>(({ to, children, href, ...props }, ref) => {
  return (
    <NextLink ref={ref} href={to || href || "/"} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = "Link";

// 5. NavLink shim
export const NavLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentPropsWithoutRef<typeof NextLink>, "className"> & {
    to?: string;
    className?: string | ((props: { isActive: boolean }) => string);
  }
>(({ to, className, children, href, ...props }, ref) => {
  const pathname = usePathname() || "/";
  const isActive =
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));

  const computedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink
      ref={ref}
      href={to || href || "/"}
      className={computedClassName}
      {...props}
    >
      {children}
    </NextLink>
  );
});
NavLink.displayName = "NavLink";

// 6. Outlet shim
export const Outlet = ({
  context,
  children,
}: {
  context?: unknown;
  children?: React.ReactNode;
}) => {
  return (
    <OutletContext.Provider value={context}>{children}</OutletContext.Provider>
  );
};

// 7. useOutletContext shim
export const useOutletContext = <T = unknown,>(): T => {
  return useContext(OutletContext) as T;
};

// 8. Navigate shim
export const Navigate = ({
  to,
  replace,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);

  return null;
};

// Mocks for Routes and Route to avoid import errors, though they won't be actively routing
export const Routes = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

export const Route = ({
  element,
}: {
  path?: string;
  element?: React.ReactNode;
}) => {
  return <>{element}</>;
};
