import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { register, resendEmail, verifyOtp } from "@/src/services/auth";

const getRegisterSchema = (t: any) =>
  z
    .object({
      username: z
        .string()
        .min(1, t("usernameRequired"))
        .regex(/^[a-zA-Z0-9]+$/, t("usernameInvalid")),
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      password: z
        .string()
        .min(1, t("passwordRequired"))
        .min(
          8,
          t("passwordCriteriaText") ||
            "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.",
        )
        .regex(
          /[A-Z]/,
          t("passwordRequireUppercase") ||
            "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa (A-Z).",
        )
        .regex(
          /[a-z]/,
          t("passwordRequireLowercase") ||
            "Mật khẩu phải chứa ít nhất 1 chữ cái viết thường (a-z).",
        )
        .regex(
          /[0-9]/,
          t("passwordRequireDigit") ||
            "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).",
        )
        .regex(
          /[^A-Za-z0-9]/,
          t("passwordRequireSpecial") ||
            "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.",
        ),
      confirmPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("passwordsDoNotMatch"),
    });

export type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegisterForm = () => {
  const router = useRouter();
  const t = useTranslations("auth");
  const { notify } = useNotification() as any;
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // OTP verify states
  const [otpLoading, setOtpLoading] = useState(false);

  const registerSchema = useMemo(() => getRegisterSchema(t), [t]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        username: values.username,
        password: values.password,
      };

      const res = await register(payload);
      if (res && res.success) {
        setRegisteredEmail(values.email);
        setIsSubmitted(true);
        notify("success", t("registerSuccess"));
      } else {
        notify("error", res.message || t("registerFailed"));
      }
    } catch (e: any) {
      notify(
        "error",
        e.response?.data?.message || e.message || t("registerFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!code || code.length !== 6) {
      notify("error", t("otpInvalid"));
      return;
    }

    setOtpLoading(true);
    try {
      const res = await verifyOtp({
        usernameOrEmail: registeredEmail,
        code,
        action: "register",
      });

      if (res && res.success) {
        notify(
          "success",
          t("verifySuccess") || "Account verified successfully!",
        );
        router.push("/login");
      } else {
        notify("error", res.message || t("verifyFailed"));
      }
    } catch (e: any) {
      notify(
        "error",
        e.response?.data?.message || e.message || t("verifyFailed"),
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await resendEmail({ email: registeredEmail });
      if (res && res.success) {
        notify(
          "success",
          t("otpResentSuccess") || "OTP code resent successfully!",
        );
      } else {
        notify("error", res.message || t("otpResendFailed"));
      }
    } catch (e: any) {
      notify(
        "error",
        e.response?.data?.message || e.message || t("otpResendFailed"),
      );
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    loading,
    isSubmitted,
    registeredEmail,
    handleVerifyOtp,
    handleResendOtp,
    otpLoading,
    setValue: form.setValue,
    watch: form.watch,
  };
};
