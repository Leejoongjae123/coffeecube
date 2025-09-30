"use client";

import React from "react";
import type { WeeklyHeatmapProps, PeriodOption } from "../types";

export function WeeklyHeatmap({ data = [], period }: WeeklyHeatmapProps) {
  // 공통 주차 라벨: 1~5주차 고정
  const weekLabels = Array.from({ length: 5 }, (_, i) => `${i + 1}주차`);

  // 월별: 과거 12개월 ~ 현재월
  const buildLast12Months = () => {
    const now = new Date();
    const months: { label: string; year: number; month: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: `${d.getMonth() + 1}월`,
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return months;
  };

  const monthColumns = React.useMemo(() => buildLast12Months(), []);

  const dayLabels = React.useMemo(
    () => Array.from({ length: 31 }, (_, i) => `${i + 1}일`),
    []
  );

  // 일별 모드용 Y축(최근 5개월)
  const monthRows = React.useMemo(
    () => monthColumns.slice(Math.max(0, monthColumns.length - 5)),
    [monthColumns]
  );

  // Y축 라벨 (월/주: 주차, 일: 최근 5개월)
  const yAxisLabels = React.useMemo(
    () => (period === "일별" ? monthRows.map((m) => m.label) : weekLabels),
    [period, monthRows, weekLabels]
  );

  const getIntensityClassByAmount = (amount?: number) => {
    if (!amount || amount === 0) {
      return "bg-gray-100";
    }
    if (amount <= 3) {
      return "bg-sky-100";
    }
    if (amount <= 10) {
      return "bg-sky-200";
    }
    if (amount <= 20) {
      return "bg-sky-300";
    }
    if (amount <= 25) {
      return "bg-sky-500";
    }
    return "bg-blue-600";
  };

  const findCellData = (
    currentPeriod: PeriodOption,
    xIndex: number,
    yIndex: number
  ) => {
    if (currentPeriod === "월별" || currentPeriod === "주별") {
      // 월/주: x=월(0~11), y=주차(0~4)
      return (
        data.find(
          (d) =>
            (typeof d.columnIndex === "number"
              ? d.columnIndex === xIndex
              : typeof d.monthIndex === "number" && d.monthIndex === xIndex) &&
            d.weekIndex === yIndex
        ) ?? undefined
      );
    }

    // 일별: x=일(0~30), y=최근 5개월 중 인덱스 → 실제 monthIndex로 변환
    const last5Start = Math.max(0, monthColumns.length - 5);
    const targetMonthIndex = last5Start + yIndex;
    return (
      data.find(
        (d) => d.dayIndex === xIndex && d.monthIndex === targetMonthIndex
      ) ?? undefined
    );
  };

  return (
    <div className="flex flex-col gap-6 items-center px-4 pt-8 pb-4 w-full bg-white h-[455px] max-w-[730px] max-md:w-full max-md:max-w-[600px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[350px]">
      {/* 단일 스크롤 가능한 CSS 그리드: 첫 열은 Y라벨, 이후 열은 데이터 */}
      <div
        className={
          period === "일별"
            ? "w-full overflow-x-auto"
            : "w-full overflow-x-hidden"
        }
      >
        {(() => {
          const numCols = period === "일별" ? 31 : monthColumns.length;
          const gridTemplateColumns = `88px repeat(${numCols}, 40.76px)`; // Y라벨 열 + 데이터 열들
          const gridTemplateRows = `24px repeat(5, 48px)`; // 헤더 + 5개 행

          return (
            <div
              className={
                period === "일별" ? "grid gap-2.5 min-w-max" : "grid gap-2.5"
              }
              style={{ gridTemplateColumns, gridTemplateRows }}
            >
              {/* 좌상단 빈 헤더 */}
              <div />
              {/* 헤더 가로 라벨들 */}
              {(period === "월별" || period === "주별"
                ? monthColumns.map((m) => m.label)
                : dayLabels
              ).map((label) => (
                <div
                  key={`head-${label}`}
                  className="flex items-center justify-center text-[12px] font-medium text-neutral-600"
                >
                  {label}
                </div>
              ))}

              {/* 각 행: Y축 라벨 + 데이터 셀들 */}
              {yAxisLabels.map((yLabel, yIdx) => (
                <React.Fragment key={`row-${yLabel}`}>
                  {/* Y축 라벨 셀 */}
                  <div className="flex items-center justify-center">
                    <div className="px-3 py-1 bg-zinc-100 rounded-[100px] text-base font-bold text-sky-500 max-sm:text-sm whitespace-nowrap">
                      {yLabel}
                    </div>
                  </div>

                  {/* 데이터 셀들 */}
                  {Array.from({ length: numCols }).map((_, xIdx) => {
                    const cell = findCellData(period, xIdx, yIdx);
                    const hasData = cell?.hasData ?? false;
                    const amount = cell?.amount ?? 0;
                    const titleLabel =
                      period === "일별"
                        ? `${yLabel} ${xIdx + 1}일`
                        : `${
                            (monthColumns[xIdx] && monthColumns[xIdx].label) ||
                            ""
                          } ${yIdx + 1}주차`;
                    return (
                      <div
                        key={`cell-${yLabel}-${xIdx}`}
                        className={`w-[40.76px] h-[48px] rounded-lg transition-colors ${
                          hasData
                            ? getIntensityClassByAmount(amount)
                            : "bg-gray-50 border border-gray-200 border-dashed opacity-50"
                        }`}
                        title={`${titleLabel}: ${amount.toFixed(1)}kg`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center items-start pl-20 w-full">
        <div className="flex flex-col flex-1 gap-3.5 items-center">
          <div className="flex gap-2 items-center pr-2.5 w-full h-[45px]">
            {["0kg", "3kg", "10kg", "20kg", "25kg+"].map((weight, index) => {
              const colors = [
                "bg-sky-100",
                "bg-sky-200",
                "bg-sky-300",
                "bg-sky-500",
                "bg-blue-600",
              ];
              return (
                <div
                  key={weight}
                  className="flex flex-col flex-1 gap-2 justify-center items-start h-full"
                >
                  <div
                    className={`flex-1 w-full ${colors[index]} rounded-lg`}
                  />
                  <div className="w-full text-base font-medium text-center text-neutral-600 max-sm:text-sm">
                    {weight}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
