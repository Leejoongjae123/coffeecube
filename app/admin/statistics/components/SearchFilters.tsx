"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search, RotateCcw } from "lucide-react";

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
  onReset
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end p-8 rounded-2xl bg-stone-50 mb-4 gap-5 min-h-[107px]">
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
                  ? 'bg-primary text-white hover:bg-primary/90'
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
                  ? 'bg-primary text-white hover:bg-primary/90'
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
        <Button className="bg-primary text-white px-6 py-3 rounded-lg w-full lg:w-[120px]" onClick={onSearch}>
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-lg w-full lg:w-[120px]" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          초기화
        </Button>
      </div>
    </div>
  );
}
