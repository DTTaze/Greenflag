import React from "react";
import { acceptEventApi } from "@/src/utils/api";
import { toast } from "react-toastify";
import QRCodeDisplay from "@/src/components/common/QRCodeDisplay";

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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
              <h3 className="font-semibold text-gray-700 mb-4">
                Mã QR của bạn
              </h3>
              <QRCodeDisplay initialText={userPublicId} />
            </div>
          ) : isRegistrationOpen ? (
            <button
              onClick={handleJoinEvent}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Tham gia
            </button>
          ) : (
            <p className="text-red-600 text-center font-semibold">
              Đã hết thời gian đăng ký
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
