"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ChevronDown, FileSpreadsheet } from "lucide-react";

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
  onExport
}: SortControlsProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
        <Label className="text-xs font-bold text-neutral-500">정렬기준</Label>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-4 py-2.5 bg-white rounded-md border-gray-200">
                <span className="text-xs font-medium text-neutral-500">{sortOrder}</span>
                <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOrder('오름차순')}>오름차순</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('내림차순')}>내림차순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-4 py-2.5 bg-white rounded-md border-gray-200">
                <span className="text-xs font-medium text-neutral-500">{sortBy}</span>
                <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('상태')}>상태</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('날짜')}>날짜</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('수거량')}>수거량</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg" onClick={onExport}>
        <FileSpreadsheet className="h-6 w-6 mr-3" />
        엑셀 저장
      </Button>
    </div>
  );
}
