import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { registerUser } from "@/src/services/auth.service";

const registerSchema = z.object({
  full_name: z
    .string()
    .min(1, "Vui lòng nhập họ tên!")
    .regex(
      /^[a-zA-ZÀ-ỹà-ỹ\s]+$/,
      "Họ tên chỉ được chứa chữ cái tiếng Việt và dấu cách!",
    ),
  username: z
    .string()
    .min(1, "Vui lòng nhập tên tài khoản!")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Tên tài khoản chỉ được chứa chữ cái không dấu và số!",
    ),
  role_id: z.number({ message: "Vui lòng chọn loại tài khoản!" }),
  email: z.string().min(1, "Vui lòng nhập email!").email("Email không hợp lệ!"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu!"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
  const router = useRouter();
  const { notify } = useNotification() as any;
  const [loading, setLoading] = useState(false);

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
        notify("success", "Đăng ký thành công!");
      } else {
        notify(
          "error",
          res?.error || "Đăng ký không thành công. Vui lòng thử lại!",
        );
      }
    } catch (e: any) {
      notify(
        "error",
        e.message || "Đăng ký không thành công. Vui lòng thử lại!",
      );
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
