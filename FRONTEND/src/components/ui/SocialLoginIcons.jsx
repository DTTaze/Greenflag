import "../../styles/components/SocialLoginIcons.css";
import { VITE_BACKEND_URL } from "../../config/env.js";

const SocialLoginIcons = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${VITE_BACKEND_URL}/api/auth/login/google`;
  };

  return (
    <ul className="wrapper flex gap-4 justify-center my-4">
      <li
        className="icon gmail flex flex-col items-center cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <span className="tooltip text-sm">Google</span>
        <i className="fab fa-google text-lg"></i>
      </li>

      <li className="icon apple flex flex-col items-center cursor-pointer">
        <span className="tooltip text-sm">Apple</span>
        <i className="fab fa-apple text-lg"></i>
      </li>

      <li className="icon facebook flex flex-col items-center cursor-pointer">
        <span className="tooltip text-sm">Facebook</span>
        <i className="fab fa-facebook-f text-lg"></i>
      </li>
    </ul>
  );
};

export default SocialLoginIcons;
