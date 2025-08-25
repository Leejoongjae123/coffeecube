"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ selected, onSelect, placeholder = "날짜 입력", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(selected);


  const handleConfirm = () => {
    if (selectedDate && onSelect) {
      onSelect(selectedDate);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedDate(selected);
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd", { locale: ko });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex overflow-hidden gap-4 justify-between items-center p-3 font-medium bg-transparent rounded-md border-0 text-neutral-500 w-full text-xs",
            className
          )}
        >
          <div className="w-full text-left">
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </div>
          <CalendarIcon className="w-4 h-4 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0 shadow-none" align="start">
        <Calendar
          selected={selectedDate}
          onSelect={setSelectedDate}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          className="w-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
