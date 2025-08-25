"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { SortControlsProps } from '../types';

export function SortControls({
  sortOrder,
  statusFilter,
  onSortOrderChange,
  onStatusFilterChange
}: SortControlsProps) {
  return (
    <div className="flex gap-4 items-start self-stretch max-md:flex-col max-md:gap-3">
      <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3 max-sm:w-full">
        <div>
          <div className="text-xs font-bold text-neutral-500 mb-2 max-md:text-xs">
            정렬기준
          </div>
          <div className="flex gap-2 items-center max-md:flex-col max-md:gap-1.5 max-sm:w-full">
            {/* Sort Order Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 text-xs font-medium text-neutral-500 max-sm:justify-between max-sm:w-full"
                >
                  {sortOrder}
                  <ChevronDown className="h-[10px] w-[10px] text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                <DropdownMenuItem onClick={() => onSortOrderChange("오름차순")}>
                  오름차순
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortOrderChange("내림차순")}>
                  내림차순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border border-gray-200 text-xs font-medium text-neutral-500 max-sm:justify-between max-sm:w-full"
                >
                  {statusFilter}
                  <ChevronDown className="h-[10px] w-[10px] text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                <DropdownMenuItem onClick={() => onStatusFilterChange("전체")}>
                  전체
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("정상")}>
                  정상
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("수거 대상")}>
                  수거 대상
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusFilterChange("장애 발생")}>
                  장애 발생
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
