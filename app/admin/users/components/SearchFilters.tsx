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
import { SearchIcon, RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import { SearchFiltersProps } from "../types";

const DateFilterButton = ({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
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
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isDirectInputActive,
  setIsDirectInputActive,
  onSearch,
  onReset,
}: SearchFiltersProps) {
  const dateFilters = ["전체", "7일", "30일", "90일"];
  const searchConditions = ["전체", "아이디", "휴대폰번호"];

  const handleDateFilterClick = (index: number) => {
    setActiveDateFilter(index);
    setIsDirectInputActive(false);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDirectInputClick = () => {
    setIsDirectInputActive(true);
    setActiveDateFilter(-1); // 날짜 필터 버튼 선택 해제

    // 항상 기본값으로 한 달 전부터 오늘까지 설정
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setStartDate(oneMonthAgo);
    setEndDate(today);
  };

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center p-8 mt-8 w-full rounded-2xl bg-stone-50 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 items-center min-w-60 max-md:max-w-full">
        {/* Date Filter Section */}
        <div className="flex flex-wrap gap-5 items-center font-semibold min-w-60 max-md:max-w-full">
          <div className="text-xl text-neutral-700">가입일</div>
          <div className="flex gap-3 items-center text-sm text-center whitespace-nowrap min-h-[39px] min-w-60 text-neutral-500">
            {dateFilters.map((filter, index) => (
              <DateFilterButton
                key={index}
                active={activeDateFilter === index && !isDirectInputActive}
                onClick={() => handleDateFilterClick(index)}
              >
                {filter}
              </DateFilterButton>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex gap-3.5 items-center min-w-60">
            <button
              onClick={handleDirectInputClick}
              className={`text-base transition-colors cursor-pointer ${
                isDirectInputActive
                  ? "font-bold text-sky-500"
                  : "font-normal text-neutral-500 hover:text-neutral-700"
              }`}
            >
              직접 입력
            </button>
            <div className="flex overflow-hidden gap-2.5 items-center text-xs rounded-md min-w-60 text-neutral-500 w-[306px]">
              <div
                className={`${
                  !isDirectInputActive ? "pointer-events-none" : ""
                }`}
              >
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholder="시작 날짜"
                  className={`w-[140px] rounded-md border ${
                    isDirectInputActive
                      ? "bg-white border-gray-200 cursor-pointer"
                      : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  }`}
                />
              </div>
              <div className="text-center">-</div>
              <div
                className={`${
                  !isDirectInputActive ? "pointer-events-none" : ""
                }`}
              >
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholder="종료 날짜"
                  className={`w-[140px] rounded-md border ${
                    isDirectInputActive
                      ? "bg-white border-gray-200 cursor-pointer"
                      : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Condition */}
        <div className="flex gap-5 items-center min-w-60">
          <div className="text-xl font-semibold text-neutral-700">
            검색 조건
          </div>
          <div className="flex gap-3 items-center px-3 py-2 h-[38px] w-80 text-xs bg-white rounded-md border border-gray-200 max-md:w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center font-bold text-sky-500 cursor-pointer">
                  <div className="text-sky-500">{searchCondition}</div>
                  <Image 
                    src="/arrow_down.svg" 
                    alt="dropdown arrow" 
                    width={10} 
                    height={7} 
                    className="flex-shrink-0"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {searchConditions.map((condition) => (
                  <DropdownMenuItem
                    key={condition}
                    onClick={() => setSearchCondition(condition)}
                    className={
                      searchCondition === condition
                        ? "text-sky-500 font-semibold"
                        : ""
                    }
                  >
                    {condition}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type="text"
              placeholder="검색조건을 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 font-medium text-neutral-500 bg-transparent border-none outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center text-base font-semibold whitespace-nowrap min-w-60">
        <Button
          onClick={onSearch}
          className="flex overflow-hidden gap-2.5 justify-center items-center py-3 text-white bg-sky-500 hover:bg-sky-600 rounded-lg w-[120px] h-[43px]"
        >
          <SearchIcon className="w-4 h-4" />
          <span className="text-[16px] font-semibold text-white">
          검색
          </span>
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex overflow-hidden gap-2.5 justify-center items-center py-3 text-sky-500 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] hover:bg-sky-50 h-[43px]"
        >
          <RotateCcwIcon className="w-4 h-4" />
          <span className="text-[16px] font-semibold text-sky-500">
            초기화
          </span>
        </Button>
      </div>
    </div>
  );
}
