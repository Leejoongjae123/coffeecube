"use client";

import React from 'react';

export interface StatisticsData {
  date: string;
  robotCollection: string;
  visitCollection: string;
  total: string;
}

interface DataTableProps {
  data: StatisticsData[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="flex flex-col items-start w-full overflow-x-auto">
      {/* Table Header */}
      <div className="flex justify-between items-center w-full rounded bg-[#EEEEEE] min-w-[560px] font-bold">
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
          <span className="text-xs text-center">날짜</span>
        </div>
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
          <span className="text-xs text-center">비니봇 수거량</span>
        </div>
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
          <span className="text-xs text-center">방문 수거량</span>
        </div>
        <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
          <span className="text-xs text-center">합계</span>
        </div>
      </div>

      {/* Table Rows */}
      {data.map((row, index) => (
        <div
          key={index}
          className="flex justify-between items-center w-full rounded min-w-[560px] border-b border-gray-100 last:border-b-0"
        >
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px] bg-[#EEEEEE]">
            <span className="text-xs text-center">{row.date}</span>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
            <span className="text-xs text-center">{row.robotCollection}</span>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
            <span className="text-xs text-center">{row.visitCollection}</span>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px] max-sm:w-[120px]">
            <span className="text-xs text-center">{row.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
