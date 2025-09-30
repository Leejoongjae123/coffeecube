"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, RotateCcw } from "lucide-react";
import {
  VisitScheduleData,
  VisitScheduleApiResponse,
  ExtractHistoryRow,
} from "../types";
import VisitEditModal from "@/app/admin/extract/components/VisitEditModal";

// 실제 데이터로 변환하는 함수
const convertToVisitScheduleData = (
  historyData: ExtractHistoryRow[]
): VisitScheduleData[] => {
  return historyData.map((item) => ({
    id: item.id,
    customerName: item.customer_name,
    address: item.address,
    visitDate: item.visit_date,
    robotCode: item.robot_code || undefined,
    collectionAmount: item.collection_amount.toString(),
    status: "normal" as const,
  }));
};

export default function VisitSchedulePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isDirectInputActive, setIsDirectInputActive] = useState(false);
  const [searchCondition, setSearchCondition] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<VisitScheduleData[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<
    VisitScheduleData | undefined
  >(undefined);

  const periods = ["전체", "7일", "30일", "오늘"];
  const searchConditions = ["전체", "주소", "담당자명", "수거량", "로봇코드"];

  const SortArrowIcon = () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.30018 3H7.70033C7.75501 3.00015 7.8086 3.01358 7.85534 3.03884C7.90208 3.06409 7.9402 3.10022 7.9656 3.14334C7.991 3.18645 8.00271 3.23492 7.99947 3.28352C7.99624 3.33211 7.97818 3.37901 7.94724 3.41915L5.24716 6.89201C5.13526 7.036 4.86585 7.036 4.75365 6.89201L2.05357 3.41915C2.02232 3.37909 2.00399 3.33217 2.00058 3.28349C1.99717 3.23481 2.00881 3.18623 2.03423 3.14303C2.05965 3.09982 2.09788 3.06365 2.14477 3.03843C2.19165 3.01322 2.24541 2.99992 2.30018 3Z"
        fill="#727272"
      />
    </svg>
  );

  // 데이터 페칭 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedPeriod !== "전체" && selectedPeriod !== "") {
        params.append("period", selectedPeriod);
      }
      if (isDirectInputActive && startDate) {
        params.append("startDate", startDate.toISOString().split("T")[0]);
      }
      if (isDirectInputActive && endDate) {
        params.append("endDate", endDate.toISOString().split("T")[0]);
      }
      if (searchCondition) {
        params.append("searchCondition", searchCondition);
      }
      if (searchQuery) {
        params.append("searchQuery", searchQuery);
      }

      const response = await fetch(
        `/api/admin/extract/history?${params.toString()}`
      );
      const result: VisitScheduleApiResponse = await response.json();

      if (response.ok && result.data) {
        const convertedData = convertToVisitScheduleData(result.data);
        setData(convertedData);
      }
    } catch (error) {
      console.error("데이터 조회 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    setSelectedPeriod("전체");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsDirectInputActive(false);
    setSearchCondition("전체");
    setSearchQuery("");
    fetchData();
  };

  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period);
    setIsDirectInputActive(false);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDirectInputClick = () => {
    setIsDirectInputActive(true);
    setSelectedPeriod("");
  };

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const getRowStyle = (item: VisitScheduleData) => {
    return selectedItemId === item.id ? "bg-blue-100" : "";
  };

  const getTextStyle = (item: VisitScheduleData) => {
    return selectedItemId === item.id ? "text-sky-500" : "text-stone-500";
  };

  const handleEditVisit = (visit: VisitScheduleData) => {
    setSelectedVisit(visit);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVisit(undefined);
  };

  const handleSaveVisit = () => {
    // 데이터 새로고침
    fetchData();
  };

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="flex justify-between items-end p-8 rounded-2xl bg-stone-50 mb-4 max-md:flex-col max-md:gap-5 items-center max-md:p-5 max-sm:p-4">
        <div className="flex gap-14 items-start max-md:flex-col max-md:gap-5 max-md:items-start">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3 max-md:items-start">
            <div className="text-xl font-bold text-neutral-700 max-sm:text-base">
              방문일정
            </div>
            <div className="flex gap-3 items-center h-[39px] max-sm:flex-wrap max-sm:gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodClick(period)}
                  className={`flex gap-2.5 justify-center items-center px-4 py-2.5 rounded-[30px] max-sm:px-3 max-sm:py-2 transition-colors ${
                    selectedPeriod === period && !isDirectInputActive
                      ? "bg-primary text-white"
                      : isDirectInputActive
                      ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
                  }`}
                >
                  <div className="text-sm font-bold text-center max-sm:text-xs">
                    {period}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3.5 items-center max-md:flex-col max-md:gap-2 max-md:items-start">
              <button
                onClick={handleDirectInputClick}
                className={`text-base transition-colors cursor-pointer ${
                  isDirectInputActive
                    ? "font-bold text-primary"
                    : "font-normal text-neutral-500 hover:text-neutral-700"
                }`}
              >
                직접 입력
              </button>
              <div className="flex gap-2.5 items-center rounded-md w-[306px] max-md:w-full max-sm:flex-col max-sm:gap-2">
                <div
                  className={`${
                    !isDirectInputActive ? "pointer-events-none" : ""
                  }`}
                >
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    placeholder="시작 날짜"
                    className={`w-[140px] max-sm:w-full rounded-md border ${
                      isDirectInputActive
                        ? "bg-white border-gray-200 cursor-pointer"
                        : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                    }`}
                    icon="/calendar.svg"
                  />
                </div>
                <div className="text-xs font-bold text-center text-neutral-500">
                  -
                </div>
                <div
                  className={`${
                    !isDirectInputActive ? "pointer-events-none" : ""
                  }`}
                >
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    placeholder="종료 날짜"
                    className={`w-[140px] max-sm:w-full rounded-md border ${
                      isDirectInputActive
                        ? "bg-white border-gray-200 cursor-pointer"
                        : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                    }`}
                    icon="/calendar.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-center max-md:mt-5">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3 max-md:items-start">
            <div className="text-xl font-bold text-neutral-700 max-sm:text-base">
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

        <div className="flex gap-2 items-center gap-3 justify-center items-center h-full">
          <Button
            onClick={handleSearch}
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-sky-500 rounded-lg w-[120px] max-sm:w-full hover:bg-sky-600 h-[43px]"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="text-[16px] font-semibold text-white">검색</span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] max-sm:w-full hover:bg-gray-50 h-[43px]"
          >
            <RotateCcw className="w-4 h-4 text-sky-500" />
            <span className="text-[16px] font-semibold text-sky-500">초기화</span>
          </Button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-5 items-center mb-4">
        <div className="text-xs font-bold text-neutral-500">정렬기준</div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 border-solid">
            <div className="text-xs text-neutral-500">오름차순</div>
            <SortArrowIcon />
          </div>
          <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 border-solid">
            <div className="text-xs text-neutral-500">상태</div>
            <SortArrowIcon />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex flex-col items-start self-stretch max-md:overflow-x-auto">
        {/* Table Header */}
        <div className="flex justify-between items-center self-stretch px-4 py-0 rounded bg-zinc-100 max-md:min-w-[700px] max-sm:text-xs max-sm:min-w-[500px]">
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[60px] max-sm:w-10">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              번호
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-40 max-sm:w-20">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              담당자명
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-80 max-sm:w-[200px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              주소
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[150px] max-sm:w-[100px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              방문일
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[120px] max-sm:w-[80px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              로봇코드
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px] max-sm:w-[60px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              수거량
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              관리
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {loading ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="text-neutral-500 text-base">
              데이터를 불러오는 중...
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="text-neutral-500">데이터가 없습니다.</div>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              className={`flex justify-between items-center self-stretch px-4 py-0 rounded cursor-pointer hover:bg-gray-50 max-md:min-w-[700px] max-sm:text-xs max-sm:min-w-[500px] ${getRowStyle(
                item
              )}`}
            >
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[60px] max-sm:w-10">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.id.slice(-3)}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-40 max-sm:w-20">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.customerName}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-80 max-sm:w-[200px]">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.address}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[150px] max-sm:w-[100px]">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.visitDate}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[120px] max-sm:w-[80px]">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.robotCode || "-"}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px] max-sm:w-[60px]">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.collectionAmount}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20">
                <div
                  className="flex gap-1 justify-center items-center cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditVisit(item);
                  }}
                >
                  <Image
                    src="/setting.svg"
                    alt="setting"
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center text-xs">수정</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visit Edit Modal */}
      <VisitEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        visitData={selectedVisit}
        onSave={handleSaveVisit}
      />
    </div>
  );
}
