"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { SortControlsProps } from "../types";

export default function SortControls({
  sortOrder,
  setSortOrder,
  sortBy,
  setSortBy,
}: SortControlsProps) {
  const sortOrders = ["오름차순", "내림차순"];
  const sortOptions = ["최종접속일", "가입일시", "아이디"];

  return (
    <div className="flex flex-col mt-5 w-full text-xs max-md:max-w-full">
      <div className="flex gap-5 items-center self-end whitespace-nowrap text-neutral-500">
        <div className="self-stretch my-auto font-bold">
          정렬기준
        </div>
        <div className="flex gap-2 items-center self-stretch my-auto font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 rounded-md border border-solid cursor-pointer transition-colors bg-white border-gray-200">
                <div className="self-stretch my-auto">{sortOrder}</div>
                <ChevronDownIcon className="w-2.5 h-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOrders.map((order) => (
                <DropdownMenuItem
                  key={order}
                  onClick={() => setSortOrder(order)}
                  className={sortOrder === order ? "text-sky-500 font-semibold" : ""}
                >
                  {order}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2.5 items-center px-4 py-2.5 rounded-md border border-solid cursor-pointer transition-colors bg-white border-gray-200">
                <div className="self-stretch my-auto">{sortBy}</div>
                <ChevronDownIcon className="w-2.5 h-2.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={sortBy === option ? "text-sky-500 font-semibold" : ""}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
