import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Lock, UserCircle2, QrCode, Copy, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";
import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useUpdateProfileMutation, useUpdateAvatarMutation } from "@/src/queries/user/useUserQueries";
import { getQR } from "@/src/utils/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

function PersonalInformation() {
  const t = useTranslations("user");
  const tAuth = useTranslations("auth");
  const { notify } = useNotification();
  const { isAuthenticated, user: storeUser, setUser } = useAuthStore();

  const [userForm, setUserForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  const updateProfileMutation = useUpdateProfileMutation();
  const updateAvatarMutation = useUpdateAvatarMutation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!storeUser) return;
    setUserForm({
      fullName: storeUser.full_name || "",
      username: storeUser.username || "",
      email: storeUser.email || "",
      phoneNumber: storeUser.phone_number || "",
      birthDate: storeUser.birthDate || "",
      gender: storeUser.gender || "",
    });
  }, [storeUser]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = tAuth("fullNameRequired");
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value)) error = tAuth("fullNameInvalid");
        break;
      case "phoneNumber":
        if (value.trim() !== "" && !/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/.test(value)) {
          error = t("phoneInvalid");
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!storeUser) return;

    const newErrors = {};
    const validationFields = ["fullName", "phoneNumber"];
    validationFields.forEach((field) => {
      const error = validateField(field, userForm[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      notify("error", t("invalidInfo"));
      return;
    }

    try {
      const payload = {
        fullName: userForm.fullName,
        phoneNumber: userForm.phoneNumber,
        birthDate: userForm.birthDate || undefined,
        gender: userForm.gender || undefined,
      };

      const res = await updateProfileMutation.mutateAsync(payload);
      if (res && res.success) {
        notify("success", t("updateSuccess"));
        // Update Zustand store immediately
        const updatedUser = {
          ...storeUser,
          full_name: userForm.fullName,
          phone_number: userForm.phoneNumber,
          birthDate: userForm.birthDate,
          gender: userForm.gender,
        };
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        notify("error", res.message || t("updateFailed"));
      }
    } catch (err) {
      console.error("Update failed:", err);
      notify("error", err?.response?.data?.message || t("updateFailed"));
    }
  };

  const handleCancel = () => {
    if (!storeUser) return;
    setUserForm({
      fullName: storeUser.full_name || "",
      username: storeUser.username || "",
      email: storeUser.email || "",
      phoneNumber: storeUser.phone_number || "",
      birthDate: storeUser.birthDate || "",
      gender: storeUser.gender || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target?.files?.[0];
    if (!file || !storeUser) return;

    try {
      const res = await updateAvatarMutation.mutateAsync(file);
      const newUrl = res?.data?.avatarUrl || res?.data?.avatar_url;
      if (newUrl) {
        const updatedUrl = `${newUrl}?t=${Date.now()}`;
        setUser({
          ...storeUser,
          avatarUrl: updatedUrl,
          avatar_url: updatedUrl,
        });
        notify("success", t("avatarSuccess"));
      } else {
        notify("error", t("avatarFailed"));
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      notify("error", t("avatarFailed"));
    }
  };

  const generateQRCode = async () => {
    try {
      setQrCode(null);
      setShowQrDialog(true);
      const response = await getQR(storeUser?.public_id || String(storeUser?.id) || "");
      if (response?.data) setQrCode(response.data);
    } catch (err) {
      console.error("QR failed:", err);
      notify("error", t("generateQrFailed"));
      setShowQrDialog(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify("success", t("copiedToClipboard"));
  };

  if (!mounted) return null;
  if (!isAuthenticated || !storeUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-zinc-500">{t("notLoggedIn")}</p>
      </div>
    );
  }

  const roleLabel = storeUser?.role || storeUser?.roles?.name || t("userRole");

  return (
    <div className="space-y-6">
      {/* Header Info Banner / Action bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/85 dark:bg-zinc-900/50 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Interactive Avatar Upload Container */}
          <div
            onClick={handleAvatarClick}
            className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-2xl ring-2 ring-emerald-500/10 hover:ring-emerald-500 transition-all duration-300 shadow-sm"
            title={t("changeAvatar")}
          >
            <img
              src={storeUser?.avatar_url || storeUser?.avatarUrl || "/images/default-avatar.jpg"}
              alt="Avatar"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera size={20} className="text-white animate-bounce" />
            </div>
            {updateAvatarMutation.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleFileChange}
            disabled={updateAvatarMutation.isPending}
          />

          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {storeUser.full_name || "-"}
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {roleLabel}
              </span>
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              @{storeUser.username || "-"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            text={t("qrCodeBtn")}
            variant="secondary"
            size="lg"
            onClick={generateQRCode}
            icon={<QrCode size={18} />}
          />
          {!isEditing ? (
            <Button
              text={t("editBtn")}
              variant="default"
              size="lg"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <div className="flex gap-2">
              <Button
                text={t("saveBtn")}
                variant="default"
                size="lg"
                onClick={handleUpdate}
                disabled={updateProfileMutation.isPending}
              />
              <Button
                text={t("cancelBtn")}
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              />
            </div>
          )}
        </div>
      </div>

      <form className="grid gap-6 md:grid-cols-2" onSubmit={handleUpdate}>
        {/* Card 1: Basic Information */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/85 dark:bg-zinc-900/50 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/80">
            <UserCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {t("profileTitle")}
            </h2>
          </div>

          <div className="space-y-4">
            <InputField
              id="fullName"
              label={tAuth("fullName")}
              value={userForm.fullName}
              onChange={handleChange}
              error={errors.fullName}
              disabled={!isEditing || updateProfileMutation.isPending}
              required={isEditing}
              className={!isEditing ? "bg-zinc-50/50 dark:bg-zinc-950/40" : ""}
            />

            <InputField
              id="username"
              label={tAuth("username")}
              value={userForm.username}
              disabled={true}
              suffix={<Lock size={16} className="text-zinc-400" />}
              className="bg-zinc-50/50 dark:bg-zinc-950/40 cursor-not-allowed opacity-75"
            />

            {/* Date of Birth input field */}
            <div className="relative w-full">
              <div className="relative">
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={userForm.birthDate}
                  onChange={handleChange}
                  disabled={!isEditing || updateProfileMutation.isPending}
                  className={`peer h-12 w-full rounded-lg border-2 border-slate-300 bg-transparent px-4 pt-4 pb-1 text-sm text-slate-800 placeholder-transparent transition-colors focus:border-emerald-700 focus:ring-0 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 focus:dark:border-green-500 focus:dark:ring-1 focus:dark:ring-green-500/20 disabled:bg-zinc-50/50 disabled:dark:bg-zinc-950/40 disabled:opacity-75 disabled:cursor-not-allowed`}
                />
                <label
                  htmlFor="birthDate"
                  className="pointer-events-none absolute top-1.5 left-3.5 bg-white px-1 text-xs text-slate-400 transition-all duration-200 peer-focus:text-emerald-700 dark:bg-zinc-900 dark:text-zinc-400 peer-focus:dark:text-green-500"
                >
                  {t("dob")}
                </label>
              </div>
            </div>

            {/* Gender select field */}
            <div className="relative w-full">
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={userForm.gender}
                  onChange={handleChange}
                  disabled={!isEditing || updateProfileMutation.isPending}
                  className={`peer h-12 w-full rounded-lg border-2 border-slate-300 bg-transparent px-3 pt-4 pb-1 text-sm text-slate-800 transition-colors focus:border-emerald-700 focus:ring-0 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 focus:dark:border-green-500 focus:dark:ring-1 focus:dark:ring-green-500/20 disabled:bg-zinc-50/50 disabled:dark:bg-zinc-950/40 disabled:opacity-75 disabled:cursor-not-allowed`}
                >
                  <option value="" className="dark:bg-zinc-950">{t("otherGender")}</option>
                  <option value="male" className="dark:bg-zinc-950">{t("male")}</option>
                  <option value="female" className="dark:bg-zinc-950">{t("female")}</option>
                </select>
                <label
                  htmlFor="gender"
                  className="pointer-events-none absolute top-1.5 left-3.5 bg-white px-1 text-xs text-slate-400 transition-all duration-200 peer-focus:text-emerald-700 dark:bg-zinc-900 dark:text-zinc-400 peer-focus:dark:text-green-500"
                >
                  {t("gender")}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Contact Details */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/85 dark:bg-zinc-900/50 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800/80">
            <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {t("email")}
            </h2>
          </div>

          <div className="space-y-4">
            <InputField
              id="email"
              label={t("email")}
              value={userForm.email}
              disabled={true}
              suffix={<Lock size={16} className="text-zinc-400" />}
              className="bg-zinc-50/50 dark:bg-zinc-950/40 cursor-not-allowed opacity-75"
            />

            <InputField
              id="phoneNumber"
              label={t("phone")}
              value={userForm.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              disabled={!isEditing || updateProfileMutation.isPending}
              className={!isEditing ? "bg-zinc-50/50 dark:bg-zinc-950/40" : ""}
            />
          </div>

          <div className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/50 mt-4">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              {t("profileHint") ? t("profileHint") : "Bảo mật tài khoản"}
            </p>
            <p>{tAuth("emailOrUsernameRequired") ? "Email và Tên đăng nhập được dùng làm danh tính duy nhất của bạn và không thể tự thay đổi. Vui lòng liên hệ quản trị viên nếu cần chỉnh sửa." : ""}</p>
          </div>
        </div>
      </form>

      {/* QR Code Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="min-w-[min(95vw,420px)] rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle>{t("qrDialogTitle")}</DialogTitle>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {t("qrDialogDesc")}
            </p>
          </DialogHeader>

          <div className="mt-6 flex flex-col items-center gap-4">
            {qrCode ? (
              <img
                className="h-64 w-64 rounded-3xl border border-emerald-200/60 object-contain dark:border-emerald-500/15"
                alt={t("qrCodeBtn")}
                src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`}
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {t("generatingQr")}
              </div>
            )}

            <div className="grid w-full gap-3">
              <div className="rounded-3xl border border-emerald-200/50 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-200">
                <div className="font-semibold">{t("accountId")}</div>
                <div className="mt-2 text-sm break-all text-zinc-600 dark:text-zinc-400 font-mono">
                  {storeUser.public_id || String(storeUser.id) || "-"}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-0 flex flex-col gap-3 sm:flex-row sm:justify-end w-full">
              <Button
                text={t("copyBtn")}
                variant="secondary"
                size="lg"
                icon={<Copy size={16} />}
                onClick={() => copyToClipboard(storeUser.public_id || String(storeUser.id) || "")}
              />
              <Button
                text={t("close")}
                variant="outline"
                size="lg"
                onClick={() => setShowQrDialog(false)}
              />
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PersonalInformation;
