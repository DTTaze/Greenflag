import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLoginForm } from "@/src/hooks/forms/useLoginForm";
import { Link } from "@/src/i18n/navigation";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import SocialLoginIcons from "@/src/components/ui/SocialLoginIcons";

const LoginPage = () => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isLoginDisabled } = useLoginForm();

  return (
    <div className="mx-auto mt-8 max-w-sm rounded border border-gray-300 bg-white p-4 shadow">
      <h2 className="mb-4 text-center text-xl font-semibold">
        {t("loginTitle")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="identifier"
          label={t("emailOrUsername")}
          error={errors.identifier?.message}
          {...register("identifier")}
        />

        <InputField
          id="password"
          label={t("password")}
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
          text={t("loginTitle")}
          disabled={isLoginDisabled}
          width="100%"
          padding="15px"
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
      </form>

      <hr className="my-6 border-gray-300" />
      <SocialLoginIcons />
      <div className="text-center">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          {t("registerHere")}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
