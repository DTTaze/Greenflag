import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useRegisterForm } from "@/src/hooks/forms/useRegisterForm";
import { Link } from "@/src/i18n/navigation";

import Button from "../components/ui/button";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import SocialLoginIcons from "../components/ui/SocialLoginIcons";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, loading } = useRegisterForm();

  return (
    <div className="mx-auto mt-10 max-w-md rounded-md border-2 p-4 shadow">
      <h4 className="mb-4 text-xl font-semibold">Đăng ký tài khoản</h4>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="full_name"
          label="Họ tên"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <InputField
          id="username"
          label="Tên tài khoản"
          error={errors.username?.message}
          {...register("username")}
        />

        <SelectField
          id="role_id"
          label="Loại tài khoản"
          error={errors.role_id?.message}
          options={[
            { value: 2, label: "Người dùng" },
            { value: 3, label: "Đối tác" },
          ]}
          {...register("role_id", { valueAsNumber: true })}
        />

        <InputField
          id="email"
          label="Email"
          error={errors.email?.message}
          {...register("email")}
        />
        <InputField
          id="password"
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...register("password")}
        />
        <Button
          type="submit"
          text={loading ? "Đang đăng ký..." : "Đăng ký"}
          disabled={loading}
          className="h-11 w-full"
        />
      </form>

      <div className="mt-6 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 font-medium text-gray-500">Hoặc</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <SocialLoginIcons />

      <p className="mt-4 text-center">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-blue-600">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
