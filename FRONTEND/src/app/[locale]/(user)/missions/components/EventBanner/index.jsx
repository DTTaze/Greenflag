import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllEvents, getEventSignedByUserId } from "@/src/utils/api";

import EventDetailsModal from "../EventDetailsModal";

const EventBanner = ({ userInfo }) => {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events
        const eventsResponse = await getAllEvents();
        if (!eventsResponse?.data) {
          throw new Error("Không thể tải danh sách sự kiện");
        }

        // Fetch signed events
        const signedEventsResponse = await getEventSignedByUserId(userInfo.id);
        const signedEventIds =
          signedEventsResponse?.data?.map((event) => event.event_id) || [];

        // Set events and participated events
        setEvents(eventsResponse.data);
        setParticipatedEvents(signedEventIds);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userInfo.id]);

  useEffect(() => {
    if (events.length > 1 && !isModalOpen) {
      const interval = setInterval(
        () => {
          setCurrentEventIndex((prevIndex) =>
            prevIndex === events.length - 1 ? 0 : prevIndex + 1,
          );
        },
        5000,
      );

      return () => clearInterval(interval);
    }
  }, [events, isModalOpen]);

  const handlePreviousEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1,
    );
  };

  const handleNextEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (loading || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentEventIndex];
  const isParticipated = participatedEvents.includes(currentEvent.id);

  return (
    <>
      <div className="relative mb-6 h-52 w-full overflow-hidden rounded-2xl shadow-md border border-gray-100">
        {/* Background Image with smooth transition effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-102"
          style={{
            backgroundImage: `url(${
              currentEvent.images?.[0] ||
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
            })`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/60 to-transparent" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePreviousEvent}
          className="group absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-all duration-300 border border-white/15 hover:bg-white/20 active:scale-90"
          aria-label="Previous event"
        >
          <ChevronLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-115" />
        </button>

        <button
          onClick={handleNextEvent}
          className="group absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-white/10 backdrop-blur-md transition-all duration-300 border border-white/15 hover:bg-white/20 active:scale-90"
          aria-label="Next event"
        >
          <ChevronRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-115" />
        </button>

        {/* Content Container */}
        <div className="relative flex h-full items-center justify-between pl-16 pr-16 text-white">
          <div className="max-w-xl pr-6">
            <span className="mb-1.5 inline-block text-[10px] font-bold tracking-widest text-emerald-350 uppercase">
              Sự kiện môi trường nổi bật
            </span>
            <h2 className="mb-2 text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-md truncate">
              {currentEvent.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-xs sm:text-sm text-emerald-100/90 drop-shadow-xs leading-relaxed">
              {currentEvent.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200/90 drop-shadow-2xs">
              <div className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>{currentEvent.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {new Date(currentEvent.start_time).toLocaleDateString("vi-VN", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <div className="shrink-0 hidden sm:block">
            <button
              className="cursor-pointer rounded-xl bg-white px-6 py-3.5 text-xs sm:text-sm font-extrabold text-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 active:scale-98"
              onClick={() => handleOpenModal(currentEvent)}
            >
              {isParticipated ? "Chi tiết vé" : "Đăng ký tham gia"}
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {events.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentEventIndex
                  ? "w-4 bg-white shadow-xs"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
              onClick={() => setCurrentEventIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        userPublicId={userInfo.public_id}
        isParticipated={
          selectedEvent ? participatedEvents.includes(selectedEvent.id) : false
        }
      />
    </>
  );
};

export default EventBanner;
