import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/src/i18n/navigation";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import { useNotification } from "@/src/components/ui/NotificationProvider";
import { forgotPassword, resetPassword } from "@/src/utils/api";

const ForgotPassword = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
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
    if (!email.trim()) newErrors.email = t("emailRequiredForgot");
    else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      newErrors.email = t("emailInvalidForgot");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const response = await forgotPassword(email);
      if (response) {
        notify("success", t("emailResetSentSuccess"));
        setEmailSent(true);
      } else {
        notify("error", t("emailResetSendFailed"));
      }
    } catch (error) {
      notify("error", error.message || t("generalError"));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = t("newPasswordRequired");
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = t("passwordsDoNotMatch");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const res = await resetPassword(token, newPassword);
      if (res && res.data.email) {
        notify("success", t("passwordChangedSuccess"));
        router.push("/login");
      } else {
        notify("error", t("passwordChangeFailed"));
      }
    } catch (error) {
      notify("error", error.message || t("invalidOrExpiredToken"));
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-sm rounded border border-gray-300 bg-white p-4 shadow">
      <h2 className="mb-4 text-center text-xl font-semibold">
        {step === 1 ? t("forgotPasswordTitle") : t("resetPasswordTitle")}
      </h2>

      {step === 1 && (
        <>
          {!emailSent ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <InputField
                id="email"
                label={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Button type="submit" text={t("sendResetLink")} />
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600">{t("resetLinkSent", { email })}</p>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <InputField
            id="newPassword"
            label={t("newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />
          <InputField
            id="confirmPassword"
            label={t("confirmPassword")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          <Button type="submit" text={t("changePasswordBtn")} />
        </form>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline"
        >
          {t("backToLogin")}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
