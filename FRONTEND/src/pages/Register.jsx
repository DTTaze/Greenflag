import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../components/ui/NotificationProvider";
import { createUserApi } from "../utils/api";
import { Eye, EyeOff } from "lucide-react";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import SocialLoginIcons from "../components/ui/SocialLoginIcons";
import SubmitButton from "../components/ui/button";

const initialFormData = {
  full_name: "",
  username: "",
  role_id: 2, 
  email: "",
  password: "",
};

function RegisterPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const { notify } = useNotification();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "full_name":
        if (!value.trim()) return "Vui lòng nhập họ tên!";
        if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          return "Họ tên chỉ được chứa chữ cái tiếng Việt và dấu cách!";
        return "";
        case "username":
        if (!value.trim()) return "Vui lòng nhập tên tài khoản!";
        if (!/^[a-zA-Z0-9]+$/.test(value))
            return "Tên tài khoản chỉ được chứa chữ cái không dấu và số!";
        return "";
      case "role_id":
        return !value ? "Vui lòng chọn loại tài khoản!" : "";
      case "email":
        if (!value.trim()) return "Vui lòng nhập email!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ!";
        return "";
      case "password":
        return !value ? "Vui lòng nhập mật khẩu!" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    }
    return newErrors;
  };

  const handleChange = ({ target: { name, value } }) => {
    const parsedValue = name === "role_id" ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, parsedValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      notify("error", "Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await createUserApi(formData);
      if (res?.status === 200) {
        navigate("/login");
        notify("success", "Đăng ký thành công!");
      } else {
        notify("error", res?.error || "Đăng ký không thành công. Vui lòng thử lại!");
      }
    } catch (e) {
      notify("error", e.message || "Đăng ký không thành công. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 border-2 rounded-md shadow">
      <h4 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h4>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="full_name"
          label="Họ tên"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
        />
        <InputField
          id="username"
          label="Tên tài khoản"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <SelectField
          id="role_id"
          label="Loại tài khoản"
          value={formData.role_id}
          onChange={handleChange}
          error={errors.role_id}
          options={[
            { value: 2, label: "Người dùng" },
            { value: 3, label: "Đối tác" },
          ]}
        />

        <InputField
          id="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          id="password"
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />
        <SubmitButton text="Đăng ký" width="100%" padding="15px" loading={loading} />
      </form>

      <div className="flex items-center mt-6">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 font-medium">Hoặc</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <SocialLoginIcons />

      <p className="text-center mt-4">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
