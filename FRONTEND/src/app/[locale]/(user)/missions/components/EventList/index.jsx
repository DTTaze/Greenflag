import { motion } from "framer-motion";
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
        const eventSignedData = eventUserSignedData
          .map((eventUser) => eventUser?.event || eventUser?.Event)
          .filter(Boolean);
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
    return eventUser.some((eventUser) => (eventUser?.event?.id || eventUser?.Event?.id) === eventId);
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
                "group relative flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300",
                "border-transparent bg-transparent shadow-none after:hidden group-data-horizontal/tabs:after:hidden data-active:border-transparent data-active:bg-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
                activeTab === "hot"
                  ? "text-red-650 dark:text-red-200"
                  : "hover:text-red-650 text-gray-500 hover:bg-red-50/40 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-200",
              )}
            >
              {activeTab === "hot" && (
                <motion.span
                  layoutId="activeEventTab"
                  className="border-red-150 absolute inset-0 -z-10 rounded-xl border bg-red-50/90 shadow-[0_10px_30px_rgba(239,68,68,0.08)] dark:border-red-900/40 dark:bg-red-950/30"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-1.5">
                <Flame
                  className={cn(
                    "h-4 w-4 transition-colors",
                    activeTab === "hot"
                      ? "text-red-650 dark:text-red-400"
                      : "dark:group-hover:text-red-350 text-red-500/70 group-hover:text-red-600 dark:text-red-400/70",
                  )}
                />
                {t("tabs.hot")}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="current"
              className={cn(
                "group relative flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300",
                "border-transparent bg-transparent shadow-none after:hidden group-data-horizontal/tabs:after:hidden data-active:border-transparent data-active:bg-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
                activeTab === "current"
                  ? "dark:text-emerald-250 text-emerald-700"
                  : "text-gray-500 hover:bg-emerald-50/40 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-200",
              )}
            >
              {activeTab === "current" && (
                <motion.span
                  layoutId="activeEventTab"
                  className="border-emerald-150 absolute inset-0 -z-10 rounded-xl border bg-emerald-50/90 shadow-[0_10px_30px_rgba(16,185,129,0.08)] dark:border-emerald-900/40 dark:bg-emerald-950/30"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-1.5">
                <CalendarRange
                  className={cn(
                    "h-4 w-4 transition-colors",
                    activeTab === "current"
                      ? "dark:text-emerald-450 text-emerald-600"
                      : "dark:text-emerald-450/70 text-emerald-500/70 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                  )}
                />
                {t("tabs.current")}
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={cn(
                "group relative flex-1 cursor-pointer rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-300",
                "border-transparent bg-transparent shadow-none after:hidden group-data-horizontal/tabs:after:hidden data-active:border-transparent data-active:bg-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
                activeTab === "completed"
                  ? "text-blue-650 dark:text-blue-200"
                  : "hover:text-blue-650 text-gray-500 hover:bg-blue-50/40 dark:text-slate-300 dark:hover:bg-blue-950/20 dark:hover:text-blue-200",
              )}
            >
              {activeTab === "completed" && (
                <motion.span
                  layoutId="activeEventTab"
                  className="border-blue-150 absolute inset-0 -z-10 rounded-xl border bg-blue-50/90 shadow-[0_10px_30px_rgba(59,130,246,0.08)] dark:border-blue-900/40 dark:bg-blue-950/30"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center gap-1.5">
                <Check
                  className={cn(
                    "h-4 w-4 transition-colors",
                    activeTab === "completed"
                      ? "text-blue-600 dark:text-blue-400"
                      : "dark:group-hover:text-blue-350 text-blue-500/70 group-hover:text-blue-600 dark:text-blue-400/70",
                  )}
                />
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
                  key={event?.id}
                  event={event}
                  onOpenModal={handleOpenModal}
                  isParticipated={isEventParticipated(event?.id)}
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
