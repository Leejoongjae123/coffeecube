"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Search, RotateCcw, Calendar } from 'lucide-react';

interface VisitScheduleData {
  id: string;
  customerName: string;
  address: string;
  scheduledDate: string;
  visitDate: string;
  collectionAmount: string;
  status: 'normal' | 'selected';
}

const mockData: VisitScheduleData[] = [
  {
    id: '001',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '002',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'selected'
  },
  {
    id: '003',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '004',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '005',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '006',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '007',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '008',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '009',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  },
  {
    id: '010',
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: '2025-01-01-00:00:00',
    visitDate: '2025-01-01-00:00:00',
    collectionAmount: 'nn',
    status: 'normal'
  }
];

export default function VisitSchedulePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('오늘');
  const [startDate, setStartDate] = useState('2025-08-08');
  const [endDate, setEndDate] = useState('');
  const [searchCondition, setSearchCondition] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState(mockData);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const periods = ['오늘', '7일', '30일', '전체'];
  const searchConditions = ['전체', '주소', '수거량', '고객명'];

  const SortArrowIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.30018 3H7.70033C7.75501 3.00015 7.8086 3.01358 7.85534 3.03884C7.90208 3.06409 7.9402 3.10022 7.9656 3.14334C7.991 3.18645 8.00271 3.23492 7.99947 3.28352C7.99624 3.33211 7.97818 3.37901 7.94724 3.41915L5.24716 6.89201C5.13526 7.036 4.86585 7.036 4.75365 6.89201L2.05357 3.41915C2.02232 3.37909 2.00399 3.33217 2.00058 3.28349C1.99717 3.23481 2.00881 3.18623 2.03423 3.14303C2.05965 3.09982 2.09788 3.06365 2.14477 3.03843C2.19165 3.01322 2.24541 2.99992 2.30018 3Z" fill="#727272"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.83333 8.10938C3.64444 8.10938 3.48622 8.04538 3.35867 7.91738C3.23111 7.78938 3.16711 7.63115 3.16667 7.44271C3.16622 7.25426 3.23022 7.09604 3.35867 6.96804C3.48711 6.84004 3.64533 6.77604 3.83333 6.77604C4.02133 6.77604 4.17978 6.84004 4.30867 6.96804C4.43756 7.09604 4.50133 7.25426 4.5 7.44271C4.49867 7.63115 4.43467 7.7896 4.308 7.91804C4.18133 8.04649 4.02311 8.11026 3.83333 8.10938ZM6.5 8.10938C6.31111 8.10938 6.15289 8.04538 6.02533 7.91738C5.89778 7.78938 5.83378 7.63115 5.83333 7.44271C5.83289 7.25426 5.89689 7.09604 6.02533 6.96804C6.15378 6.84004 6.312 6.77604 6.5 6.77604C6.688 6.77604 6.84644 6.84004 6.97533 6.96804C7.10422 7.09604 7.168 7.25426 7.16667 7.44271C7.16533 7.63115 7.10133 7.7896 6.97467 7.91804C6.848 8.04649 6.68978 8.11026 6.5 8.10938ZM9.16667 8.10938C8.97778 8.10938 8.81956 8.04538 8.692 7.91738C8.56444 7.78938 8.50044 7.63115 8.5 7.44271C8.49956 7.25426 8.56356 7.09604 8.692 6.96804C8.82044 6.84004 8.97867 6.77604 9.16667 6.77604C9.35467 6.77604 9.51311 6.84004 9.642 6.96804C9.77089 7.09604 9.83467 7.25426 9.83333 7.44271C9.832 7.63115 9.768 7.7896 9.64133 7.91804C9.51467 8.04649 9.35644 8.11026 9.16667 8.10938ZM1.83333 13.4427C1.46667 13.4427 1.15289 13.3123 0.892 13.0514C0.631111 12.7905 0.500444 12.4765 0.5 12.1094V2.77604C0.5 2.40938 0.630667 2.0956 0.892 1.83471C1.15333 1.57382 1.46711 1.44315 1.83333 1.44271H2.5V0.109375H3.83333V1.44271H9.16667V0.109375H10.5V1.44271H11.1667C11.5333 1.44271 11.8473 1.57337 12.1087 1.83471C12.37 2.09604 12.5004 2.40982 12.5 2.77604V12.1094C12.5 12.476 12.3696 12.79 12.1087 13.0514C11.8478 13.3127 11.5338 13.4432 11.1667 13.4427H1.83333ZM1.83333 12.1094H11.1667V5.44271H1.83333V5.44271Z" fill="#727272"/>
    </svg>
  );

  const handleSearch = () => {
    console.log('Search triggered');
  };

  const handleReset = () => {
    setSelectedPeriod('오늘');
    setStartDate('2025-08-08');
    setEndDate('');
    setSearchCondition('전체');
    setSearchQuery('');
    console.log('Reset triggered');
  };

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const getRowStyle = (item: VisitScheduleData) => {
    return selectedItemId === item.id ? 'bg-blue-100' : '';
  };

  const getTextStyle = (item: VisitScheduleData) => {
    return selectedItemId === item.id ? 'text-sky-500' : 'text-stone-500';
  };

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="flex justify-between items-end p-8 rounded-2xl bg-stone-50 mb-4 max-md:flex-col max-md:gap-5 max-md:items-start max-md:p-5 max-sm:p-4">
        <div className="flex gap-14 items-start max-md:flex-col max-md:gap-5 max-md:items-start">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3 max-md:items-start">
            <div className="text-xl font-bold text-neutral-700 max-sm:text-base">
              방문일정
            </div>
            <div className="flex gap-3 items-center h-[39px] max-sm:flex-wrap max-sm:gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex gap-2.5 justify-center items-center px-4 py-2.5 rounded-[30px] max-sm:px-3 max-sm:py-2 transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-neutral-500 hover:bg-gray-300'
                  }`}
                >
                  <div className="text-sm font-bold text-center max-sm:text-xs">
                    {period}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3.5 items-center max-md:flex-col max-md:gap-2 max-md:items-start">
              <div className="text-base font-bold text-sky-500">
                직접 입력
              </div>
              <div className="flex gap-2.5 items-center rounded-md w-[306px] max-md:w-full max-sm:flex-col max-sm:gap-2">
                <div className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200 border-solid w-[140px] max-sm:w-full">
                  <div className="text-xs font-bold text-sky-500">
                    {startDate}
                  </div>
                  <CalendarIcon />
                </div>
                <div className="text-xs font-bold text-center text-neutral-500">
                  -
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200 border-solid w-[140px] max-sm:w-full">
                  <div className="text-xs text-neutral-500">
                    {endDate || '날짜 입력'}
                  </div>
                  <CalendarIcon />
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
            <div className="relative">
              <div 
                className="flex gap-3 items-center p-3 w-70 bg-white rounded-md border border-gray-200 border-solid max-md:w-full cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="flex gap-2 items-center">
                  <div className="text-xs font-bold text-sky-500">
                    {searchCondition}
                  </div>
                  <ChevronDown className="w-3 h-3 text-sky-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색조건을 입력해주세요"
                  className="text-xs text-neutral-500 bg-transparent border-none outline-none flex-1"
                />
              </div>
              
              {showDropdown && (
                <div className="absolute top-full left-0 z-10 flex flex-col gap-2.5 items-start px-4 py-2.5 w-16 bg-white rounded-md border border-gray-200 border-solid mt-1">
                  {searchConditions.map((condition) => (
                    <div
                      key={condition}
                      className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-700"
                      onClick={() => {
                        setSearchCondition(condition);
                        setShowDropdown(false);
                      }}
                    >
                      {condition}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center max-md:justify-between max-md:w-full max-sm:flex-col max-sm:gap-3">
          <Button
            onClick={handleSearch}
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-sky-500 rounded-lg w-[120px] max-sm:w-full hover:bg-sky-600"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="text-base font-bold text-white">검색</span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] max-sm:w-full hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 text-sky-500" />
            <span className="text-base font-bold text-sky-500">초기화</span>
          </Button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-5 items-center mb-4">
        <div className="text-xs font-bold text-neutral-500">
          정렬기준
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 border-solid">
            <div className="text-xs text-neutral-500">
              오름차순
            </div>
            <SortArrowIcon />
          </div>
          <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 border-solid">
            <div className="text-xs text-neutral-500">
              상태
            </div>
            <SortArrowIcon />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex flex-col items-start self-stretch max-md:overflow-x-auto">
        {/* Table Header */}
        <div className="flex justify-between items-center self-stretch px-4 py-0 rounded bg-zinc-100 max-md:min-w-[800px] max-sm:text-xs max-sm:min-w-[600px]">
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[60px] max-sm:w-10">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              번호
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-40 max-sm:w-20">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              고객명
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-80 max-sm:w-[200px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              주소
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px] max-sm:w-[120px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              방문 예정일
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px] max-sm:w-[120px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              방문일
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px] max-sm:w-[60px]">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              수거량
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleRowClick(item.id)}
            className={`flex justify-between items-center self-stretch px-4 py-0 rounded cursor-pointer hover:bg-gray-50 max-md:min-w-[800px] max-sm:text-xs max-sm:min-w-[600px] ${getRowStyle(item)}`}
          >
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[60px] max-sm:w-10">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.id}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-40 max-sm:w-20">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.customerName}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-80 max-sm:w-[200px]">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.address}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px] max-sm:w-[120px]">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.scheduledDate}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px] max-sm:w-[120px]">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.visitDate}
              </div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px] max-sm:w-[60px]">
              <div className={`text-xs text-center max-sm:text-xs ${getTextStyle(item)}`}>
                {item.collectionAmount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
