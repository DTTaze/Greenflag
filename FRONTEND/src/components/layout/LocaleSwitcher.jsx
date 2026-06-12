"use client";

import { setCookie } from "cookies-next/client";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/src/i18n/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });

      setCookie("NEXT_LOCALE", nextLocale, {
        path: "/",
        secure: true,
        sameSite: "lax",
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:text-brand-emerald active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-400"
        aria-label={t("changeLanguage")}
        disabled={isPending}
      >
        <Globe className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[120px] border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        <DropdownMenuItem
          onClick={() => handleLocaleChange("vi")}
          className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-semibold ${
            locale === "vi"
              ? "font-bold text-brand-emerald dark:text-emerald-400"
              : "text-gray-700 dark:text-zinc-400"
          }`}
        >
          <span>Tiếng Việt</span>
          {locale === "vi" && (
            <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald dark:bg-emerald-400" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLocaleChange("en")}
          className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-semibold ${
            locale === "en"
              ? "font-bold text-brand-emerald dark:text-emerald-400"
              : "text-gray-700 dark:text-zinc-400"
          }`}
        >
          <span>English</span>
          {locale === "en" && (
            <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald dark:bg-emerald-400" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
