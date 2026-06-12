"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next/client";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { setupPassword } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/auth/authStore";
import { mapUserToStore } from "@/src/services/user.service";

const getSetupPasswordSchema = (t) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("newPasswordRequired") || "Mật khẩu phải chứa ít nhất 8 ký tự.")
        .regex(/[A-Z]/, t("passwordRequireUppercase") || "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa (A-Z).")
        .regex(/[a-z]/, t("passwordRequireLowercase") || "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).")
        .regex(/[0-9]/, t("passwordRequireDigit") || "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).")
        .regex(/[^A-Za-z0-9]/, t("passwordRequireSpecial") || "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt."),
      confirmPassword: z
        .string()
        .min(1, t("confirmPasswordRequired") || "Vui lòng xác nhận mật khẩu."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch") || "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
    });

const SetupPassword = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const { dispatch } = useAuthStore();
  const { notify } = useNotification();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setupPasswordSchema = useMemo(() => getSetupPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordVal = watch("password", "");

  // Real-time validation criteria helper for visual cues
  const criteria = useMemo(() => {
    return [
      { key: "minLen", label: t("passwordCriteriaText") || "Tối thiểu 8 ký tự", met: passwordVal.length >= 8 },
      { key: "upper", label: t("passwordRequireUppercase") || "Ít nhất 1 chữ hoa", met: /[A-Z]/.test(passwordVal) },
      { key: "lower", label: t("passwordRequireLowercase") || "Ít nhất 1 chữ thường", met: /[a-z]/.test(passwordVal) },
      { key: "digit", label: t("passwordRequireDigit") || "Ít nhất 1 chữ số", met: /[0-9]/.test(passwordVal) },
      { key: "special", label: t("passwordRequireSpecial") || "Ít nhất 1 ký tự đặc biệt", met: /[^A-Za-z0-9]/.test(passwordVal) },
    ];
  }, [passwordVal, t]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await setupPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (res && res.success) {
        notify("success", t("setupPasswordSuccess") || "Thiết lập mật khẩu thành công!");

        // Update cookie
        setCookie("access_token", res.data.accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });

        // Update Zustand auth store
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: mapUserToStore(res.data.user),
        });

        // Redirect to dashboard (Role-based homepage)
        const role = res.data.user.role;
        let redirectPath = "/";
        if (role === "admin") {
          redirectPath = "/admin";
        } else if (role === "partner") {
          redirectPath = "/partner";
        }

        // Use replace to avoid user going back to /setup-password on browser Back button
        router.replace(redirectPath);
      } else {
        notify("error", res.message || t("setupPasswordFailed"));
      }
    } catch (error) {
      console.error("Password setup failed:", error);
      const msg = error?.response?.data?.message || error.message || t("setupPasswordFailed");
      notify("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl backdrop-blur-md sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/70"
    >
      <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
        {t("setupPasswordTitle") || "Thiết lập mật khẩu"}
      </h2>
      
      <p className="mb-6 text-center text-sm text-slate-500 dark:text-zinc-400">
        {t("setupPasswordDesc") || "Tài khoản của bạn chưa có mật khẩu bảo mật. Vui lòng thiết lập mật khẩu để bảo vệ tài khoản và hoàn tất đăng nhập."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          id="password"
          label={t("newPassword") || "Mật khẩu mới"}
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition-colors hover:text-emerald-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...register("password")}
          disabled={loading}
        />

        {/* Real-time feedback criteria checklist for better UX */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 space-y-1.5 dark:border-zinc-800/50 dark:bg-zinc-950/20">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            {t("passwordCriteriaText") ? "Yêu cầu bảo mật:" : "Security requirements:"}
          </p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
            {criteria.map((c) => (
              <div key={c.key} className="flex items-center gap-2">
                {c.met ? (
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-550 dark:text-emerald-400" />
                ) : (
                  <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-slate-300 dark:border-zinc-700" />
                )}
                <span className={`text-xs ${c.met ? "text-emerald-650 font-medium dark:text-emerald-400" : "text-slate-400 dark:text-zinc-500"}`}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <InputField
          id="confirmPassword"
          label={t("confirmPassword") || "Xác nhận mật khẩu"}
          type={showConfirmPassword ? "text" : "password"}
          error={errors.confirmPassword?.message}
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 transition-colors hover:text-emerald-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...register("confirmPassword")}
          disabled={loading}
        />

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>{t("registering") || "Processing..."}</span>
            </div>
          ) : (
            t("setupPasswordBtn") || "Thiết lập mật khẩu"
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default SetupPassword;
