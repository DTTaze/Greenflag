import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

import Loader from "../components/ui/Loader";
import { getUserApi } from "../utils/api";

const AuthCallback = () => {
  const router = useRouter();
  const { dispatch } = useAuthStore();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (window.location.pathname === "/auth/success") {
      const fetchUser = async () => {
        try {
          const res = await getUserApi();
          if (res && res.status === 200) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: res.data,
            });
            if (res.data.avatar_url) {
              localStorage.setItem("user_avatar_url", res.data.avatar_url);
            }
            router.replace("/");
          } else {
            alert("Login failed!");
            router.push("/login");
          }
        } catch (err) {
          console.error("Failed to fetch user info after login:", err);
          alert("Login failed!");
          router.push("/login");
        }
      };

      fetchUser();
    } else {
      alert("Login failed!");
      router.push("/login");
    }
    handled.current = true;
  }, [router, dispatch]);

  return (
    <div style={styles.spinnerWrapper}>
      <Loader />
    </div>
  );
};
const styles = {
  spinnerWrapper: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};
export default AuthCallback;
