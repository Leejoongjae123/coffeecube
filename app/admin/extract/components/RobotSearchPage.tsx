"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, RotateCcw } from "lucide-react";
import type { RobotData, RobotSearchFilters } from '../types';

interface RobotSearchPageProps {
  onSearch?: (filters: RobotSearchFilters) => void;
  onReset?: () => void;
}

export default function RobotSearchPage({ onSearch, onReset }: RobotSearchPageProps) {
  const [searchCondition, setSearchCondition] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('전체');
  const [sortOrder, setSortOrder] = useState('오름차순');
  const [sortBy, setSortBy] = useState('상태');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

  // Sample robot data matching the design
  const robotData: RobotData[] = [
    {
      id: '001',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '정상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '002',
      code: 'asdfghjkl001',
      isActive: 'N',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '장애 발생',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '003',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '장애 발생',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '004',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '005',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '006',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '007',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '008',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '009',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    },
    {
      id: '010',
      code: 'asdfghjkl001',
      isActive: 'Y',
      location: '서울 금천구 가산디지털1로 171',
      currentCollection: 'nn',
      status: '수거 대상',
      lastCollectionDate: '2025-01-01-00:00:00',
      installationDate: '2025-01-01-00:00:00',
      totalCollection: 'nn'
    }
  ];

  const searchConditions = ['전체', '비니봇 코드', '비니봇 위치'];
  const statusOptions = ['전체', '정상', '장애 발생', '수거 대상'];
  const sortOrders = ['오름차순', '내림차순'];
  const sortByOptions = ['상태', '비니봇 코드', '사용 여부', '현재 수거량'];

  const handleSearch = () => {
    onSearch?.({
      searchCondition,
      searchQuery,
      status
    });
  };

  const handleReset = () => {
    setSearchCondition('전체');
    setSearchQuery('');
    setStatus('전체');
    setSortOrder('오름차순');
    setSortBy('상태');
    onReset?.();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '정상':
        return 'text-green-700 bg-green-200';
      case '장애 발생':
        return 'text-rose-600 bg-red-100';
      case '수거 대상':
        return 'text-sky-600 bg-sky-200';
      default:
        return 'text-gray-600 bg-gray-200';
    }
  };

  const getRowStyle = (robot: RobotData) => {
    return selectedRobotId === robot.id ? 'text-sky-500 bg-blue-100' : '';
  };

  const handleRowClick = (robotId: string) => {
    setSelectedRobotId(selectedRobotId === robotId ? null : robotId);
  };

  return (
    <div className="w-full max-w-[1668px]">
      {/* Search Filter Section */}
      <div className="flex flex-wrap gap-10 justify-between items-end p-8 w-full rounded-2xl bg-stone-50 mb-4">
        <div className="flex flex-wrap gap-10 items-start min-w-60">
          {/* Search Condition */}
          <div className="flex gap-5 items-center min-w-60">
            <div className="text-xl font-semibold text-neutral-700">
              검색조건
            </div>
            <div className="flex gap-3 items-center p-3 w-80 text-xs bg-white rounded-md border border-gray-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-2 items-center font-bold text-sky-500 cursor-pointer">
                    <div className="text-sky-500">{searchCondition}</div>
                    <ChevronDown className="w-2.5 h-2.5" />
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
              <input
                type="text"
                placeholder="검색조건을 입력해주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 font-medium text-neutral-500 bg-transparent border-none outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-5 items-center whitespace-nowrap">
            <div className="text-xl font-semibold text-neutral-700">
              상태
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-6 justify-between items-center p-3 w-20 text-xs font-bold text-sky-500 bg-white rounded-md border border-gray-200 cursor-pointer">
                  <div className="text-sky-500">{status}</div>
                  <ChevronDown className="w-2.5 h-2.5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setStatus(option)}
                    className={status === option ? "text-sky-500 font-semibold" : ""}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center text-base font-semibold whitespace-nowrap min-w-60">
          <Button 
            onClick={handleSearch}
            className="flex gap-2.5 justify-center items-center py-3 text-white bg-sky-500 hover:bg-sky-600 rounded-lg w-[120px]"
          >
            <Search className="w-4 h-4" />
            <div>검색</div>
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex gap-2.5 justify-center items-center py-3 text-sky-500 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] hover:bg-sky-50 w-[120px]"
          >
            <RotateCcw className="w-4 h-4" />
            <div className="text-sky-500">초기화</div>
          </Button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-5 items-center self-end whitespace-nowrap text-neutral-500 text-xs mb-4">
        <div className="font-bold">정렬기준</div>
        <div className="flex gap-2 items-center font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 cursor-pointer">
                <div>{sortOrder}</div>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOrders.map((order) => (
                <DropdownMenuItem
                  key={order}
                  onClick={() => setSortOrder(order)}
                  className={sortOrder === order ? "text-sky-500 font-semibold" : ""}
                >
                  {order}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 cursor-pointer">
                <div>{sortBy}</div>
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortByOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={sortBy === option ? "text-sky-500 font-semibold" : ""}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full font-medium text-center text-stone-500 text-xs">
        {/* Table Header */}
        <div className="flex gap-10 justify-between items-center px-4 w-full font-bold rounded bg-zinc-100 text-neutral-600">
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[60px]">
            <div>번호</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px]">
            <div>비니봇 코드</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>사용 여부</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
            <div>비니봇 위치</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>현재 수거량</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20 whitespace-nowrap">
            <div>상태</div>
          </div>
          <div className="flex justify-center items-center px-2.5 py-4 w-[200px]">
            <div>마지막 수거일시</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
            <div>설치 일시</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>누적 총수거량</div>
          </div>
        </div>

        {/* Table Rows */}
        {robotData.map((robot) => (
          <div 
            key={robot.id}
            onClick={() => handleRowClick(robot.id)}
            className={`flex gap-10 justify-between items-center px-4 w-full rounded cursor-pointer hover:bg-gray-50 ${getRowStyle(robot)}`}
          >
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[60px]">
              <div>{robot.id}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[140px]">
              <div>{robot.code}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
              <div>{robot.isActive}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
              <div>{robot.location}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
              <div>{robot.currentCollection}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2 py-1.5 w-20 whitespace-nowrap">
              <div className={`px-2 py-1.5 font-semibold rounded-[100px] ${getStatusStyle(robot.status)}`}>
                {robot.status}
              </div>
            </div>
            <div className="flex justify-center items-center px-2.5 py-4 whitespace-nowrap w-[200px]">
              <div>{robot.lastCollectionDate}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[200px]">
              <div>{robot.installationDate}</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
              <div>{robot.totalCollection}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
