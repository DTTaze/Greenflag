import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { loginUser } from "@/src/services/auth.service";
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
      const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
        values.identifier,
      );
      const loginData = isEmail
        ? { email: values.identifier, password: values.password }
        : { username: values.identifier, password: values.password };

      const res = await loginUser(loginData);
      if (res && res.status === 200) {
        notify("success", t("loginSuccess"));
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data.user,
        });

        const roleId = res.data.user.role_id;
        if (roleId === 1) {
          router.push("/admin");
        } else if (roleId === 2) {
          router.push("/");
        } else if (roleId === 3) {
          router.push("/customer");
        } else {
          notify("error", t("generalError"));
        }
      } else {
        notify("error", res.error || t("loginFailed"));
      }
    } catch (error: any) {
      if (error.status === 401) {
        notify("error", t("invalidCredentials"));
      } else if (error.status === 429) {
        notify("error", t("tooManyRequests"));
        setIsLoginDisabled(true);
        setTimeout(() => {
          setIsLoginDisabled(false);
          notify("info", t("tryAgainNow"));
        }, 300000);
      } else {
        notify("error", error.message || t("generalError"));
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
