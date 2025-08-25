"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search, RotateCcw, FileSpreadsheet } from "lucide-react";
import StatisticsDetail from "./components/StatisticsDetail";

interface StatisticsData {
  date: string;
  robotCollection: string;
  visitCollection: string;
  total: string;
}

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState('collection');
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('07');
  const [regionLevel1, setRegionLevel1] = useState('전체');
  const [regionLevel2, setRegionLevel2] = useState('군');
  const [regionLevel3, setRegionLevel3] = useState('구');
  const [robotChecked, setRobotChecked] = useState(true);
  const [visitChecked, setVisitChecked] = useState(false);
  const [sortOrder, setSortOrder] = useState('오름차순');
  const [sortBy, setSortBy] = useState('상태');

  const mockData: StatisticsData[] = [
    { date: '07월 01일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 02일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 03일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 04일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 05일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 06일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 07일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 08일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 09일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
  ];

  return (
    <div className="relative bg-white mt-10 max-w-[1668px] w-full">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-700 max-sm:text-2xl">통계</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col gap-2.5 items-start border-b border-zinc-100 mb-8 w-full ">
        <div className="flex relative items-center">
          <Button
            variant="ghost"
            className={`px-5 h-[54px] rounded-none border-b-2 ${
              activeTab === 'collection' 
                ? 'border-b-[#0E8FEB] text-[#0E8FEB]' 
                : 'border-b-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('collection')}
          >
            <span className="text-lg font-semibold">수거량 통계</span>
          </Button>
          <Button
            variant="ghost"
            className={`px-5 h-[54px] rounded-none border-b-2 ${
              activeTab === 'details' 
                ? 'border-b-[#0E8FEB] text-[#0E8FEB]' 
                : 'border-b-transparent text-gray-600'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <span className="text-lg font-semibold">통계 상세</span>
          </Button>
        </div>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'collection' ? (
        <>
          {/* Search Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end p-8 rounded-2xl bg-stone-50 mb-8 gap-5">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start lg:items-center w-full">
              {/* Search Conditions */}
              <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">검색조건</Label>
                <div className="flex gap-3 items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 ${
                      period === 'daily'
                        ? 'bg-[#0E8FEB] text-white hover:bg-[#0E8FEB]/90'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setPeriod('daily')}
                  >
                    <span className="text-sm font-bold">일별</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 ${
                      period === 'monthly'
                        ? 'bg-[#0E8FEB] text-white hover:bg-[#0E8FEB]/90'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setPeriod('monthly')}
                  >
                    <span className="text-sm font-bold">월별</span>
                  </Button>
                </div>

                {/* Year and Month Dropdowns */}
                <div className="flex gap-3 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3 bg-white rounded-md border-gray-200">
                        <span className="text-xs font-bold text-primary">{year}</span>
                        <ChevronDown className="h-3 w-3 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setYear('2025')}>2025</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setYear('2024')}>2024</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setYear('2023')}>2023</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3 bg-white rounded-md border-gray-200">
                        <span className="text-xs font-bold text-primary">{month}</span>
                        <ChevronDown className="h-3 w-3 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <DropdownMenuItem key={i + 1} onClick={() => setMonth(String(i + 1).padStart(2, '0'))}>
                          {String(i + 1).padStart(2, '0')}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Region Filters */}
              <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">지역</Label>
                <div className="flex gap-3 items-center flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3 bg-white rounded-md border-gray-200">
                        <span className="text-xs font-bold text-primary">{regionLevel1}</span>
                        <ChevronDown className="h-3 w-3 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setRegionLevel1('전체')}>전체</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRegionLevel1('시')}>시</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3 bg-white rounded-md border-gray-200">
                        <span className="text-xs font-bold text-primary">{regionLevel2}</span>
                        <ChevronDown className="h-3 w-3 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setRegionLevel2('군')}>군</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRegionLevel2('구')}>구</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-3 bg-white rounded-md border-gray-200">
                        <span className="text-xs font-bold text-primary">{regionLevel3}</span>
                        <ChevronDown className="h-3 w-3 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setRegionLevel3('구')}>구</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRegionLevel3('동')}>동</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Collection Method */}
              <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
                <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">수거 방식</Label>
                <div className="flex gap-4 items-center">
                  <div className="flex gap-2 items-center">
                    <Checkbox
                      checked={robotChecked}
                      onCheckedChange={(checked) => setRobotChecked(checked as boolean)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label className="text-sm font-bold leading-5">비니봇</Label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Checkbox
                      checked={visitChecked}
                      onCheckedChange={(checked) => setVisitChecked(checked as boolean)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label className="text-sm font-bold leading-5">방문수거</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center justify-center lg:justify-end w-full lg:w-auto">
              <Button className="bg-primary text-white px-6 py-3 rounded-lg w-full lg:w-[120px]">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-lg w-full lg:w-[120px]">
                <RotateCcw className="h-4 w-4 mr-2" />
                초기화
              </Button>
            </div>
          </div>

          {/* Sort Controls and Export */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
              <Label className="text-xs font-bold text-neutral-500">정렬기준</Label>
              <div className="flex gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-4 py-2.5 bg-white rounded-md border-gray-200">
                      <span className="text-xs font-medium text-neutral-500">{sortOrder}</span>
                      <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortOrder('오름차순')}>오름차순</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('내림차순')}>내림차순</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-4 py-2.5 bg-white rounded-md border-gray-200">
                      <span className="text-xs font-medium text-neutral-500">{sortBy}</span>
                      <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('상태')}>상태</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('날짜')}>날짜</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('수거량')}>수거량</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 mr-3" />
              엑셀 저장
            </Button>
          </div>

          {/* Data Table */}
          <div className="flex flex-col items-start w-full overflow-x-auto">
            {/* Table Header */}
            <div className="flex justify-between items-center w-full rounded bg-zinc-100 min-w-[560px] font-bold">
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center">날짜</span>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center">비니봇 수거량</span>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center">방문 수거량</span>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center">합계</span>
              </div>
            </div>

            {/* Table Rows */}
            {mockData.map((row, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full rounded min-w-[560px] border-b border-gray-100 last:border-b-0"
              >
                <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                  <span className="text-xs text-center">{row.date}</span>
                </div>
                <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                  <span className="text-xs text-center">{row.robotCollection}</span>
                </div>
                <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                  <span className="text-xs text-center">{row.visitCollection}</span>
                </div>
                <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                  <span className="text-xs text-center">{row.total}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <StatisticsDetail />
      )}
    </div>
  );
}
