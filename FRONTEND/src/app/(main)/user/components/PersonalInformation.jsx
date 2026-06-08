import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Copy, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getQRApi, updateUserPublicApi } from "@/src/utils/api.js";

import PersonalInfomationSkeleton from "./PersonalInfomationSkeleton.jsx";

function PersonalInformation() {
  const { isAuthenticated, user: storeUser, dispatch } = useAuthStore();
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);

  useEffect(() => {
    if (storeUser) {
      setUser({
        public_id: storeUser.public_id,
        username: storeUser.username || "",
        email: storeUser.email || "",
        full_name: storeUser.full_name || "",
        phone_number: storeUser.phone_number || "",
      });
      setOriginalUser(storeUser);
    }
  }, [storeUser]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = "Tên người dùng không được để trống";
        else if (value.length < 3)
          error = "Tên người dùng phải dài hơn 3 ký tự";
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          error = "Tên người dùng chỉ được chứa chữ cái và số";
        break;
      case "email":
        if (!value) error = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
        break;
      case "full_name":
        if (!value) error = "Họ và tên không được để trống";
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          error = "Họ và tên không được chứa ký tự đặc biệt";
        break;
      case "phone_number":
        if (!value) error = "Số điện thoại không được để trống";
        else if (!/^\d{10}$/.test(value))
          error = "Số điện thoại phải là 10 chữ số";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    const newErrors = {};
    inputFields.forEach(({ id }) => {
      const error = validateField(id, user[id] || "");
      if (error) newErrors[id] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      const payload = {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      };
      const res = await updateUserPublicApi(user.public_id, payload);
      dispatch({
        type: "UPDATE_USER",
        payload: res.data,
      });
      setOriginalUser(res.data);
      setUser({
        public_id: res.data.public_id,
        username: res.data.username || "",
        email: res.data.email || "",
        full_name: res.data.full_name || "",
        phone_number: res.data.phone_number || "",
      });
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser({
      public_id: originalUser.public_id,
      username: originalUser.username || "",
      email: originalUser.email || "",
      full_name: originalUser.full_name || "",
      phone_number: originalUser.phone_number || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const generateQRCode = async () => {
    try {
      const response = await getQRApi(user?.public_id || "");
      if (response?.data) {
        setQrCode(response.data);
        setShowQrDialog(true);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Could not generate QR code. Please try again later.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (!isAuthenticated || !user) return <PersonalInfomationSkeleton />;

  const inputFields = [
    { id: "username", label: "Tên người dùng" },
    { id: "email", label: "Email" },
    { id: "full_name", label: "Họ và Tên" },
    { id: "phone_number", label: "Số điện thoại" },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Thông tin cá nhân</h4>
        <div className="flex gap-2">
          <Button
            text="QR Code"
            onClick={generateQRCode}
            padding="15px"
            icon={<QrCode size={20} />}
            className="bg-green-100 text-green-600 hover:bg-green-200"
          />
          {!isEditing && (
            <Button
              text="Chỉnh sửa hồ sơ"
              onClick={handleEdit}
              padding="15px"
            />
          )}
        </div>
      </div>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="grid grid-cols-2 gap-4">
          {inputFields.map(({ id, label }) => (
            <div key={id}>
              <InputField
                id={id}
                label={label}
                value={user[id] || ""}
                onChange={handleChange}
                error={errors[id]}
                disabled={!isEditing}
                className={isEditing ? "" : "cursor-not-allowed bg-gray-100"}
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button
              text="Lưu"
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
              padding="15px"
            />
            <Button
              text="Hủy"
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white hover:bg-red-600"
              padding="15px"
            />
          </div>
        )}
      </form>

      {/* QR Code Dialog */}
      <Dialog
        open={showQrDialog}
        onClose={() => setShowQrDialog(false)}
        aria-labelledby="qr-code-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="qr-code-dialog-title"
          sx={{
            bgcolor: "#f0fdf4",
            color: "#166534",
            fontWeight: "bold",
          }}
        >
          Your Personal QR Code
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Scan this QR code to quickly access your profile or register for
            events.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 2,
              p: 3,
              border: "2px dashed #bbf7d0",
              borderRadius: "12px",
              bgcolor: "rgba(22, 101, 52, 0.02)",
            }}
          >
            {qrCode ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    cursor: "pointer",
                    color: "#166534",
                    bgcolor: "#f0fdf4",
                    p: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "#bbf7d0",
                    },
                  }}
                  onClick={() => copyToClipboard(user?.public_id)}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Public ID: {user?.public_id}
                  </Typography>
                  <Copy size={16} />
                </Box>
              </Box>
            ) : (
              <CircularProgress sx={{ color: "#166534" }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            text="Close"
            onClick={() => setShowQrDialog(false)}
            className="bg-green-600 text-white hover:bg-green-700"
            padding="15px"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PersonalInformation;
