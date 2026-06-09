import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { registerUser } from "@/src/services/auth.service";

const getRegisterSchema = (t: any) =>
  z.object({
    full_name: z
      .string()
      .min(1, t("fullNameRequired"))
      .regex(/^[a-zA-ZÀ-ỹà-ỹ\s]+$/, t("fullNameInvalid")),
    username: z
      .string()
      .min(1, t("usernameRequired"))
      .regex(/^[a-zA-Z0-9]+$/, t("usernameInvalid")),
    role_id: z.number({ message: t("roleRequired") }),
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });

export type RegisterFormValues = {
  full_name: string;
  username: string;
  role_id: number;
  email: string;
  password: string;
};

export const useRegisterForm = () => {
  const router = useRouter();
  const t = useTranslations("auth");
  const { notify } = useNotification() as any;
  const [loading, setLoading] = useState(false);

  const registerSchema = useMemo(() => getRegisterSchema(t), [t]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      role_id: 2,
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const res = await registerUser(values);
      if (res?.status === 200) {
        router.push("/login");
        notify("success", t("registerSuccess"));
      } else {
        notify("error", res?.error || t("registerFailed"));
      }
    } catch (e: any) {
      notify("error", e.message || t("registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    loading,
    setValue: form.setValue,
    watch: form.watch,
  };
};
