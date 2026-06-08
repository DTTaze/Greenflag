import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../components/ui/Loader";
import { AuthContext } from "../contexts/auth.context";
import { getUserApi } from "../utils/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (window.location.pathname === "/auth/success") {
      const fetchUser = async () => {
        try {
          const res = await getUserApi();
          if (res && res.status === 200) {
            setAuth({
              isAuthenticated: true,
              user: res.data,
            });
            if (res.data.avatar_url) {
              localStorage.setItem("user_avatar_url", res.data.avatar_url);
            }
            navigate("/", { replace: true });
          } else {
            alert("Login failed!");
            navigate("/login");
          }
        } catch (err) {
          console.error("Failed to fetch user info after login:", err);
          alert("Login failed!");
          navigate("/login");
        }
      };

      fetchUser();
    } else {
      alert("Login failed!");
      navigate("/login");
    }
    handled.current = true;
  }, [navigate, setAuth]);

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
