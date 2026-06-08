import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import range from "lodash-es/range";
import '@/src/styles/components/Calendar.scss';

const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const todayObj = dayjs();

const Calendar = ({ streak = 0, lastLogin = null }) => {
    const [dayObj, setDayObj] = useState(dayjs());
    const thisYear = dayObj.year();
    const thisMonth = dayObj.month();
    const daysInMonth = dayObj.daysInMonth();

    const dayObjOf1 = dayjs(`${thisYear}-${thisMonth+1}-1`);
    const weekDayObjOf1 = dayObjOf1.day();

    const dayObjOfLast = dayjs(`${thisYear}-${thisMonth+1}-${daysInMonth}`);
    const weekDayObjOfLast = dayObjOfLast.day();
    
    // Last login date from user data
    const lastLoginDate = lastLogin ? dayjs(lastLogin) : null;

    console.log("Login date: ", lastLogin);  
    
    // Generate streak days (past days from today going back by streak count)
    const streakDays = [];
    if (streak > 0 && lastLoginDate) {
        for (let i = 0; i < streak; i++) {
            streakDays.push(todayObj.subtract(i, 'day').format('YYYY-MM-DD'));
        }
    }
    
    const handlePrev = () => {
        setDayObj(dayObj.subtract(1, 'month'));
    }

    const handleNext = () => {
        setDayObj(dayObj.add(1, 'month'));
    }
    
    // Check if a date is in streak
    const isDateInStreak = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');
        return streakDays.includes(formattedDate);
    }
    
    // Animation effects for streak
    useEffect(() => {
        const interval = setInterval(() => {
            const streakElements = document.querySelectorAll('.streak-day');
            streakElements.forEach(el => {
                el.classList.toggle('pulse');
            });
        }, 2000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='calendar-container rounded-lg overflow-hidden shadow-sm border border-green-100'>
            <div className='header_calendar bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex justify-between items-center rounded-t-lg'>
                <button 
                    type='button' 
                    className='nav nav--prev w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors' 
                    onClick={handlePrev}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className='datetime text-lg font-semibold tracking-wide'>{dayObj.format('MMMM YYYY')}</div>
                <button 
                    type='button' 
                    className='nav nav--next w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors' 
                    onClick={handleNext}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            {/* Streak indicator */}
            <div className="streak-indicator bg-green-50 p-4 border-b border-green-100 flex items-center">
                <div className="mr-3">
                    <div className="text-sm text-gray-600">Chuỗi hoạt động</div>
                    <div className="text-2xl font-bold text-green-700">{streak} ngày</div>
                </div>
                <div className="flex ml-auto">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-7 h-7 mx-0.5 rounded-full flex items-center justify-center text-xs font-medium ${
                                i < streak 
                                    ? 'bg-green-600 text-white shadow-sm' 
                                    : 'bg-gray-100 text-gray-400'
                            } ${i === streak - 1 ? 'ring-2 ring-green-300' : ''}`}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='week-container grid grid-cols-7 bg-green-50'>
                {weekDays.map(d => (
                    <div className='week-cell py-3 text-center text-xs font-semibold text-green-700' key={d}>
                        {d}
                    </div>
                ))}
            </div>
            
            <div className='day-container grid grid-cols-7 bg-white'>
                {range(weekDayObjOf1).map(i => (
                    <div 
                        className='day-cell day-cell--faded h-10 flex items-center justify-center text-sm text-gray-400' 
                        key={i}
                    >
                        {dayObjOf1.subtract(weekDayObjOf1 - i, 'day').date()}
                    </div>
                ))}

                {range(daysInMonth).map(i => {
                    const currentDate = dayjs(`${thisYear}-${thisMonth+1}-${i+1}`);
                    const isToday = i + 1 === todayObj.date() && thisMonth === todayObj.month() && thisYear === todayObj.year();
                    const inStreak = isDateInStreak(currentDate);
                    
                    return (
                        <div
                            className={`day-cell h-10 flex items-center justify-center text-sm relative
                                ${isToday ? "bg-green-100 font-bold text-green-700 rounded-full" : ""}
                                ${inStreak && !isToday ? "streak-day bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors rounded-full" : ""}
                            `}
                            key={i}
                        >
                            {i + 1}
                            {inStreak && (
                                <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            )}
                        </div>
                    );
                })}

                {range(6 - weekDayObjOfLast).map(i => (
                    <div 
                        className='day-cell day-cell--faded h-10 flex items-center justify-center text-sm text-gray-400' 
                        key={i}
                    >
                        {dayObjOfLast.add(i+1, 'day').date()}
                    </div>
                ))}
            </div>
            
            {/* Streak tips */}
            <div className="streak-tips p-4 bg-green-50 text-xs text-gray-600 border-t border-green-100 flex justify-between">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                    <span>Ngày đã hoạt động</span>
                </div>
                <div className="flex items-center ml-4">
                    <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
                    <span>Hôm nay</span>
                </div>
            </div>
        </div>
    );
}

export default Calendar;