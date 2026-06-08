import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLoginForm } from "@/src/hooks/forms/useLoginForm";

import Button from "../components/ui/button";
import InputField from "../components/ui/InputField";
import SocialLoginIcons from "../components/ui/SocialLoginIcons";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isLoginDisabled } = useLoginForm();

  return (
    <div className="mx-auto mt-8 max-w-sm rounded border border-gray-300 bg-white p-4 shadow">
      <h2 className="mb-4 text-center text-xl font-semibold">Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="identifier"
          label="Email hoặc Username"
          error={errors.identifier?.message}
          {...register("identifier")}
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
          text="Đăng nhập"
          disabled={isLoginDisabled}
          width="100%"
          padding="15px"
        />

        <div className="text-right">
          <Link
            href="/forgot_password"
            className="text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <hr className="my-6 border-gray-300" />
      <SocialLoginIcons />
      <div className="text-center">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Đăng ký tại đây
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
