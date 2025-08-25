"use client";

import React, { useState } from 'react';
import { FilterControls } from '@/app/admin/dashboard/components/FilterControls';
import { MonthlyChart } from '@/app/admin/dashboard/components/MonthlyChart';
import { WeeklyHeatmap } from '@/app/admin/dashboard/components/WeeklyHeatmap';
import { RegionalPieChart } from '@/app/admin/dashboard/components/RegionalPieChart';
import { Top3Chart } from '@/app/admin/dashboard/components/Top3Chart';

export function CollectionStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('월별');
  const [selectedMethods, setSelectedMethods] = useState(['비니봇', '방문수거']);

  const toggleMethod = (method: string) => {
    setSelectedMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('검색 실행', { selectedPeriod, selectedMethods });
  };

  const handleReset = () => {
    setSelectedPeriod('월별');
    setSelectedMethods(['비니봇', '방문수거']);
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full min-h-screen bg-white">
      {/* Filter Controls */}
      <FilterControls
        selectedPeriod={selectedPeriod}
        selectedMethods={selectedMethods}
        onPeriodChange={setSelectedPeriod}
        onMethodToggle={toggleMethod}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Charts Section */}
      <div className="flex flex-col gap-11 items-start w-full max-md:gap-6">
        <div className="flex gap-11 items-stretch w-full max-md:flex-col max-md:gap-6">
          {/* Monthly Collection Chart */}
          <div className="flex flex-col flex-1 gap-3 justify-center items-center px-8 py-6 bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300">
            <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
              2025년 월별 수거량
            </div>
            <MonthlyChart />
            <WeeklyHeatmap />
          </div>

          {/* Right Side Charts */}
          <div className="flex flex-col flex-1 gap-[30px] items-start max-md:gap-6">
            {/* Regional Statistics */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300 flex-1">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                2025년 지역별 통계
              </div>
              <RegionalPieChart />
            </div>

            {/* Top 3 Chart */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300 flex-1">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                2025년 수거량 Top3
              </div>
              <Top3Chart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
