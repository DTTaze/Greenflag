import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

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
  const normalizedStatus = status?.toLowerCase() || "";

  switch (normalizedStatus) {
    case "approved":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Đã đăng
        </span>
      );
    case "pending":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 ${className}`}
        >
          <Clock className="h-3 w-3" aria-hidden="true" /> Chờ duyệt
        </span>
      );
    case "draft":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 ${className}`}
        >
          <FileText className="h-3 w-3" aria-hidden="true" /> Bản nháp
        </span>
      );
    case "rejected":
      if (String(rejectedBy).toUpperCase() === "AI") {
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 ${className}`}
          >
            <Bot className="h-3.5 w-3.5" aria-hidden="true" /> Từ chối tự động
            (AI)
          </span>
        );
      }
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 ${className}`}
        >
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Từ chối
          (Ban Quản Trị)
        </span>
      );
    case "expired":
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-800 ${className}`}
        >
          <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Hết hạn
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500 ${className}`}
        >
          <HelpCircle className="h-3 w-3" aria-hidden="true" /> Không xác định
        </span>
      );
  }
}
