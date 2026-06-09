import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:p-8"
    >
      <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
        {step === 1 ? t("forgotPasswordTitle") : t("resetPasswordTitle")}
      </h2>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            {!emailSent ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <InputField
                  id="email"
                  label={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
                >
                  {t("sendResetLink")}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-4 animate-bounce" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {t("resetLinkSent", { email })}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
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
              <Button
                type="submit"
                className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
              >
                {t("changePasswordBtn")}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center border-t border-slate-100 dark:border-zinc-800/80 pt-4">
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t("backToLogin")}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
