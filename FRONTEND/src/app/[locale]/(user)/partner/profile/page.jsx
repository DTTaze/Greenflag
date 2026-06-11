"use client";

import { Briefcase, User } from "lucide-react";
import React from "react";

import mediaServices from "@/src/services/media";
import { UserService } from "@/src/services/user";

export default function PartnerProfilePage() {
  const [profile, setProfile] = React.useState(null);
  const [partnerMeta, setPartnerMeta] = React.useState({
    organization: "",
    contactName: "",
    address: "",
    description: "",
  });
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

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
    return () => (mounted = false);
  }, []);

  const onFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list]);
  };

  const removeFile = (idx) => setFiles((s) => s.filter((_, i) => i !== idx));

  async function handleSave(e) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
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
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <Briefcase />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Partner Profile
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage organization details, sponsors and green certifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Organization
            </label>
            <input
              value={partnerMeta.organization}
              onChange={(e) =>
                setPartnerMeta((prev) => ({
                  ...prev,
                  organization: e.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Contact name
            </label>
            <input
              value={partnerMeta.contactName}
              onChange={(e) =>
                setPartnerMeta((prev) => ({
                  ...prev,
                  contactName: e.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full name
            </label>
            <input
              value={profile?.full_name || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, full_name: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              value={profile?.email || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Phone
            </label>
            <input
              value={profile?.phone_number || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone_number: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Address
            </label>
            <input
              value={partnerMeta.address}
              onChange={(e) =>
                setPartnerMeta((prev) => ({ ...prev, address: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              rows={4}
              value={partnerMeta.description}
              onChange={(e) =>
                setPartnerMeta((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-md border px-3 py-2"
            />

            <label className="mt-3 mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Green Certifications (upload)
            </label>
            <input
              type="file"
              multiple
              onChange={onFileChange}
              className="mb-3"
            />
            <div className="grid grid-cols-1 gap-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="truncate text-sm">{f.name}</div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-2 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
