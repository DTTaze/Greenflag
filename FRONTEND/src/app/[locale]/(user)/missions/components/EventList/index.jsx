import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllEvents, getEventSignedByUserId } from "@/src/utils/api";

import EventCard from "../EventCard";
import EventDetailsModal from "../EventDetailsModal";
import Pagination from "../Pagination";

const EventList = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState("hot");
  const [eventsSigned, setEventsSigned] = useState([]);
  const [eventUser, setEventUser] = useState([]);
  const [hotEvents, setHotEvents] = useState([]);
  const [nowEvents, setNowEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's signed events
        const eventUserSignedResponse = await getEventSignedByUserId(
          userInfo.id,
        );
        const eventUserSignedData = eventUserSignedResponse.data;
        setEventUser(eventUserSignedData);

        // Extract Event objects from eventUser data
        const eventSignedData = eventUserSignedData.map(
          (eventUser) => eventUser.Event,
        );
        setEventsSigned(eventSignedData);

        // Fetch all events
        const allEventsResponse = await getAllEvents();
        const allEvents = allEventsResponse.data;

        // Filter hot events
        const hotEventResponse = allEvents.filter((event) => {
          return (
            event.capacity >= 100 && new Date(event.end_sign) >= new Date()
          );
        });
        setHotEvents(hotEventResponse);

        // Filter current events
        const nowEventsResponse = allEvents.filter((event) => {
          return (
            new Date(event.start_time) <= new Date() &&
            new Date() <= new Date(event.end_time)
          );
        });
        setNowEvents(nowEventsResponse);
      } catch (error) {
        console.error("Failed to fetch data!", error);
        toast.error("Không thể tải thông tin sự kiện");
      }
    };
    fetchData();
  }, [userInfo.id]);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const isEventParticipated = (eventId) => {
    return eventUser.some((eventUser) => eventUser.Event.id === eventId);
  };

  const getCurrentEvents = () => {
    switch (activeTab) {
      case "hot":
        return hotEvents;
      case "current":
        return nowEvents;
      case "completed":
        return eventsSigned;
      default:
        return [];
    }
  };

  const totalPages = Math.ceil(getCurrentEvents().length / eventsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPaginatedEvents = () => {
    const events = getCurrentEvents();
    const startIndex = (currentPage - 1) * eventsPerPage;
    return events.slice(startIndex, startIndex + eventsPerPage);
  };

  // Reset current page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="flex items-center text-base font-extrabold tracking-wider text-gray-800 uppercase">
          <svg
            className="mr-2 h-5 w-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          Sự Kiện Môi Trường
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 bg-gray-50/40 px-3.5 py-1.5">
        <div className="flex gap-1">
          <button
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeTab === "hot"
                ? "text-red-650 border border-red-100/50 bg-red-50 shadow-2xs"
                : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("hot")}
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Sự Kiện Hot
            </div>
          </button>
          <button
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeTab === "current"
                ? "border border-emerald-100/50 bg-emerald-50 text-emerald-700 shadow-2xs"
                : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("current")}
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Đang Diễn Ra
            </div>
          </button>
          <button
            className={`flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 ${
              activeTab === "completed"
                ? "text-blue-650 border border-blue-100/50 bg-blue-50 shadow-2xs"
                : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            <div className="flex items-center justify-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Đã Tham Gia
            </div>
          </button>
        </div>
      </div>

      {/* Event Cards */}
      <div className="p-4">
        {getCurrentEvents().length > 0 ? (
          <div className="space-y-3">
            {getPaginatedEvents().map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onOpenModal={handleOpenModal}
                isParticipated={isEventParticipated(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-405 py-8 text-center text-sm font-medium">
            Không có sự kiện nào trong mục này.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToPage={handlePageChange}
          />
        )}
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userPublicId={userInfo.public_id}
        isParticipated={
          selectedEvent ? isEventParticipated(selectedEvent.id) : false
        }
      />
    </div>
  );
};

export default EventList;
