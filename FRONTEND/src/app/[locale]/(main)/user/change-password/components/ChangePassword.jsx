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
        else if (value.length < 6) error = tAuth("passwordRequired");
        break;
      case "newPassword":
        if (!value) error = tAuth("passwordRequired");
        else if (value.length < 6) error = tAuth("passwordRequired");
        else if (!/[A-Z]/.test(value)) error = t("passwordUppercaseRequired");
        else if (!/[0-9]/.test(value)) error = t("passwordNumberRequired");
        break;
      case "confirmPassword":
        if (!value) error = tAuth("passwordRequired");
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
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <h4 className="text-lg font-semibold">{t("changePasswordTitle")}</h4>
      <hr className="my-2 border-gray-300" />

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
