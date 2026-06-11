import { Calendar, CalendarRange, Check, Flame } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import { getAllEvents, getEventSignedByUserId } from "@/src/utils/api";

import EventCard from "../EventCard";
import EventDetailsModal from "../EventDetailsModal";
import Pagination from "../Pagination";

const EventList = ({ userInfo }) => {
  const t = useTranslations("missions.eventList");
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
        toast.error(t("loadInfoError"));
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
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-2xs dark:border-slate-700/70 dark:bg-slate-900/80">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
        <h2 className="flex items-center text-base font-extrabold tracking-wider text-gray-800 uppercase dark:text-slate-100">
          <Calendar className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          {t("title")}
        </h2>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-100 bg-gray-50/40 px-3.5 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
          <TabsList className="flex w-full gap-1 bg-transparent p-0">
            <TabsTrigger
              value="hot"
              className={cn(
                "data-active:text-red-650 flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 data-active:border-red-100/50 data-active:bg-red-50 dark:data-active:border-red-400/30 dark:data-active:bg-red-400/10 dark:data-active:text-red-200",
                activeTab !== "hot" &&
                  "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white",
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Flame className="h-4 w-4" />
                {t("tabs.hot")}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="current"
              className={cn(
                "flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 data-active:border-emerald-100/50 data-active:bg-emerald-50 data-active:text-emerald-700 dark:data-active:border-emerald-400/30 dark:data-active:bg-emerald-400/10 dark:data-active:text-emerald-200",
                activeTab !== "current" &&
                  "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white",
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <CalendarRange className="h-4 w-4" />
                {t("tabs.current")}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={cn(
                "data-active:text-blue-650 flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300 data-active:border-blue-100/50 data-active:bg-blue-50 dark:data-active:border-blue-400/30 dark:data-active:bg-blue-400/10 dark:data-active:text-blue-200",
                activeTab !== "completed" &&
                  "text-gray-500 hover:bg-gray-100/50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-white",
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" />
                {t("tabs.completed")}
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Event Cards & Content */}
        <TabsContent value={activeTab} className="p-4 outline-none">
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
            <div className="text-gray-405 py-8 text-center text-sm font-medium dark:text-slate-300">
              {t("noEvents")}
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
        </TabsContent>
      </Tabs>

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
