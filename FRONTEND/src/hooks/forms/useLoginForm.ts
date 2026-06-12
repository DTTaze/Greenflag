import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { login, socialLoginCallback } from "@/src/services/auth";
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
  const [isSocialLoggingIn, setIsSocialLoggingIn] = useState(false);

  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const code = searchParams.get("code");
  const hasFetched = useRef(false);

  useEffect(() => {
    const handleSocialAuth = async () => {
      if (provider === "GOOGLE" && code && !hasFetched.current) {
        hasFetched.current = true;
        setIsSocialLoggingIn(true);
        try {
          const res = await socialLoginCallback("GOOGLE", code);
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

            if (res.data.requirePasswordSetup) {
              router.replace("/setup-password");
            } else {
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
            }
          } else {
            notify("error", res.message || t("loginFailed"));
            router.replace("/login");
          }
        } catch (error: any) {
          console.error("Social login verification failed:", error);
          const message = error?.response?.data?.message || error.message;
          notify("error", message || t("loginFailed"));
          router.replace("/login");
        } finally {
          setIsSocialLoggingIn(false);
        }
      }
    };

    handleSocialAuth();
  }, [provider, code, router, dispatch, notify, t]);

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
    isSocialLoggingIn,
    setValue: form.setValue,
    watch: form.watch,
  };
};
