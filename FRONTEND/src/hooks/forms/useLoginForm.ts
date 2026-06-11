import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { login } from "@/src/services/auth";
import { mapUserToStore } from "@/src/services/user.service";
import { useAuthStore } from "@/src/store/auth/authStore";

const getLoginSchema = (t: any) =>
  z.object({
    identifier: z.string().min(1, t("emailOrUsernameRequired")),
    password: z.string().min(1, t("passwordRequired")),
  });

export type LoginFormValues = {
  identifier: string;
  password: string;
};

export const useLoginForm = () => {
  const router = useRouter();
  const t = useTranslations("auth");
  const { dispatch } = useAuthStore();
  const { notify } = useNotification() as any;
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  const loginSchema = useMemo(() => getLoginSchema(t), [t]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const loginData = {
        usernameOrEmail: values.identifier,
        password: values.password,
      };

      const res = await login(loginData);
      if (res && res.success) {
        notify("success", t("loginSuccess"));

        // Save access token to cookie
        setCookie("access_token", res.data.accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        }); // 7 days

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: mapUserToStore(res.data.user),
        });

        const role = res.data.user.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "user") {
          router.push("/");
        } else if (role === "partner") {
          router.push("/partner");
        } else {
          notify("error", t("generalError"));
        }
      } else {
        notify("error", res.message || t("loginFailed"));
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (status === 401) {
        notify("error", message || t("invalidCredentials"));
      } else if (status === 429) {
        notify("error", t("tooManyRequests"));
        setIsLoginDisabled(true);
        setTimeout(() => {
          setIsLoginDisabled(false);
          notify("info", t("tryAgainNow"));
        }, 300000);
      } else {
        notify("error", message || error.message || t("generalError"));
      }
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isLoginDisabled,
    setValue: form.setValue,
    watch: form.watch,
  };
};
