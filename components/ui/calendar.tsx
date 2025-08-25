"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function Calendar({
  selected,
  onSelect,
  onConfirm,
  onCancel,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar grid
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Fill remaining cells to complete weeks
  while (calendarDays.length < 42) {
    calendarDays.push(null);
  }

  // Split into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(
      currentYear,
      currentMonth + (direction === "next" ? 1 : -1),
      1
    );
    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (onSelect) {
      onSelect(selectedDate);
    }
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth &&
      selected.getFullYear() === currentYear
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
      className={`flex flex-col gap-3 items-center px-0 py-3 bg-white rounded-2xl border-solid shadow-sm border-[1.4px] border-stone-300 w-[360px] min-h-[432px] max-md:mx-auto max-md:my-0 max-md:w-full max-md:max-w-[360px] max-sm:px-0 max-sm:py-2 max-sm:w-full max-sm:max-w-xs ${className}`}
    >
      {/* Header with navigation */}
      <div className="flex justify-between items-center self-stretch py-1 pr-3 pl-4 max-sm:py-1 max-sm:pr-2 max-sm:pl-3">
        <button
          onClick={() => navigateMonth("prev")}
          className="flex flex-col gap-2.5 justify-center items-center w-12 h-12"
        >
          <div className="flex gap-2.5 justify-center items-center rounded-[100px]">
            <div className="flex gap-2.5 justify-center items-center p-2">
              <ChevronLeft className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </button>

        <div className="flex flex-col gap-2.5 items-start">
          <div className="flex gap-2 justify-center items-center py-2.5 pr-1 pl-2 rounded-[100px]">
            <div className="text-sm tracking-normal leading-5 text-center text-neutral-700 max-sm:text-sm">
              {currentYear}년 {currentMonth + 1}월
            </div>
          </div>
        </div>

        <button
          onClick={() => navigateMonth("next")}
          className="flex flex-col gap-2.5 justify-center items-center w-12 h-12"
        >
          <div className="flex gap-2.5 justify-center items-center rounded-[100px]">
            <div className="flex gap-2.5 justify-center items-center p-2">
              <ChevronRight className="w-6 h-6 text-neutral-700" />
            </div>
          </div>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col items-center self-stretch px-3 py-0 ">
        {/* Days of the week header */}
        <div className="flex justify-center items-start self-stretch h-12">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="flex gap-2.5 justify-center items-center self-stretch flex-[1_0_0]"
            >
              <div className="text-base tracking-wide leading-6 text-center text-zinc-900 max-sm:text-sm">
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="flex justify-center items-start self-stretch h-12"
          >
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex gap-2.5 justify-center items-center self-stretch flex-[1_0_0]"
              >
                <button
                  className={`flex shrink-0 gap-2.5 justify-center items-center w-10 h-10 rounded-[100px] relative ${
                    day ? "hover:bg-gray-100" : ""
                  } ${day && isToday(day) ? "bg-sky-500 text-white" : ""} ${
                    day && isSelected(day) && !isToday(day)
                      ? "border-2 border-sky-400"
                      : ""
                  }`}
                  onClick={() => day && selectDate(day)}
                  disabled={!day}
                >
                  {day && (
                    <div
                      className={`text-base tracking-wide leading-6 text-center max-sm:text-sm ${
                        isToday(day)
                          ? "text-white"
                          : isSelected(day)
                          ? "text-sky-500"
                          : "text-zinc-900"
                      }`}
                    >
                      {day}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end items-center self-stretch px-3 py-0 max-sm:px-2 max-sm:py-0">
        <button
          onClick={onCancel}
          className="flex flex-col gap-2 justify-center items-center h-10 rounded-md hover:bg-gray-50 px-4"
        >
          <div className="text-sm tracking-normal leading-5 text-center text-gray-600 max-sm:text-sm">
            취소
          </div>
        </button>
        <button
          onClick={onConfirm}
          className="flex flex-col gap-2 justify-center items-center h-10 rounded-md hover:bg-sky-50 px-4"
        >
          <div className="text-sm tracking-normal leading-5 text-center text-sky-500 max-sm:text-sm">
            확인
          </div>
        </button>
      </div>
    </div>
  );
}
