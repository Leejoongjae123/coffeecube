"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { ChevronDownIcon, SearchIcon, RotateCcwIcon } from "lucide-react";
import { SearchFiltersProps } from "../types";

const DateFilterButton = ({ 
  children, 
  active = false, 
  onClick 
}: { 
  children: React.ReactNode; 
  active?: boolean; 
  onClick?: () => void 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-[30px] text-sm font-bold whitespace-nowrap transition-colors ${
      active 
        ? "bg-sky-500 text-white" 
        : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
    }`}
  >
    {children}
  </button>
);

export default function SearchFilters({
  activeDateFilter,
  setActiveDateFilter,
  searchCondition,
  setSearchCondition,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: SearchFiltersProps) {
  const dateFilters = ["오늘", "7일", "30일", "90일", "전체"];
  const searchConditions = ["전체", "아이디", "휴대폰번호", "회원코드"];

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center p-8 mt-8 w-full rounded-2xl bg-stone-50 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 items-center min-w-60 max-md:max-w-full">
        {/* Date Filter Section */}
        <div className="flex flex-wrap gap-5 items-center font-semibold min-w-60 max-md:max-w-full">
          <div className="text-xl text-neutral-700">
            가입일
          </div>
          <div className="flex gap-3 items-center text-sm text-center whitespace-nowrap min-h-[39px] min-w-60 text-neutral-500">
            {dateFilters.map((filter, index) => (
              <DateFilterButton
                key={index}
                active={activeDateFilter === index}
                onClick={() => setActiveDateFilter(index)}
              >
                {filter}
              </DateFilterButton>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex gap-3.5 items-center min-w-60">
            <div className="text-base text-sky-500">
              직접 입력
            </div>
            <div className="flex overflow-hidden gap-2.5 items-center text-xs rounded-md min-w-60 text-neutral-500 w-[306px]">
              <DatePicker
                selected={startDate}
                onSelect={setStartDate}
                placeholder="시작 날짜"
              />
              <div className="text-center">
                -
              </div>
              <DatePicker
                selected={endDate}
                onSelect={setEndDate}
                placeholder="날짜 입력"
              />
            </div>
          </div>
        </div>

        {/* Search Condition */}
        <div className="flex gap-5 items-center min-w-60">
          <div className="text-xl font-semibold text-neutral-700">
            검색 조건
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-3 items-center p-3 w-60 text-xs bg-white rounded-md border border-gray-200 border-solid cursor-pointer">
                <div className="flex gap-2 items-center font-bold text-sky-500 whitespace-nowrap">
                  <div className="text-sky-500">
                    {searchCondition}
                  </div>
                  <ChevronDownIcon className="w-2.5 h-2.5" />
                </div>
                <div className="font-medium text-neutral-500">
                  검색조건을 입력해주세요
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {searchConditions.map((condition) => (
                <DropdownMenuItem
                  key={condition}
                  onClick={() => setSearchCondition(condition)}
                  className={searchCondition === condition ? "text-sky-500 font-semibold" : ""}
                >
                  {condition}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center text-base font-semibold whitespace-nowrap min-w-60">
        <Button className="flex overflow-hidden gap-2.5 justify-center items-center py-3 text-white bg-sky-500 hover:bg-sky-600 rounded-lg w-[120px]">
          <SearchIcon className="w-4 h-4" />
          검색
        </Button>
        <Button 
          variant="outline"
          className="flex overflow-hidden gap-2.5 justify-center items-center py-3 text-sky-500 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] hover:bg-sky-50"
        >
          <RotateCcwIcon className="w-4 h-4" />
          초기화
        </Button>
      </div>
    </div>
  );
}
