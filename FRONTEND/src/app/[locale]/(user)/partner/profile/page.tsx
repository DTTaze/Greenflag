"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/src/components/ui/button";
import mediaServices from "@/src/services/media";
import { UserService } from "@/src/services/user";

import { ProfileCertificateSection } from "./components/ProfileCertificateSection";
import { ProfileContactForm } from "./components/ProfileContactForm";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfilePartnerMetaForm } from "./components/ProfilePartnerMetaForm";

export default function PartnerProfilePage() {
  const t = useTranslations("partner");
  const [profile, setProfile] = React.useState<any>(null);
  const [partnerMeta, setPartnerMeta] = React.useState({
    organization: "",
    contactName: "",
    address: "",
    description: "",
  });
  const [files, setFiles] = React.useState<File[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await UserService.getProfile();
        if (mounted) setProfile(res || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const storedMeta = JSON.parse(
      localStorage.getItem("partner_profile_meta") || "null",
    );
    if (storedMeta) {
      setPartnerMeta(storedMeta);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list]);
  };

  const removeFile = (idx: number) =>
    setFiles((s) => s.filter((_, i) => i !== idx));

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartnerMetaChange = (field: keyof typeof partnerMeta, value: string) => {
    setPartnerMeta((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      const uploaded = [];
      for (const f of files) {
        const res = await mediaServices.uploadFile(f);
        uploaded.push(res.data?.secureUrl || res.data?.secure_url || "");
      }

      const payload = {
        fullName: profile.full_name,
        email: profile.email,
        phoneNumber: profile.phone_number,
      };

      await UserService.updateProfile(payload);
      localStorage.setItem("partner_profile_meta", JSON.stringify(partnerMeta));

      if (uploaded.length > 0) {
        try {
          const existing = JSON.parse(
            localStorage.getItem("partner_certificates") || "[]",
          );
          localStorage.setItem(
            "partner_certificates",
            JSON.stringify([...existing, ...uploaded]),
          );
          setFiles([]);
        } catch (err) {
          console.error(err);
        }
      }

      setMessage(t("profile.saveSuccess"));
    } catch (err) {
      console.error(err);
      setMessage(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-zinc-400 gap-2">
        <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-500" size={20} />
        <span>{t("overview.loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header component */}
      <ProfileHeader />

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          {/* Contact form panel */}
          <ProfileContactForm
            profile={profile}
            onProfileChange={handleProfileChange}
          />

          {/* Partner organization meta form panel */}
          <ProfilePartnerMetaForm
            partnerMeta={partnerMeta}
            onPartnerMetaChange={handlePartnerMetaChange}
          />
        </div>

        {/* Environmental certificate section */}
        <ProfileCertificateSection
          files={files}
          onFileChange={onFileChange}
          onRemoveFile={removeFile}
        />

        {message && (
          <div className="rounded-2xl border border-emerald-200/30 bg-emerald-55/10 p-4 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-300">
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-zinc-950 px-6 py-2.5 font-semibold text-sm transition shadow-md shadow-emerald-600/10 dark:shadow-none h-auto"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                {t("profile.saving")}
              </>
            ) : (
              t("profile.saveBtn")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
