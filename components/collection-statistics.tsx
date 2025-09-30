"use client";

import React, { useState } from "react";
import { FilterControls } from "@/app/admin/dashboard/components/FilterControls";
import { MonthlyChart } from "@/app/admin/dashboard/components/MonthlyChart";
import { WeeklyHeatmap } from "@/app/admin/dashboard/components/WeeklyHeatmap";
import { RegionalPieChart } from "@/app/admin/dashboard/components/RegionalPieChart";
import { Top3Chart } from "@/app/admin/dashboard/components/Top3Chart";
import type {
  WeeklyData,
  PeriodOption,
  CollectionMethod,
} from "@/app/admin/dashboard/types";

type HeatmapCellResponse = {
  monthIndex?: number;
  columnIndex?: number;
  dayIndex?: number;
  weekIndex: number;
  amount: number;
  hasData: boolean;
};

export function CollectionStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("월별");
  const [selectedMethod, setSelectedMethod] =
    useState<CollectionMethod>("비니봇");
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  // 주차별 데이터 생성/조회 함수
  const fetchWeeklyData = React.useCallback(async (): Promise<WeeklyData[]> => {
    try {
      const periodMap: Record<PeriodOption, "monthly" | "weekly" | "daily"> = {
        월별: "monthly",
        주별: "weekly",
        일별: "daily",
      };
      const methodMap: Record<CollectionMethod, "robot" | "visit" | "both"> = {
        비니봇: "robot",
        방문수거: "visit",
      };

      const url = new URL(
        "/api/admin/statistics/heatmap",
        window.location.origin
      );
      url.searchParams.set("period", periodMap[selectedPeriod]);
      url.searchParams.set("method", methodMap[selectedMethod] || "both");

      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();
      const rows: HeatmapCellResponse[] = Array.isArray(json?.data)
        ? (json.data as HeatmapCellResponse[])
        : [];

      // API 응답을 WeeklyData로 매핑
      const mapped: WeeklyData[] = rows.map((r: HeatmapCellResponse) => ({
        monthIndex: typeof r.monthIndex === "number" ? r.monthIndex : undefined,
        columnIndex:
          typeof r.columnIndex === "number" ? r.columnIndex : undefined,
        dayIndex: typeof r.dayIndex === "number" ? r.dayIndex : undefined,
        weekIndex: typeof r.weekIndex === "number" ? r.weekIndex : 0,
        amount: typeof r.amount === "number" ? r.amount : 0,
        hasData: !!r.hasData,
      }));

      return mapped;
    } catch (error) {
      console.log("주차별 데이터 조회 실패:", error);
      return [];
    }
  }, [selectedPeriod, selectedMethod]);

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
              {selectedPeriod} 수거량
            </div>
            <MonthlyChart period={selectedPeriod} method={selectedMethod} />
            <WeeklyHeatmap
              data={weeklyData}
              year={2025}
              period={selectedPeriod}
            />
          </div>

          {/* Right Side Charts */}
          <div className="flex flex-col flex-1 gap-[30px] items-start max-md:gap-6">
            {/* Regional Statistics */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300 flex-1">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                지역별 통계
              </div>
              <RegionalPieChart
                period={selectedPeriod}
                method={selectedMethod}
              />
              <div className="text-xs text-gray-500 mt-2">최근 1년간</div>
            </div>

            {/* Top 3 Chart */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300 flex-1">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                수거량 Top3
              </div>
              <Top3Chart period={selectedPeriod} method={selectedMethod} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
