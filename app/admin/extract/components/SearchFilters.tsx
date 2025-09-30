"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlwaysVisibleCheckbox } from "@/components/ui/always-visible-checkbox";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw } from "lucide-react";
import Image from "next/image";

interface SearchFiltersProps {
  period: string;
  setPeriod: (period: string) => void;
  year: string;
  setYear: (year: string) => void;
  month: string;
  setMonth: (month: string) => void;
  regionLevel1: string;
  setRegionLevel1: (region: string) => void;
  regionLevel2: string;
  setRegionLevel2: (region: string) => void;
  regionLevel3: string;
  setRegionLevel3: (region: string) => void;
  robotChecked: boolean;
  setRobotChecked: (checked: boolean) => void;
  visitChecked: boolean;
  setVisitChecked: (checked: boolean) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function SearchFilters({
  period,
  setPeriod,
  year,
  setYear,
  month,
  setMonth,
  regionLevel1,
  setRegionLevel1,
  regionLevel2,
  setRegionLevel2,
  regionLevel3,
  setRegionLevel3,
  robotChecked,
  setRobotChecked,
  visitChecked,
  setVisitChecked,
  onSearch,
  onReset,
}: SearchFiltersProps) {
  const periods = ["일간", "주간", "월간", "연간"];
  const years = ["2023", "2024", "2025"];
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const regionsLevel1 = [
    "전체",
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
  ];
  const regionsLevel2 = ["군", "시", "구"];
  const regionsLevel3 = ["구", "동", "면"];

  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 기간 선택 */}
        <div className="space-y-2">
          <Label htmlFor="period" className="text-sm font-medium text-gray-700">
            기간
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {period}
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {periods.map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPeriod(p)}>
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 연도 선택 */}
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium text-gray-700">
            연도
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {year}년
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {years.map((y) => (
                <DropdownMenuItem key={y} onClick={() => setYear(y)}>
                  {y}년
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 월 선택 */}
        <div className="space-y-2">
          <Label htmlFor="month" className="text-sm font-medium text-gray-700">
            월
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {month}월
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {months.map((m) => (
                <DropdownMenuItem key={m} onClick={() => setMonth(m)}>
                  {m}월
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 지역 레벨 1 */}
        <div className="space-y-2">
          <Label
            htmlFor="region1"
            className="text-sm font-medium text-gray-700"
          >
            지역(시/도)
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {regionLevel1}
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {regionsLevel1.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => setRegionLevel1(region)}
                >
                  {region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 지역 레벨 2 */}
        <div className="space-y-2">
          <Label
            htmlFor="region2"
            className="text-sm font-medium text-gray-700"
          >
            지역(군/시/구)
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {regionLevel2}
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {regionsLevel2.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => setRegionLevel2(region)}
                >
                  {region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 지역 레벨 3 */}
        <div className="space-y-2">
          <Label
            htmlFor="region3"
            className="text-sm font-medium text-gray-700"
          >
            지역(구/동/면)
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-[38px]"
              >
                {regionLevel3}
                <Image
                  src="/arrow_down.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {regionsLevel3.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => setRegionLevel3(region)}
                >
                  {region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 체크박스 섹션 */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <AlwaysVisibleCheckbox
            id="robot"
            checked={robotChecked}
            onCheckedChange={(checked) => setRobotChecked(!!checked)}
          />
          <Label
            htmlFor="robot"
            className={`text-sm font-bold leading-5 ${
              robotChecked ? "text-primary" : "text-[#909092]"
            }`}
          >
            로봇 수거량
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <AlwaysVisibleCheckbox
            id="visit"
            checked={visitChecked}
            onCheckedChange={(checked) => setVisitChecked(!!checked)}
          />
          <Label
            htmlFor="visit"
            className={`text-sm font-bold leading-5 ${
              visitChecked ? "text-primary" : "text-[#909092]"
            }`}
          >
            방문 수거량
          </Label>
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="flex gap-3">
        <Button onClick={onSearch} className="flex items-center gap-2 h-[43px]">
          <Search className="h-4 w-4" />
          <span className="text-[16px] font-semibold text-white">검색</span>
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2 h-[43px]"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="text-[16px] font-semibold text-sky-500">초기화</span>
        </Button>
      </div>
    </div>
  );
}
