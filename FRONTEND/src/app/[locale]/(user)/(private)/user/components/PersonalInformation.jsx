/* eslint-disable max-lines */
import { Copy, QrCode, ShieldCheck, UserCircle2 } from "lucide-react";
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
  const [status, setStatus] = useState({ message: "", type: "info" });

  const showStatus = (message, type = "info") => setStatus({ message, type });
  const clearStatus = () => setStatus({ message: "", type: "info" });

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
      showStatus(t("invalidInfo"), "error");
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
      showStatus(t("updateSuccess"), "success");
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      showStatus(t("updateFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    clearStatus();
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
    clearStatus();
  };

  const generateQRCode = async () => {
    try {
      setQrCode(null);
      setShowQrDialog(true);
      const response = await getQR(user?.public_id || "");
      if (response?.data) setQrCode(response.data);
    } catch (err) {
      console.error("QR failed:", err);
      showStatus(t("generateQrFailed"), "error");
      setShowQrDialog(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showStatus(t("copiedToClipboard"), "success");
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
      className={`transform overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-950 ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-zinc-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
            <ShieldCheck size={16} />
            {t("profileTitle")}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {t("profileTitle")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {t("profileSubtitle")}
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
              onClick={handleEdit}
            />
          ) : (
            <Button
              text={t("cancelBtn")}
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={saving}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,320px)_1fr]">
        <aside className="space-y-4 rounded-3xl bg-zinc-50 p-5 ring-1 ring-emerald-200/60 dark:bg-zinc-950 dark:ring-emerald-500/15">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
              <UserCircle2 size={26} />
            </div>
            <div>
              <p className="text-xs tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
                {tAuth("username")}
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {user.username || "-"}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl bg-white p-4 ring-1 ring-emerald-200/50 dark:bg-zinc-900 dark:ring-emerald-500/10">
              <p className="text-xs tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
                {t("accountId")}
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {originalUser?.public_id || "-"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 ring-1 ring-emerald-200/50 dark:bg-zinc-900 dark:ring-emerald-500/10">
              <p className="text-xs tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
                {t("role")}
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {originalUser?.role ||
                  originalUser?.roles?.name ||
                  t("userRole")}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 ring-1 ring-emerald-200/50 dark:bg-zinc-900 dark:ring-emerald-500/10">
              <p className="text-xs tracking-[0.24em] text-zinc-500 uppercase dark:text-zinc-400">
                {t("phone")}
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {user.phone_number || "-"}
              </p>
            </div>
          </div>

          <div className="text-zinc-600 rounded-3xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900 dark:text-zinc-300">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {t("profileTitle")}
            </p>
            <p className="mt-2 leading-6">{t("profileHint")}</p>
          </div>
        </aside>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-emerald-200/60 dark:bg-zinc-950 dark:ring-emerald-500/15">
          {status.message && (
            <div
              role="status"
              className={`mb-6 rounded-3xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-rose-200 bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleUpdate}>
            <div className="grid gap-5 md:grid-cols-2">
              {inputFields.map(({ id, label }) => (
                <InputField
                  key={id}
                  id={id}
                  label={label}
                  value={user[id] || ""}
                  onChange={handleChange}
                  error={errors[id]}
                  disabled={!isEditing || saving}
                  className={`transition-colors duration-150 ${
                    isEditing
                      ? "bg-white dark:bg-zinc-950"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {isEditing ? (
                <>
                  <Button
                    text={t("saveBtn")}
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={saving}
                  />
                  <Button
                    text={t("cancelBtn")}
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    disabled={saving}
                  />
                </>
              ) : (
                <div className="text-zinc-600 rounded-3xl border border-emerald-200/50 bg-zinc-50 px-4 py-3 text-sm dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-300">
                  {t("lastUpdated")
                    ? `${t("lastUpdated")}: ${originalUser?.updated_at || "-"}`
                    : ""}
                </div>
              )}
            </div>
          </form>
        </section>
      </div>

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
                src={`data:image/png;base64,${qrCode}`}
              />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                {t("generatingQr")}
              </div>
            )}

            <div className="grid w-full gap-3">
              <div className="rounded-3xl border border-emerald-200/50 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-200">
                <div className="font-semibold">{t("accountId")}</div>
                <div className="mt-2 text-sm break-all text-zinc-600 dark:text-zinc-400">
                  {user.public_id || "-"}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-0 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                text={t("copyBtn")}
                variant="secondary"
                size="lg"
                icon={<Copy size={16} />}
                onClick={() => copyToClipboard(user.public_id || "")}
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
