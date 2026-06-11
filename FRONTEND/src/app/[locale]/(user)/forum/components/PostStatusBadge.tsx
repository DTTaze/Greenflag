import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface PostStatusBadgeProps {
  status?: string;
  rejectedBy?: "AI" | "admin" | null;
  className?: string;
}

export default function PostStatusBadge({
  status,
  rejectedBy,
  className = "",
}: PostStatusBadgeProps) {
  const t = useTranslations("forum");
  const normalizedStatus = status?.toLowerCase() || "";

  switch (normalizedStatus) {
    case "approved":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/45 dark:text-green-400 ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />{" "}
          {t("statusApproved")}
        </span>
      );
    case "pending":
      return (
        <span
          className={`text-yellow-850 dark:text-yellow-405 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold dark:bg-yellow-950/45 ${className}`}
        >
          <Clock className="h-3 w-3" aria-hidden="true" /> {t("statusPending")}
        </span>
      );
    case "draft":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300 ${className}`}
        >
          <FileText className="h-3 w-3" aria-hidden="true" /> {t("statusDraft")}
        </span>
      );
    case "rejected":
      if (String(rejectedBy).toUpperCase() === "AI") {
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:border-purple-900/30 dark:bg-purple-950/45 dark:text-purple-400 ${className}`}
          >
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />{" "}
            {t("statusRejectedAI")}
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:border-red-900/30 dark:bg-red-950/45 dark:text-red-400 ${className}`}
        >
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />{" "}
          {t("statusRejectedAdmin")}
        </span>
      );
    case "expired":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-300 ${className}`}
        >
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />{" "}
          {t("statusExpired")}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}
        >
          <HelpCircle className="h-3 w-3" aria-hidden="true" />{" "}
          {t("statusUnknown")}
        </span>
      );
  }
}
