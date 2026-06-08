import { useState } from "react";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";

function ChangePassword() {
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
        if (!value) error = "Mật khẩu hiện tại không được để trống";
        else if (value.length < 6)
          error = "Mật khẩu hiện tại phải có ít nhất 6 ký tự";
        break;
      case "newPassword":
        if (!value) error = "Mật khẩu mới không được để trống";
        else if (value.length < 6)
          error = "Mật khẩu mới phải có ít nhất 6 ký tự";
        else if (!/[A-Z]/.test(value))
          error = "Mật khẩu mới phải chứa ít nhất một chữ cái in hoa";
        else if (!/[0-9]/.test(value))
          error = "Mật khẩu mới phải chứa ít nhất một số";
        break;
      case "confirmPassword":
        if (!value) error = "Xác nhận mật khẩu không được để trống";
        else if (value !== formData.newPassword)
          error = "Xác nhận mật khẩu không khớp với mật khẩu mới";
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
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }

    // Placeholder for API call to change password
    try {
      // Example: await changePasswordApi(formData.currentPassword, formData.newPassword);
      alert("Đổi mật khẩu thành công! (API chưa triển khai)");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      alert("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <h4 className="text-lg font-semibold">Đổi mật khẩu</h4>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="currentPassword"
          label="Mật khẩu hiện tại"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
        <InputField
          id="newPassword"
          label="Mật khẩu mới"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />
        <InputField
          id="confirmPassword"
          label="Xác nhận mật khẩu mới"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        <div className="flex justify-end space-x-2">
          <Button
            text="Hủy"
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
          <Button text="Lưu" type="submit" padding="15px" />
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
