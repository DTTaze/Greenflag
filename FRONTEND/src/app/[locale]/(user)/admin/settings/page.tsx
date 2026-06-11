"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  Settings,
  Cpu,
  Clock,
  FileText,
  AlertTriangle,
  Save,
  Plus,
  X,
  Check,
  RefreshCw,
} from "lucide-react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import {
  systemConfigService,
  SystemConfigDTO,
} from "@/src/services/system-config.service";

export default function SystemSettingsPage() {
  const tCommon = useTranslations("admin.common");
  const { notify } = useNotification() as any;

  const [configs, setConfigs] = useState<SystemConfigDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Form states mapping config keys to edited values
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [editedActives, setEditedActives] = useState<Record<string, boolean>>(
    {},
  );

  // Local state for entering new tags in lists
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await systemConfigService.getAll();
      if (res.success && res.data) {
        setConfigs(res.data);
        const values: Record<string, string> = {};
        const actives: Record<string, boolean> = {};
        res.data.forEach((item) => {
          values[item.key] = item.value;
          actives[item.key] = item.isActive;
        });
        setEditedValues(values);
        setEditedActives(actives);
      } else {
        notify("error", res.message || "Không thể tải cấu hình hệ thống");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      notify("error", "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (key: string) => {
    setSavingKey(key);
    try {
      const payload = {
        value: editedValues[key],
        isActive: editedActives[key],
      };
      const res = await systemConfigService.updateByKey(key, payload);
      if (res.success) {
        notify("success", `Cập nhật cấu hình "${key}" thành công!`);
        // Refresh local data
        setConfigs((prev) =>
          prev.map((item) =>
            item.key === key ? { ...item, ...res.data } : item,
          ),
        );
      } else {
        notify("error", res.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(`Failed to save config ${key}:`, error);
      notify("error", "Lỗi kết nối máy chủ");
    } finally {
      setSavingKey(null);
    }
  };

  // Tag helper functions
  const getTagsArray = (key: string): string[] => {
    const rawVal = editedValues[key] || "[]";
    try {
      const parsed = JSON.parse(rawVal);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const handleAddTag = (key: string) => {
    const tag = newTagInputs[key]?.trim();
    if (!tag) return;

    const currentTags = getTagsArray(key);
    if (currentTags.includes(tag)) {
      // Silently ignore duplicate values
      setNewTagInputs((prev) => ({
        ...prev,
        [key]: "",
      }));
      return;
    }

    const updated = [...currentTags, tag];
    setEditedValues((prev) => ({
      ...prev,
      [key]: JSON.stringify(updated),
    }));
    setNewTagInputs((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleRemoveTag = (key: string, tagToRemove: string) => {
    const currentTags = getTagsArray(key);
    const updated = currentTags.filter((t) => t !== tagToRemove);
    setEditedValues((prev) => ({
      ...prev,
      [key]: JSON.stringify(updated),
    }));
  };

  // Group configurations logically
  const getGroupedConfigs = () => {
    const aiGroup = configs.filter(
      (c) => c.key.includes("ai_auto") || c.key.includes("_roles"),
    );
    const cronGroup = configs.filter((c) => c.key.includes("cron_"));
    const generalGroup = configs.filter(
      (c) => !aiGroup.includes(c) && !cronGroup.includes(c),
    );

    return {
      ai: aiGroup,
      cron: cronGroup,
      general: generalGroup,
    };
  };

  const { ai, cron, general } = getGroupedConfigs();

  const renderConfigField = (config: SystemConfigDTO) => {
    const isArrayType =
      config.key === "banned_words" || config.key.includes("_roles");
    const isBooleanType = config.key.includes("_enabled");

    if (isBooleanType) {
      const valBool = editedValues[config.key] === "true";
      return (
        <div className="mt-2 flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={valBool}
              onChange={(e) => {
                setEditedValues((prev) => ({
                  ...prev,
                  [config.key]: e.target.checked ? "true" : "false",
                }));
              }}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-zinc-200 peer-checked:bg-emerald-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-zinc-700 dark:bg-zinc-800"></div>
          </label>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {valBool ? "Đang Bật (Enabled)" : "Đang Tắt (Disabled)"}
          </span>
        </div>
      );
    }

    if (isArrayType) {
      const tags = getTagsArray(config.key);
      return (
        <div className="mt-2 space-y-3">
          {/* Tags view */}
          <div className="flex min-h-[46px] flex-wrap gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            {tags.length === 0 ? (
              <span className="text-xs text-zinc-400 italic dark:text-zinc-500">
                Trống (Chưa có phần tử nào)
              </span>
            ) : (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-100/50 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(config.key, tag)}
                    className="rounded p-0.5 text-emerald-600 transition hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInputs[config.key] || ""}
              onChange={(e) =>
                setNewTagInputs((prev) => ({
                  ...prev,
                  [config.key]: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(config.key);
                }
              }}
              placeholder="Nhập giá trị mới rồi bấm Enter hoặc nút thêm"
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 shadow-2xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
            <button
              type="button"
              onClick={() => handleAddTag(config.key)}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <Plus size={14} /> Thêm
            </button>
          </div>
        </div>
      );
    }

    // Default string / number inputs
    return (
      <input
        type="text"
        value={editedValues[config.key] || ""}
        onChange={(e) =>
          setEditedValues((prev) => ({
            ...prev,
            [config.key]: e.target.value,
          }))
        }
        className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 shadow-2xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      />
    );
  };

  const renderConfigCard = (config: SystemConfigDTO) => {
    const isSaving = savingKey === config.key;

    return (
      <div
        key={config.id}
        className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="space-y-2.5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              {config.key}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Active:
              </span>
              <input
                type="checkbox"
                checked={editedActives[config.key] ?? true}
                onChange={(e) => {
                  setEditedActives((prev) => ({
                    ...prev,
                    [config.key]: e.target.checked,
                  }));
                }}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed font-medium text-zinc-500 dark:text-zinc-400">
            {config.description || "Chưa có mô tả cấu hình"}
          </p>

          <div className="pt-2">{renderConfigField(config)}</div>
        </div>

        <div className="mt-5 flex justify-end border-t border-zinc-100 pt-3 dark:border-zinc-900/60">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave(config.key)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <Settings
              className="text-emerald-600 dark:text-emerald-500"
              size={26}
            />
            Cấu hình hệ thống
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Quản lý và điều khiển các tham số hoạt động của lõi ứng dụng Green
            Flag.
          </p>
        </div>
        <button
          onClick={fetchConfigs}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
        >
          <RefreshCw size={14} /> Tải lại
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-500" />
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Đang tải danh sách cấu hình...
            </span>
          </div>
        </div>
      ) : configs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
          <AlertTriangle className="mx-auto mb-2 text-zinc-400" size={36} />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Không tìm thấy tham số cấu hình nào trong cơ sở dữ liệu.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: AI Auto Moderation */}
          {ai.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                <Cpu size={16} /> Kiểm duyệt nội dung tự động bằng AI
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ai.map(renderConfigCard)}
              </div>
            </div>
          )}

          {/* Section 2: Cron Jobs */}
          {cron.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                <Clock size={16} /> Cron Jobs Quét Nền
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cron.map(renderConfigCard)}
              </div>
            </div>
          )}

          {/* Section 3: General Limits */}
          {general.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                <FileText size={16} /> Giới hạn & Kiểm soát nội dung
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {general.map(renderConfigCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
