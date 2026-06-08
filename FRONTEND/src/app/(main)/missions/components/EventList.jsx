import { CalendarIcon, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllEventsApi, getEventSignedByUserIdApi } from "@/src/utils/api";

import EventDetailsModal from "./EventDetailsModal";
import Pagination from "./Pagination";

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
        const eventUserSignedResponse = await getEventSignedByUserIdApi(
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
        const allEventsResponse = await getAllEventsApi();
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

  const renderEventCard = (event) => (
    <div
      key={event.id}
      className="flex overflow-hidden rounded-lg border border-gray-200"
    >
      <div className="w-1 bg-green-500"></div>
      <div className="flex-1 p-3">
        <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">
          {event.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin size={12} className="mr-1" />
              {event.location}
            </div>
            <span>•</span>
            <div className="flex items-center">
              <CalendarIcon size={12} className="mr-1" />
              {new Date(event.start_time).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-xs font-medium text-amber-600">
              <span>+{event.coins}</span>
              <svg
                className="ml-0.5 h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm4-9h-3V8a1 1 0 00-2 0v3H8a1 1 0 000 2h3v3a1 1 0 002 0v-3h3a1 1 0 000-2z" />
              </svg>
            </div>

            <button
              onClick={() => handleOpenModal(event)}
              className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600"
            >
              {isEventParticipated(event.id) ? "Xem chi tiết" : "Tham gia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <h2 className="flex items-center text-lg font-semibold text-gray-800">
          <svg
            className="mr-2 h-5 w-5 text-green-600"
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
          Sự Kiện
        </h2>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          Xem tất cả
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-2 py-1">
        <div className="flex">
          <button
            className={`tab flex-1 rounded-lg py-1.5 text-center text-sm font-medium transition-all duration-200 ${
              activeTab === "hot"
                ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("hot")}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3.5 w-3.5"
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
            className={`tab flex-1 rounded-lg py-1.5 text-center text-sm font-medium transition-all duration-200 ${
              activeTab === "current"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("current")}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3.5 w-3.5"
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
            className={`tab flex-1 rounded-lg py-1.5 text-center text-sm font-medium transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3.5 w-3.5"
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
      <div className="p-3">
        <div className="space-y-3">
          {getPaginatedEvents().map(renderEventCard)}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={() => handlePageChange(currentPage + 1)}
          goToPreviousPage={() => handlePageChange(currentPage - 1)}
          goToPage={handlePageChange}
        />
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
