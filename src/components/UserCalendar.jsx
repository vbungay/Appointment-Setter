import React, { useState, useEffect } from "react";
import { generateDaysArray } from "./days";
import { formatMonthName } from "./utils";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "tailwindcss/tailwind.css";

const isCurrentDay = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const UserCalendar = ({ year, month }) => {
    const [calendarYear, setCalendarYear] = useState(year);
    const [calendarMonth, setCalendarMonth] = useState(month);
    const [daysArray, setDaysArray] = useState(generateDaysArray(year, month));
    const monthName = formatMonthName(calendarMonth);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    useEffect(() => {
        setDaysArray(generateDaysArray(calendarYear, calendarMonth));
    }, [calendarYear, calendarMonth]);

    const handlePreviousMonthClick = () => {
        if (calendarMonth === 1) {
            setCalendarMonth(12);
            setCalendarYear(calendarYear - 1);
        } else {
            setCalendarMonth(calendarMonth - 1);
        }
    };

    const handleNextMonthClick = () => {
        if (calendarMonth === 12) {
            setCalendarMonth(1);
            setCalendarYear(calendarYear + 1);
        } else {
            setCalendarMonth(calendarMonth + 1);
        }
    };

    const weeksInMonth = Math.ceil(daysArray.length / 7);
    const boxHeight = `h-${Math.floor(100 / (weeksInMonth + 1))}`;

    return (
        <div className="container mx-auto h-screen overflow-hidden">
            <div className="text-center my-4 text-xl font-md flex justify-center items-center">
                <FiChevronLeft className="mr-4" onClick={handlePreviousMonthClick} />
                {monthName} {calendarYear}
                <FiChevronRight className="ml-4" onClick={handleNextMonthClick} />
            </div>
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-7">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            className="bg-white text-gray-700 border border-gray-200 flex flex-col items-center justify-start p-1 h-full w-full"
                        >
                            <span className="text-xs font-semibold uppercase mb-1">{day}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-shrink h-full gap-0">
                    {daysArray.map((dayObj, index) => (
                        <div
                            key={index}
                            className={`${dayObj.isCurrentMonth
                                ? isCurrentDay(dayObj.date)
                                    ? "bg-white text-gray-700 border border-t-4 border-sky-700"
                                    : "bg-white text-gray-700 border border-gray-200"
                                : "bg-gray-200 text-gray-500"
                                } flex flex-col items-center justify-start p-2 ${boxHeight} w-full`}
                        >
                            {dayObj.day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserCalendar;
