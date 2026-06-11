"use client";

import { Briefcase } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import mediaServices from "@/src/services/media";
import { UserService } from "@/src/services/user";

export default function PartnerProfilePage() {
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

  const removeFile = (idx: number) => setFiles((s) => s.filter((_, i) => i !== idx));

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

      setMessage("Thông tin hồ sơ đã được lưu thành công.");
    } catch (err) {
      console.error(err);
      setMessage("Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Partner Profile
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Cập nhật thông tin tổ chức, liên hệ và chứng nhận môi trường cho
                hồ sơ đối tác.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              Hồ sơ đối tác
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              Quản lý thông tin một cách chuyên nghiệp và rõ ràng.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Thông tin liên hệ
            </h2>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Full name
                <input
                  value={profile?.full_name || ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, full_name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
                <input
                  value={profile?.email || ""}
                  onChange={(e) =>
                    setProfile((p: any) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Phone
                <input
                  value={profile?.phone_number || ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, phone_number: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Hồ sơ đối tác
            </h2>
            <div className="mt-6 grid gap-4">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Organization
                <input
                  value={partnerMeta.organization}
                  onChange={(e) =>
                    setPartnerMeta((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Contact name
                <input
                  value={partnerMeta.contactName}
                  onChange={(e) =>
                    setPartnerMeta((prev) => ({
                      ...prev,
                      contactName: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Address
                <input
                  value={partnerMeta.address}
                  onChange={(e) =>
                    setPartnerMeta((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Description
                <textarea
                  rows={4}
                  value={partnerMeta.description}
                  onChange={(e) =>
                    setPartnerMeta((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chứng nhận môi trường
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Tải lên hồ sơ chứng nhận và quản lý tài liệu minh chứng.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
              {files.length} tài liệu
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="file"
              multiple
              onChange={onFileChange}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
            <div className="grid gap-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-gray-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {message ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
            {message}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu hồ sơ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
