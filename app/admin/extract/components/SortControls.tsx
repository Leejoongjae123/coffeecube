"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download } from "lucide-react";

interface SortControlsProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  sortBy: string;
  setSortBy: (by: string) => void;
  onExport: () => void;
}

export default function SortControls({
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
  onExport,
}: SortControlsProps) {
  const sortOrders = ['오름차순', '내림차순'];
  const sortByOptions = ['날짜', '로봇 수거량', '방문 수거량', '총합'];

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        {/* 정렬 기준 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">정렬:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {sortBy}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortByOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 정렬 순서 */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                {sortOrder}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOrders.map((order) => (
                <DropdownMenuItem key={order} onClick={() => setSortOrder(order)}>
                  {order}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 엑셀 내보내기 버튼 */}
      <Button onClick={onExport} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        엑셀 내보내기
      </Button>
    </div>
  );
}
