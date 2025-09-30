"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface SortControlsProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onExport: () => void;
}

export default function SortControls({
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  onExport,
}: SortControlsProps) {
  const sortOrders = ["오름차순", "내림차순"];
  // 통계 테이블은 날짜/합계 기준만 지원
  const sortByOptions = ["날짜", "합계"];

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Sort Controls */}
      <div className="flex gap-5 items-center self-end whitespace-nowrap text-neutral-500 text-xs">
        <div className="font-bold">정렬기준</div>
        <div className="flex gap-2 items-center font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 cursor-pointer">
                <div>{sortOrder}</div>
                <Image
                  src="/arrow_down_gray.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOrders.map((order) => (
                <DropdownMenuItem
                  key={order}
                  onClick={() => setSortOrder(order)}
                  className={
                    sortOrder === order ? "text-sky-500 font-semibold" : ""
                  }
                >
                  {order}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 cursor-pointer">
                <div>{sortBy}</div>
                <Image
                  src="/arrow_down_gray.svg"
                  alt="dropdown arrow"
                  width={10}
                  height={7}
                  className="flex-shrink-0"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortByOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={
                    sortBy === option ? "text-sky-500 font-semibold" : ""
                  }
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Export Button */}
      <Button
        className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg h-[40px]"
        onClick={onExport}
      >
        <Image src="/excel.svg" alt="excel" width={24} height={24} />
        <span className="text-[14px] font-bold">엑셀 저장</span>
      </Button>
    </div>
  );
}
