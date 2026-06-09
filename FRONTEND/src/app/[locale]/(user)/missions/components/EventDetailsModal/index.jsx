import { Calendar, Clock, MapPin, X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import QRCodeDisplay from "@/src/components/common/QRCodeDisplay";
import { acceptEvent } from "@/src/utils/api";

const EventDetailsModal = ({
  event,
  isOpen,
  onClose,
  userPublicId,
  isParticipated,
}) => {
  if (!isOpen || !event) return null;

  const handleJoinEvent = async () => {
    try {
      await acceptEvent(event.id);
      toast.success("🎉 Đăng ký tham gia sự kiện thành công!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        style: {
          background: "#10B981",
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
        },
      });
      onClose();
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("❌ Không thể tham gia sự kiện", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        style: {
          background: "#EF4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          borderRadius: "12px",
        },
      });
    }
  };

  const isRegistrationOpen = new Date(event.end_time) > new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header with Background Pattern */}
        <div className="relative bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] p-6 text-white shrink-0">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-250">
            Chi tiết sự kiện
          </span>
          <h2 className="text-xl font-bold leading-tight truncate pr-8">
            {event.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Giới thiệu hoạt động
            </span>
            <p className="text-sm leading-relaxed text-gray-650">
              {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0B6E4F]">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                  Bắt đầu
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {new Date(event.start_time).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0B6E4F]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                  Kết thúc
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {new Date(event.end_time).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0B6E4F]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                  Địa điểm
                </span>
                <span className="text-xs font-semibold text-gray-700 truncate block max-w-[170px]">
                  {event.location}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0B6E4F]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                  Hạn đăng ký
                </span>
                <span className="text-xs font-semibold text-gray-700">
                  {new Date(event.registration_deadline).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Participation State */}
          {isParticipated ? (
            <div className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/20 p-5 text-center">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#0B6E4F]">
                Vé sự kiện của bạn
              </span>
              <div className="mx-auto inline-block rounded-xl bg-white p-3.5 shadow-sm border border-emerald-100/30">
                <QRCodeDisplay initialText={userPublicId} />
              </div>
              <p className="text-xs font-medium text-emerald-800/80">
                Xuất trình mã QR tại điểm tổ chức sự kiện để được check-in và nhận xu thưởng.
              </p>
            </div>
          ) : isRegistrationOpen ? (
            <button
              onClick={handleJoinEvent}
              className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] py-3.5 text-center text-sm font-bold text-white shadow-md shadow-[#0B6E4F]/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#0B6E4F]/20 active:scale-[0.99]"
            >
              Tham gia sự kiện (+{event.coins || 0} Xu)
            </button>
          ) : (
            <div className="rounded-xl bg-red-50 p-4 text-center border border-red-150">
              <p className="text-sm font-semibold text-red-650">
                Sự kiện này đã kết thúc thời gian đăng ký.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
