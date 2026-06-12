import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";

function ChangePassword() {
  const t = useTranslations("user");
  const tAuth = useTranslations("auth");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "currentPassword":
        if (!value) error = tAuth("passwordRequired");
        break;
      case "newPassword":
        if (!value) {
          error = tAuth("passwordRequired");
        } else if (value.length < 8) {
          error = tAuth("passwordCriteriaText");
        } else if (!/[A-Z]/.test(value)) {
          error = tAuth("passwordRequireUppercase");
        } else if (!/[a-z]/.test(value)) {
          error = tAuth("passwordRequireLowercase");
        } else if (!/[0-9]/.test(value)) {
          error = tAuth("passwordRequireDigit");
        } else if (!/[^A-Za-z0-9]/.test(value)) {
          error = tAuth("passwordRequireSpecial");
        }
        break;
      case "confirmPassword":
        if (!value) error = tAuth("confirmPasswordRequired");
        else if (value !== formData.newPassword)
          error = tAuth("passwordsDoNotMatch");
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    ["currentPassword", "newPassword", "confirmPassword"].forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert(t("invalidInfo"));
      return;
    }

    try {
      alert(t("passwordChangedSuccess"));
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      alert(t("passwordChangedFailed"));
    }
  };

  return (
    <div className="transform overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-950">
      <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
        {t("changePasswordTitle")}
      </h4>
      <hr className="my-4 border-emerald-100 dark:border-emerald-500/10" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="currentPassword"
          label={t("currentPassword")}
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
        <InputField
          id="newPassword"
          label={t("newPassword")}
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />
        <InputField
          id="confirmPassword"
          label={t("confirmPassword")}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <div className="flex justify-end space-x-2">
          <Button
            text={t("cancelBtn")}
            type="button"
            onClick={() =>
              setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
            }
            padding="15px"
          />
          <Button text={t("saveBtn")} type="submit" padding="15px" />
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
