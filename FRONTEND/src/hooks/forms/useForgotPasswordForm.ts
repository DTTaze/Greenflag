import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { forgotPassword, resetPassword } from "@/src/services/auth";

const getRequestResetSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .min(1, t("emailRequiredForgot"))
      .email(t("emailInvalidForgot")),
  });

const getResetPasswordSchema = (t: any) =>
  z
    .object({
      email: z
        .string()
        .min(1, t("emailRequiredForgot"))
        .email(t("emailInvalidForgot")),
      otpCode: z
        .string()
        .min(6, t("otpInvalid") || "OTP must be exactly 6 characters.")
        .max(6, t("otpInvalid") || "OTP must be exactly 6 characters."),
      newPassword: z.string().min(8, t("passwordRequired")),
      confirmNewPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: t("passwordsDoNotMatch"),
    });

export type RequestResetValues = {
  email: string;
};

export type ResetPasswordValues = {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const useForgotPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const { notify } = useNotification() as any;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const otpCodeParam = searchParams.get("otpCode");
  const emailParam = searchParams.get("email");

  useEffect(() => {
    if (otpCodeParam) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [otpCodeParam]);

  const requestForm = useForm<RequestResetValues>({
    resolver: zodResolver(useMemo(() => getRequestResetSchema(t), [t])),
    defaultValues: {
      email: emailParam || "",
    },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(useMemo(() => getResetPasswordSchema(t), [t])),
    defaultValues: {
      email: emailParam || "",
      otpCode: otpCodeParam || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Sync url search parameters if they change
  useEffect(() => {
    if (emailParam) {
      requestForm.setValue("email", emailParam);
      resetForm.setValue("email", emailParam);
    }
    if (otpCodeParam) {
      resetForm.setValue("otpCode", otpCodeParam);
    }
  }, [emailParam, otpCodeParam, requestForm, resetForm]);

  const handleRequestReset = async (values: RequestResetValues) => {
    setLoading(true);
    try {
      const res = await forgotPassword({ email: values.email });
      if (res && res.success) {
        notify("success", t("emailResetSentSuccess"));
        setEmailSent(true);
        // Pre-populate email for step 2 in case they manually navigate/submit
        resetForm.setValue("email", values.email);
      } else {
        notify("error", res.message || t("emailResetSendFailed"));
      }
    } catch (error: any) {
      notify(
        "error",
        error.response?.data?.message || error.message || t("generalError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetPasswordValues) => {
    setLoading(true);
    try {
      const res = await resetPassword({
        email: values.email,
        otpCode: values.otpCode,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      if (res && res.success) {
        notify("success", t("passwordChangedSuccess"));
        router.push("/login");
      } else {
        notify("error", res.message || t("passwordChangeFailed"));
      }
    } catch (error: any) {
      notify(
        "error",
        error.response?.data?.message ||
          error.message ||
          t("invalidOrExpiredToken"),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    loading,
    emailSent,
    requestForm,
    resetForm,
    handleRequestReset: requestForm.handleSubmit(handleRequestReset),
    handleResetPassword: resetForm.handleSubmit(handleResetPassword),
  };
};
