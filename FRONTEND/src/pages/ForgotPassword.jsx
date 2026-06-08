import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "../components/ui/NotificationProvider";
import { forgotPasswordApi, resetPasswordApi } from "../utils/api";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useNotification();
  const token = searchParams.get("token"); 
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); 
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (token) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [token]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Vui lòng nhập email.";
    else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      newErrors.email = "Email không hợp lệ.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const response = await forgotPasswordApi(email);
      if (response) {
        notify("success", "Link đặt lại mật khẩu đã được gửi đến email của bạn!");
        setEmailSent(true);
      } else {
        notify("error", "Không thể gửi email, vui lòng thử lại.");
      }
    } catch (error) {
      notify("error", error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const res = await resetPasswordApi(token, newPassword);
      if (res && res.data.email) {
        notify("success", "Mật khẩu đã được thay đổi thành công!");
        navigate("/login");
      } else {
        notify("error", "Đổi mật khẩu thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      notify("error", error.message || "Token không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border border-gray-300 rounded shadow bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">
        {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
      </h2>

      {step === 1 && (
        <>
          {!emailSent ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <InputField
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Button text="Gửi link đặt lại" />
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600">
                Link đặt lại mật khẩu đã được gửi đến {email}. Vui lòng kiểm tra email của bạn!
              </p>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <InputField
            id="newPassword"
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <InputField
            id="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          <Button text="Đổi mật khẩu" />
        </form>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:underline"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;