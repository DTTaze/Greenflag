import React from "react";
import { toast } from "react-toastify";

import QRCodeDisplay from "@/src/components/common/QRCodeDisplay";
import { acceptEventApi } from "@/src/utils/api";

const EventDetailsModal = ({
  event,
  isOpen,
  onClose,
  userPublicId,
  isParticipated,
}) => {
  if (!isOpen) return null;

  const handleJoinEvent = async () => {
    try {
      await acceptEventApi(event.id);
      toast.success("Tham gia sự kiện thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#4CAF50",
          color: "white",
          fontSize: "16px",
          fontWeight: "500",
        },
      });
      onClose();
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("❌ Không thể tham gia sự kiện", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#f44336",
          color: "white",
          fontSize: "16px",
          fontWeight: "500",
        },
      });
    }
  };

  const isRegistrationOpen = new Date(event.end_time) > new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl transform overflow-y-auto rounded-xl bg-white p-6 shadow-2xl transition-all">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Mô tả</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Thời gian bắt đầu</h3>
              <p className="text-gray-600">
                {new Date(event.start_time).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">
                Thời gian kết thúc
              </h3>
              <p className="text-gray-600">
                {new Date(event.end_time).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Địa điểm</h3>
              <p className="text-gray-600">{event.location}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Hạn đăng ký</h3>
              <p className="text-gray-600">
                {new Date(event.registration_deadline).toLocaleString()}
              </p>
            </div>
          </div>

          {isParticipated ? (
            <div className="mt-6">
              <h3 className="mb-4 font-semibold text-gray-700">
                Mã QR của bạn
              </h3>
              <QRCodeDisplay initialText={userPublicId} />
            </div>
          ) : isRegistrationOpen ? (
            <button
              onClick={handleJoinEvent}
              className="w-full transform rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:scale-[1.02] hover:bg-green-700 active:scale-[0.98]"
            >
              Tham gia
            </button>
          ) : (
            <p className="text-center font-semibold text-red-600">
              Đã hết thời gian đăng ký
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
