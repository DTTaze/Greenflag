import React, { useEffect, useState } from "react";
import { CalendarIcon, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { getEventSignedByUserIdApi, getAllEventsApi } from "@/src/utils/api";
import { toast } from "react-toastify";
import EventDetailsModal from "./EventDetailsModal";
import Pagination from "./Pagination";

const EventList = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState("hot");
  const [eventsSigned, setEventsSigned] = useState([]);
  const [eventUser, setEventUser] = useState([]);
  const [hotEvents, setHotEvents] = useState([]);
  const [nowEvents, setNowEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's signed events
        const eventUserSignedResponse = await getEventSignedByUserIdApi(
          userInfo.id
        );
        const eventUserSignedData = eventUserSignedResponse.data;
        setEventUser(eventUserSignedData);

        // Extract Event objects from eventUser data
        const eventSignedData = eventUserSignedData.map(
          (eventUser) => eventUser.Event
        );
        setEventsSigned(eventSignedData);

        // Fetch all events
        const allEventsResponse = await getAllEventsApi();
        const allEvents = allEventsResponse.data;
        setEvents(allEvents);

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
      className="flex rounded-lg border border-gray-200 overflow-hidden"
    >
      <div className="w-1 bg-green-500"></div>
      <div className="flex-1 p-3">
        <h3 className="font-semibold text-gray-800 text-sm">{event.title}</h3>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
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
            <div className="flex items-center text-amber-600 font-medium text-xs">
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
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 px-2.5 rounded-md transition-colors"
            >
              {isEventParticipated(event.id) ? "Xem chi tiết" : "Tham gia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
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
      <div className="border-b border-gray-200 py-1 px-2">
        <div className="flex">
          <button
            className={`tab flex-1 py-1.5 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "hot"
                ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("hot")}
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
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
            className={`tab flex-1 py-1.5 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "current"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("current")}
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
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
            className={`tab flex-1 py-1.5 text-center rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
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
