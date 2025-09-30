"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlwaysVisibleCheckbox } from "@/components/ui/always-visible-checkbox";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import Image from "next/image";
import CustomDropdown from "@/components/ui/custom-dropdown";

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
  robotChecked,
  setRobotChecked,
  visitChecked,
  setVisitChecked,
  onSearch,
  onReset,
}: SearchFiltersProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 })
    .map((_, idx) => String(currentYear - idx))
    .map((y) => ({ label: `${y}년`, value: y }));
  const monthOptions = [
    { label: "전체", value: "전체" },
    { label: "1월", value: "01" },
    { label: "2월", value: "02" },
    { label: "3월", value: "03" },
    { label: "4월", value: "04" },
    { label: "5월", value: "05" },
    { label: "6월", value: "06" },
    { label: "7월", value: "07" },
    { label: "8월", value: "08" },
    { label: "9월", value: "09" },
    { label: "10월", value: "10" },
    { label: "11월", value: "11" },
    { label: "12월", value: "12" },
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end p-8 rounded-2xl bg-stone-50 mb-4 gap-5 min-h-[107px]">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start lg:items-center w-full">
        {/* Search Conditions */}
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">
            검색조건
          </Label>
          <div className="flex gap-3 items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-[30px] px-4 py-2.5 h-[37px] ${
                period === "daily"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
              }`}
              onClick={() => setPeriod("daily")}
            >
              <span className="text-sm font-bold">일별</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-[30px] px-4 py-2.5 h-[37px] ${
                period === "monthly"
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
              }`}
              onClick={() => setPeriod("monthly")}
            >
              <span className="text-sm font-bold">월별</span>
            </Button>
          </div>

          {(period === "daily" || period === "monthly") && (
            <div className="flex gap-3 items-center h-[38px]">
              <CustomDropdown
                value={year}
                options={yearOptions}
                onValueChange={setYear}
                width="w-24"
                arrowType="primary"
              />
              {period === "daily" && (
                <CustomDropdown
                  value={month}
                  options={monthOptions}
                  onValueChange={setMonth}
                  width="w-24"
                  arrowType="primary"
                />
              )}
            </div>
          )}
        </div>

        {/* Region Filters */}
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">
            지역
          </Label>
          <div className="flex gap-3 items-center flex-wrap">
            <CustomDropdown
              value={regionLevel1}
              options={[
                { label: "전체", value: "전체" },
                { label: "시흥시", value: "시흥시" },
              ]}
              onValueChange={(value) => {
                setRegionLevel1(value);
                if (value === "전체") {
                  setRegionLevel2("전체");
                } else {
                  setRegionLevel2("전체");
                }
              }}
              width="w-20"
              arrowType="primary"
            />

            {regionLevel1 === "시흥시" && (
              <CustomDropdown
                value={regionLevel2}
                options={[
                  { label: "전체", value: "전체" },
                  { label: "대야동", value: "대야동" },
                  { label: "계수동", value: "계수동" },
                  { label: "과림동", value: "과림동" },
                  { label: "신천동", value: "신천동" },
                  { label: "은행동", value: "은행동" },
                  { label: "안현동", value: "안현동" },
                  { label: "매화동", value: "매화동" },
                  { label: "무지내동", value: "무지내동" },
                  { label: "미산동", value: "미산동" },
                  { label: "방산동", value: "방산동" },
                  { label: "포동", value: "포동" },
                  { label: "도창동", value: "도창동" },
                  { label: "하중동", value: "하중동" },
                  { label: "하상동", value: "하상동" },
                  { label: "금이동", value: "금이동" },
                  { label: "논곡동", value: "논곡동" },
                  { label: "목감동", value: "목감동" },
                  { label: "조남동", value: "조남동" },
                  { label: "산현동", value: "산현동" },
                  { label: "물왕동", value: "물왕동" },
                  { label: "광석동", value: "광석동" },
                  { label: "장현동", value: "장현동" },
                  { label: "장곡동", value: "장곡동" },
                  { label: "능곡동", value: "능곡동" },
                  { label: "군자동", value: "군자동" },
                  { label: "화정동", value: "화정동" },
                  { label: "월곶동", value: "월곶동" },
                  { label: "거모동", value: "거모동" },
                  { label: "죽율동", value: "죽율동" },
                  { label: "정왕동", value: "정왕동" },
                ]}
                onValueChange={setRegionLevel2}
                width="w-24"
                arrowType="primary"
              />
            )}
          </div>
        </div>

        {/* Collection Method */}
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          <Label className="text-xl font-semibold text-neutral-700 max-sm:text-base">
            수거 방식
          </Label>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <AlwaysVisibleCheckbox
                checked={robotChecked}
                onCheckedChange={(checked) =>
                  setRobotChecked(checked as boolean)
                }
              />
              <Label
                className={`text-sm font-bold leading-5 ${
                  robotChecked ? "text-primary" : "text-[#909092]"
                }`}
              >
                비니봇
              </Label>
            </div>
            <div className="flex gap-2 items-center">
              <AlwaysVisibleCheckbox
                checked={visitChecked}
                onCheckedChange={(checked) =>
                  setVisitChecked(checked as boolean)
                }
              />
              <Label
                className={`text-sm font-bold leading-5 ${
                  visitChecked ? "text-primary" : "text-[#909092]"
                }`}
              >
                방문수거
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center justify-center lg:justify-end w-full lg:w-auto">
        <Button
          className="bg-primary text-white text-[16px] px-6 py-3 rounded-lg w-full lg:w-[120px] h-[43px]"
          onClick={onSearch}
        >
          <Search className="h-4 w-4 " />
          검색
        </Button>
        <Button
          variant="outline"
          className="border-primary  bg-white text-primary hover:bg-white/5 hover:text-primary text-[16px] px-6 py-3 rounded-lg w-full lg:w-[120px] h-[43px]"
          onClick={onReset}
        >
          <Image src="/refresh.svg" alt="refresh" width={24} height={24} />
          초기화
        </Button>
      </div>
    </div>
  );
}
