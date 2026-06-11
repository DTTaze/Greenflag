"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";

const STORAGE_KEY = "greenflag_notification_settings";

const defaultSettings = {
  emailUpdates: true,
  eventReminders: true,
  taskNotifications: true,
  newsletter: false,
};

export default function NotificationSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const handleToggle = (field) => {
    setSettings((current) => ({
      ...current,
      [field]: !current[field],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-emerald-200/70 bg-white p-8 shadow-xl shadow-emerald-100/50 dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-100">
            Cài đặt thông báo
          </h1>
          <p className="text-zinc-650 mt-2 max-w-2xl text-sm dark:text-zinc-400">
            Quản lý thông báo qua email, nhắc nhở sự kiện và cập nhật nhiệm vụ.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              label: "Cập nhật qua email",
              description:
                "Nhận thông báo khi có nhiệm vụ, sự kiện hoặc thay đổi tài khoản.",
              field: "emailUpdates",
            },
            {
              label: "Nhắc nhở sự kiện",
              description: "Nhận lời nhắc tham gia sự kiện và check-in mã QR.",
              field: "eventReminders",
            },
            {
              label: "Cập nhật nhiệm vụ",
              description:
                "Nhận thông báo khi nhiệm vụ được duyệt hoặc hoàn thành.",
              field: "taskNotifications",
            },
            {
              label: "Bản tin xanh",
              description:
                "Nhận email tin tức về hành động bảo vệ môi trường và quà tặng mới.",
              field: "newsletter",
            },
          ].map((item) => (
            <div
              key={item.field}
              className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.label}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(item.field)}
                  className={`inline-flex h-11 w-20 items-center rounded-full px-1.5 transition-all duration-200 ${
                    settings[item.field]
                      ? "bg-emerald-600"
                      : "bg-zinc-300 dark:bg-zinc-800"
                  }`}
                  aria-pressed={settings[item.field]}
                >
                  <span
                    className={`inline-block h-9 w-9 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      settings[item.field] ? "translate-x-9" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {saved && (
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Cài đặt đã được lưu.
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            className="rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </div>
  );
}
