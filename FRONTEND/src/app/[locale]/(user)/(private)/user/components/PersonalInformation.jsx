/* eslint-disable max-lines */
import { Copy, QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import Button from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import InputField from "@/src/components/ui/InputField.jsx";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getQR, updateUserPublic } from "@/src/utils/api";

import PersonalInfomationSkeleton from "./PersonalInfomationSkeleton.jsx";

function PersonalInformation() {
  const t = useTranslations("user");
  const tAuth = useTranslations("auth");
  const { isAuthenticated, user: storeUser, dispatch } = useAuthStore();
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => void setMounted(true), []);

  useEffect(() => {
    if (!storeUser) return;
    setUser({
      public_id: storeUser.public_id,
      username: storeUser.username || "",
      email: storeUser.email || "",
      full_name: storeUser.full_name || "",
      phone_number: storeUser.phone_number || "",
    });
    setOriginalUser(storeUser);
  }, [storeUser]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = tAuth("usernameRequired");
        else if (value.length < 3) error = tAuth("usernameInvalid");
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          error = tAuth("usernameInvalid");
        break;
      case "email":
        if (!value) error = tAuth("emailRequired");
        else if (!/\S+@\S+\.\S+/.test(value)) error = tAuth("emailInvalid");
        break;
      case "full_name":
        if (!value) error = tAuth("fullNameRequired");
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          error = tAuth("fullNameInvalid");
        break;
      case "phone_number":
        if (!value) error = t("phoneInvalid");
        else if (!/^\d{10}$/.test(value)) error = t("phoneInvalid");
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    const newErrors = {};
    inputFields.forEach(({ id }) => {
      const err = validateField(id, user[id] || "");
      if (err) newErrors[id] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      alert(t("invalidInfo"));
      return;
    }
    try {
      setSaving(true);
      const payload = {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      };
      const res = await updateUserPublic(user.public_id, payload);
      dispatch({ type: "UPDATE_USER", payload: res.data });
      setOriginalUser(res.data);
      setUser({
        public_id: res.data.public_id,
        username: res.data.username || "",
        email: res.data.email || "",
        full_name: res.data.full_name || "",
        phone_number: res.data.phone_number || "",
      });
      alert(t("updateSuccess"));
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert(t("updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    requestAnimationFrame(() => {
      const el = document.querySelector("#profile-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleCancel = () => {
    if (!originalUser) return;
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
      setQrCode(null);
      setShowQrDialog(true);
      const response = await getQR(user?.public_id || "");
      if (response?.data) setQrCode(response.data);
    } catch (err) {
      console.error("QR failed:", err);
      alert(t("generateQrFailed"));
      setShowQrDialog(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(t("copiedToClipboard"));
  };

  if (!isAuthenticated || !user) return <PersonalInfomationSkeleton />;

  const inputFields = [
    { id: "username", label: tAuth("username") },
    { id: "email", label: t("email") },
    { id: "full_name", label: tAuth("fullName") },
    { id: "phone_number", label: t("phone") },
  ];

  return (
    <div
      id="profile-form"
      className={`transform rounded-lg bg-white p-6 shadow-md transition-all duration-300 dark:bg-gray-800 ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("profileTitle")}
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("profileSubtitle") || ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            text="QR Code"
            onClick={generateQRCode}
            padding="12px"
            icon={<QrCode size={18} />}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          />
          {!isEditing ? (
            <Button
              text={t("editBtn")}
              onClick={handleEdit}
              padding="12px"
              className="bg-blue-600 text-white hover:bg-blue-700"
            />
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Editing
            </span>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <form
        id="profile-form-body"
        className="space-y-6"
        onSubmit={handleUpdate}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {inputFields.map(({ id, label }) => (
            <div key={id}>
              <InputField
                id={id}
                label={label}
                value={user[id] || ""}
                onChange={handleChange}
                error={errors[id]}
                disabled={!isEditing || saving}
                className={`transition-colors duration-150 ${
                  isEditing
                    ? "bg-white dark:bg-gray-800"
                    : "cursor-not-allowed bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button
                text={t("saveBtn")}
                type="submit"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                padding="12px"
                disabled={saving}
              />
              <Button
                text={t("cancelBtn")}
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
                padding="12px"
                disabled={saving}
              />
            </>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("lastUpdated")
                ? `${t("lastUpdated")}: ${originalUser?.updated_at || "-"}`
                : ""}
            </div>
          )}
        </div>
      </form>

      <Dialog
        open={showQrDialog}
        onOpenChange={(isOpen) => !isOpen && setShowQrDialog(false)}
      >
        <DialogContent className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:max-w-[420px]">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-lg font-bold text-emerald-800">
              {t("qrDialogTitle") || "Your Personal QR Code"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("qrDialogDesc") ||
                "Scan this QR code to quickly access your profile."}
            </p>

            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/10 p-4">
              {qrCode ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="h-auto max-w-[220px] rounded-md shadow-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(user?.public_id)}
                      className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                    >
                      <Copy size={14} />
                      <span>{t("copyPublicId") || "Copy Public ID"}</span>
                    </button>

                    <a
                      href={qrCode}
                      download={`qr-${user?.public_id || "id"}.png`}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {t("download") || "Download"}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("generatingQr") || "Generating QR..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              text={t("close") || "Close"}
              onClick={() => setShowQrDialog(false)}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              padding="12px"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PersonalInformation;
