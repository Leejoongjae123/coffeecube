"use client";

import React, { useRef, useCallback } from "react";
import { StatisticsData } from "../types";

interface DataTableProps {
  data: StatisticsData[];
  robotChecked: boolean;
  visitChecked: boolean;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function DataTable({
  data,
  robotChecked,
  visitChecked,
  isLoading,
  hasMore,
  onLoadMore,
}: DataTableProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRowElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      if (!hasMore) {
        return;
      }

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          data.length > 0
        ) {
          onLoadMore();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore, onLoadMore, data]
  );

  // 체크된 열의 개수에 따라 최소 너비 계산
  const visibleColumns = 2 + (robotChecked ? 1 : 0) + (visitChecked ? 1 : 0); // 날짜 + 합계 + 체크된 열들
  const minWidth = visibleColumns * 140;

  return (
    <div className="flex flex-col items-start w-full overflow-x-auto text-zinc-950">
      {/* Table Header */}
      <div
        className={`flex justify-between items-center w-full rounded bg-[#EEEEEE] font-bold`}
        style={{ minWidth: `${minWidth}px` }}
      >
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
          <span className="text-xs text-center">날짜</span>
        </div>
        {robotChecked && (
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] text-[#686868]">
            <span className="text-xs text-center">비니봇 수거량</span>
          </div>
        )}
        {visitChecked && (
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] text-[#686868]">
            <span className="text-xs text-center">방문 수거량</span>
          </div>
        )}
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] text-primary">
          <span className="text-xs text-center">합계</span>
        </div>
      </div>

      {/* Table Rows */}
      {data.map((row, index) => {
        const isLastRow = index === data.length - 1;
        return (
          <div
            key={`${row.date}-${index}`}
            ref={isLastRow ? lastRowElementRef : null}
            className={`flex justify-between items-center w-full rounded border-b border-gray-100 last:border-b-0`}
            style={{ minWidth: `${minWidth}px` }}
          >
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] bg-[#EEEEEE]">
              <span className="text-xs text-center text-[#686868]">
                {row.date}
              </span>
            </div>
            {robotChecked && (
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center text-[#686868]">
                  {parseInt(row.robotCollection).toLocaleString()}g
                </span>
              </div>
            )}
            {visitChecked && (
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
                <span className="text-xs text-center text-[#686868]">
                  {parseInt(row.visitCollection).toLocaleString()}g
                </span>
              </div>
            )}
            <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] text-primary bg-[#EEEEEE]">
              <span className="text-xs text-center">{row.total}g</span>
            </div>
          </div>
        );
      })}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-sm text-gray-500">데이터를 불러오는 중...</span>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!isLoading && !hasMore && data.length > 0 && (
        <div className="flex justify-center items-center w-full py-4">
          <span className="text-sm text-gray-500">
            더 이상 불러올 데이터가 없습니다.
          </span>
        </div>
      )}

      {/* 데이터가 없을 때 */}
      {!isLoading && data.length === 0 && (
        <div className="flex justify-center items-center w-full py-8">
          <span className="text-sm text-gray-500">
            조회된 데이터가 없습니다.
          </span>
        </div>
      )}
    </div>
  );
}
