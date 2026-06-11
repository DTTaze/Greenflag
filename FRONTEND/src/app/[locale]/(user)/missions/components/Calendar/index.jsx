import dayjs from "dayjs";
import range from "lodash-es/range";
import React, { useEffect, useState } from "react";

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const todayObj = dayjs();

const Calendar = ({ streak = 0, lastLogin = null }) => {
  const [dayObj, setDayObj] = useState(dayjs());
  const thisYear = dayObj.year();
  const thisMonth = dayObj.month();
  const daysInMonth = dayObj.daysInMonth();

  const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`);
  const weekDayObjOf1 = dayObjOf1.day();

  const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`);
  const weekDayObjOfLast = dayObjOfLast.day();

  // Last login date from user data
  const lastLoginDate = lastLogin ? dayjs(lastLogin) : null;

  // Generate streak days (past days from today going back by streak count)
  const streakDays = [];
  if (streak > 0 && lastLoginDate) {
    for (let i = 0; i < streak; i++) {
      streakDays.push(todayObj.subtract(i, "day").format("YYYY-MM-DD"));
    }
  }

  const handlePrev = () => {
    setDayObj(dayObj.subtract(1, "month"));
  };

  const handleNext = () => {
    setDayObj(dayObj.add(1, "month"));
  };

  // Check if a date is in streak
  const isDateInStreak = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return streakDays.includes(formattedDate);
  };

  // Animation effects for streak
  useEffect(() => {
    const interval = setInterval(() => {
      const streakElements = document.querySelectorAll(".streak-day-dot");
      streakElements.forEach((el) => {
        el.classList.toggle("scale-125");
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar-container overflow-hidden rounded-xl border border-gray-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] p-4 text-white">
        <button
          type="button"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-all outline-none hover:bg-white/25 active:scale-90"
          onClick={handlePrev}
        >
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
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-sm font-bold tracking-wider text-emerald-100 uppercase">
          {dayObj.format("MMMM YYYY")}
        </div>
        <button
          type="button"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-all outline-none hover:bg-white/25 active:scale-90"
          onClick={handleNext}
        >
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
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Streak indicator */}
      <div className="streak-indicator flex items-center border-b border-emerald-100/30 dark:border-zinc-800 bg-emerald-50/50 dark:bg-zinc-950/35 p-4">
        <div className="mr-3">
          <div className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
            Chuỗi hoạt động
          </div>
          <div className="flex items-center gap-1.5 text-xl font-extrabold text-[#0B6E4F] dark:text-emerald-450">
            🔥 {streak} ngày
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex h-6.5 w-6.5 items-center justify-center rounded-lg text-[10px] font-extrabold transition-all duration-300 ${
                i < streak
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-2xs"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="week-container grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20">
        {weekDays.map((d) => (
          <div
            className="flex h-8 items-center justify-center text-center text-[10px] font-extrabold tracking-wider text-emerald-800 dark:text-emerald-450 uppercase"
            key={d}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="day-container grid grid-cols-7 gap-1 bg-white dark:bg-zinc-900 p-2">
        {range(weekDayObjOf1).map((i) => (
          <div
            className="flex h-9 items-center justify-center text-xs text-gray-300 dark:text-zinc-600 opacity-30 select-none"
            key={i}
          >
            {dayObjOf1.subtract(weekDayObjOf1 - i, "day").date()}
          </div>
        ))}

        {range(daysInMonth).map((i) => {
          const currentDate = dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`);
          const isToday =
            i + 1 === todayObj.date() &&
            thisMonth === todayObj.month() &&
            thisYear === todayObj.year();
          const inStreak = isDateInStreak(currentDate);

          return (
            <div
              className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                isToday
                  ? "bg-emerald-600 font-extrabold text-white shadow-sm shadow-emerald-600/20"
                  : inStreak
                    ? "border border-emerald-100/50 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    : "text-gray-750 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              }`}
              key={i}
            >
              {i + 1}
              {inStreak && !isToday && (
                <div className="streak-day-dot absolute bottom-1 h-1 w-1 rounded-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-300"></div>
              )}
            </div>
          );
        })}

        {range(6 - weekDayObjOfLast).map((i) => (
          <div
            className="flex h-9 items-center justify-center text-xs text-gray-300 dark:text-zinc-600 opacity-30 select-none"
            key={i}
          >
            {dayObjOfLast.add(i + 1, "day").date()}
          </div>
        ))}
      </div>

      {/* Streak tips */}
      <div className="streak-tips flex justify-between border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 p-3 text-[10px] font-bold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
        <div className="flex items-center">
          <div className="mr-1.5 h-2 w-2 rounded border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20"></div>
          <span>Đã hoạt động</span>
        </div>
        <div className="flex items-center">
          <div className="mr-1.5 h-2 w-2 rounded bg-emerald-600"></div>
          <span>Hôm nay</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
