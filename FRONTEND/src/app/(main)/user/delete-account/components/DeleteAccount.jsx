import { useState, useContext } from "react";
import { AuthContext } from "@/src/contexts/auth.context.jsx";
import InputField from "@/src/components/ui/InputField.jsx";
import Button from "@/src/components/ui/button";

function DeleteAccount() {
  const { auth } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validatePassword = (value) => {
    if (!value) return "Mật khẩu không được để trống";
    if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      // Placeholder for API call to request account deletion
      // Example: await deleteAccountApi(auth.user.id, password);
      console.log("Requesting account deletion for user:", auth.user.id);
      setIsSubmitted(true);
      setPassword("");
      setError("");
    } catch (error) {
      console.error("Lỗi khi yêu cầu xóa tài khoản:", error);
      setError("Xóa tài khoản thất bại. Vui lòng kiểm tra lại mật khẩu.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 border bg-white rounded-lg shadow-md">
        <h4 className="font-semibold text-lg">Xóa tài khoản</h4>
        <hr className="my-2 border-gray-300" />
        <div className="text-center py-8">
          <p className="text-lg text-gray-700">
            Yêu cầu xóa tài khoản của bạn đã được gửi.
          </p>
          <p className="text-lg text-gray-700">
            Tài khoản sẽ được xóa sau 15 ngày.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Bạn có thể hủy yêu cầu này trong vòng 15 ngày bằng cách liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border bg-white rounded-lg shadow-md">
      <h4 className="font-semibold text-lg">Xóa tài khoản</h4>
      <hr className="my-2 border-gray-300" />
      <div className="my-4">
        <p className="text-gray-700">
          Việc xóa tài khoản là không thể hoàn tác. Tài khoản của bạn sẽ được xóa
          sau 15 ngày kể từ khi yêu cầu được xác nhận.
        </p>
        <p className="text-gray-700 mt-2">
          Vui lòng nhập mật khẩu để xác nhận.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          error={error}
        />
        <div className="flex justify-end space-x-2">
          <Button
            text="Hủy"
            type="button"
            onClick={() => setPassword("")}
            padding="15px"
          />
          <Button
            text="Xác nhận xóa"
            type="submit"
            padding="15px"
          />
        </div>
      </form>
    </div>
  );
}

export default DeleteAccount;