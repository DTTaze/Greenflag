import { ScanQrCode } from "lucide-react";
import { useTranslations } from "next-intl";

export function ScannerHeader() {
  const t = useTranslations("partner");

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-3xl border border-emerald-200/50 bg-white/85 p-6 backdrop-blur-xl shadow-xs dark:border-emerald-500/20 dark:bg-slate-900/80">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none transition-all duration-300">
          <ScanQrCode size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t("scanner.title")}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
            {t("scanner.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
