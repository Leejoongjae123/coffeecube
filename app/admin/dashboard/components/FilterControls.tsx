"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import type { FilterControlsProps } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function FilterControls({
  selectedPeriod,
  selectedMethod,
  onPeriodChange,
  onMethodChange,
  onSearch,
  onReset,
}: FilterControlsProps) {
  const periods = ["월별", "주별", "일별"] as const;
  const methods = ["비니봇", "방문수거"] as const;

  return (
    <div className="flex justify-between items-end p-8 w-full rounded-2xl bg-stone-50 max-sm:p-4">
      <div className="flex gap-14 items-center max-md:gap-8 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
        <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-3 max-sm:items-start">
          <div className="text-xl font-semibold text-neutral-700 max-md:text-lg max-sm:text-base">
            통계조건
          </div>
          <div className="flex gap-3 items-center h-[39px]">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => onPeriodChange(period)}
                className={`flex gap-2.5 justify-center items-center px-4 py-2.5 rounded-[30px] ${
                  selectedPeriod === period
                    ? "bg-primary text-white font-bold"
                    : "bg-gray-200 text-neutral-500 font-semibold"
                }`}
              >
                <div className="text-sm text-center">{period}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-3 max-sm:items-start">
          <div className="text-xl font-semibold text-neutral-700 max-md:text-lg max-sm:text-base">
            수거 방식
          </div>
          <RadioGroup
            value={selectedMethod}
            onValueChange={onMethodChange}
            className="flex gap-4 items-center"
          >
            {methods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <RadioGroupItem value={method} id={method} />
                <Label
                  htmlFor={method}
                  className="text-sm font-bold data-[state=checked]:text-primary"
                >
                  {method}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          onClick={onSearch}
          className="flex gap-2.5 justify-center items-center px-0 py-3 bg-primary rounded-lg w-[120px] max-sm:w-[100px] hover:bg-sky-600 h-[43px]"
        >
          <Search className="w-[17px] h-[17px] text-white" />
          <span className="text-base font-semibold text-white max-sm:text-sm">
            검색
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-primary border-solid border-[1.3px] w-[120px] max-sm:w-[100px] hover:bg-sky-50 h-[43px]"
        >
          <RotateCcw className="w-[17px] h-[17px] text-primary" />
          <span className="text-base font-semibold text-primary max-sm:text-sm">
            초기화
          </span>
        </Button>
      </div>
    </div>
  );
}
