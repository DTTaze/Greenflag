import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useRouter } from "@/src/i18n/navigation";
import { loginUser } from "@/src/services/auth.service";
import { useAuthStore } from "@/src/store/auth/authStore";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc username."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const router = useRouter();
  const { dispatch } = useAuthStore();
  const { notify } = useNotification() as any;
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

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
        notify("success", "Đăng nhập thành công!");
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
          notify("error", "Đã xảy ra lỗi, vui lòng thử lại sau");
        }
      } else {
        notify("error", res.error || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error: any) {
      if (error.status === 401) {
        notify("error", "Thông tin đăng nhập không đúng");
      } else if (error.status === 429) {
        notify("error", "Quá nhiều yêu cầu, vui lòng thử lại sau 5 phút");
        setIsLoginDisabled(true);
        setTimeout(() => {
          setIsLoginDisabled(false);
          notify("info", "Bạn có thể thử đăng nhập lại bây giờ");
        }, 300000);
      } else {
        notify("error", error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
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
