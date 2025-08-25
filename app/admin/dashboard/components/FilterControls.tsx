"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Check } from "lucide-react";
import type { FilterControlsProps } from '../types';

export function FilterControls({
  selectedPeriod,
  selectedMethods,
  onPeriodChange,
  onMethodToggle,
  onSearch,
  onReset
}: FilterControlsProps) {
  const periods = ['월별', '주별', '일별'];
  const methods = ['비니봇', '방문수거'];

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
                    ? 'bg-primary text-white font-bold' 
                    : 'bg-gray-200 text-neutral-500 font-semibold'
                }`}
              >
                <div className="text-sm text-center">
                  {period}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-3 max-sm:items-start">
          <div className="text-xl font-semibold text-neutral-700 max-md:text-lg max-sm:text-base">
            수거 방식
          </div>
          <div className="flex gap-2 items-center">
            {methods.map((method) => {
              const isSelected = selectedMethods.includes(method);
              return (
                <div key={method} className="flex gap-2 items-center">
                  <div className="relative">
                    <div className={`w-[17px] h-[17px] rounded-full border-[1.2px] flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'bg-gray-400 border-gray-400'
                    }`}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-white stroke-[1.2]" />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onMethodToggle(method)}
                    className={`text-sm font-bold ${
                      isSelected ? 'text-primary' : 'text-neutral-400 font-semibold'
                    }`}
                  >
                    {method}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <Button onClick={onSearch} className="flex gap-2.5 justify-center items-center px-0 py-3 bg-primary rounded-lg w-[120px] max-sm:w-[100px] hover:bg-sky-600">
          <Search className="w-[17px] h-[17px] text-white" />
          <span className="text-base font-semibold text-white max-sm:text-sm">
            검색
          </span>
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-primary border-solid border-[1.3px] w-[120px] max-sm:w-[100px] hover:bg-sky-50"
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
