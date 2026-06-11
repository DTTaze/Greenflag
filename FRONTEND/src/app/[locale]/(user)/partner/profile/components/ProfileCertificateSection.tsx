import React from "react";

type ProfileCertificateSectionProps = {
  files: File[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
};

export function ProfileCertificateSection({
  files,
  onFileChange,
  onRemoveFile,
}: ProfileCertificateSectionProps) {
  return (
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
                onClick={() => onRemoveFile(index)}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
