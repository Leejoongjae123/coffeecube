"use client";

import React, { useState } from "react";
import { FilterControls } from "@/app/admin/dashboard/components/FilterControls";
import { MonthlyChart } from "@/app/admin/dashboard/components/MonthlyChart";
import { WeeklyHeatmap } from "@/app/admin/dashboard/components/WeeklyHeatmap";
import { RegionalPieChart } from "@/app/admin/dashboard/components/RegionalPieChart";
import { Top3Chart } from "@/app/admin/dashboard/components/Top3Chart";
import type { WeeklyData } from "@/app/admin/dashboard/types";

export function CollectionStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState("월별");
  const [selectedMethod, setSelectedMethod] = useState("비니봇");
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  // Mock 데이터 생성 함수 (개발용)
  const generateMockWeeklyData = (): WeeklyData[] => {
    const data: WeeklyData[] = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // 모든 월(0-11)과 주차별 데이터 생성
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const weeksInMonth = Math.ceil(
        new Date(2025, monthIndex + 1, 0).getDate() / 7
      );

      for (let weekIndex = 0; weekIndex < weeksInMonth; weekIndex++) {
        // 현재 월 이후의 데이터는 생성하지 않음
        const isFutureData = monthIndex > currentMonth;

        // 과거 데이터 중 일부는 빈 값으로 설정
        const hasData = !isFutureData && Math.random() > 0.2;
        const amount = hasData ? Math.floor(Math.random() * 30) : 0;

        data.push({
          monthIndex,
          weekIndex,
          amount,
          hasData,
        });
      }
    }

    return data;
  };

  // 주차별 데이터 생성/조회 함수
  const fetchWeeklyData = React.useCallback(async (): Promise<WeeklyData[]> => {
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/admin/weekly-statistics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ period: selectedPeriod, method: selectedMethod })
      // });
      // const result = await response.json();
      // return result.data;

      // 임시 Mock 데이터 생성
      return generateMockWeeklyData();
    } catch (error) {
      console.log("주차별 데이터 조회 실패:", error);
      return [];
    }
  }, []);

  const handleSearch = async () => {
    try {
      // 검색 실행 시 데이터 재조회
      const newData = await fetchWeeklyData();
      setWeeklyData(newData);
      console.log("검색 실행", { selectedPeriod, selectedMethod });
    } catch (error) {
      console.log("검색 중 오류 발생:", error);
    }
  };

  const handleReset = async () => {
    setSelectedPeriod("월별");
    setSelectedMethod("비니봇");

    // 초기화 후 데이터 다시 로드
    try {
      const initialData = await fetchWeeklyData();
      setWeeklyData(initialData);
    } catch (error) {
      console.log("초기화 중 오류 발생:", error);
      setWeeklyData([]);
    }
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const initialData = await fetchWeeklyData();
        setWeeklyData(initialData);
      } catch (error) {
        console.log("초기 데이터 로드 실패:", error);
      }
    };

    loadInitialData();
  }, [fetchWeeklyData]);

  return (
    <div className="flex flex-col gap-8 items-start w-full min-h-screen bg-white">
      {/* Filter Controls */}
      <FilterControls
        selectedPeriod={selectedPeriod}
        selectedMethod={selectedMethod}
        onPeriodChange={setSelectedPeriod}
        onMethodChange={setSelectedMethod}
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
            <WeeklyHeatmap data={weeklyData} year={2025} />
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
