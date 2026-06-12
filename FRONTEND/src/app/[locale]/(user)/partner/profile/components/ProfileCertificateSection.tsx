import { Upload, X, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

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
  const t = useTranslations("partner");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
            {t("profile.certificationSection")}
          </CardTitle>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {t("profile.certificationDesc")}
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 border border-emerald-100 px-3.5 py-1 text-xs font-bold tracking-wider text-emerald-800 uppercase dark:bg-emerald-950/30 dark:border-emerald-900/20 dark:text-emerald-450 self-start lg:self-center">
          {t("profile.documentCount", { count: files.length })}
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* Styled Drag & Drop/Click Upload Area */}
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-emerald-200/60 hover:border-emerald-400 dark:border-emerald-800/40 dark:hover:border-emerald-600/60 rounded-2xl bg-emerald-50/5 hover:bg-emerald-50/10 p-6 text-center cursor-pointer transition duration-200 flex flex-col items-center justify-center gap-2 group"
        >
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-110 transition duration-200">
            <Upload size={20} />
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
            {t("profile.uploadFiles")}
          </span>
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            PDF, JPG, PNG, DOCX
          </span>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-emerald-250/20 bg-emerald-50/5 p-4 text-sm text-slate-700 dark:border-emerald-500/10 dark:bg-slate-950/40 dark:text-slate-200 transition duration-150 hover:bg-emerald-50/10 dark:hover:bg-slate-950/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-emerald-500 flex-shrink-0" />
                  <span className="truncate font-semibold">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl px-3 py-1.5 h-auto font-bold flex items-center gap-1 transition"
                >
                  <X size={14} />
                  {t("profile.remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
