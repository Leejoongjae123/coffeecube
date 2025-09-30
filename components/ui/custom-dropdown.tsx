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

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  /**
   * 현재 선택된 값
   */
  value: string;
  /**
   * 드랍다운 옵션 목록
   */
  options: DropdownOption[];
  /**
   * 값 변경 콜백 함수
   */
  onValueChange: (value: string) => void;
  /**
   * 드랍다운 너비 (CSS 클래스)
   * @default "w-20"
   */
  width?: string;
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
  /**
   * 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 화살표 아이콘 종류
   * @default "primary" - blue arrow
   */
  arrowType?: "primary" | "gray";
  /**
   * 텍스트 크기
   * @default "text-xs"
   */
  textSize?: string;
}

export default function CustomDropdown({
  value,
  options,
  onValueChange,
  width = "w-20",
  placeholder = "선택",
  disabled = false,
  arrowType = "primary",
  textSize = "text-xs",
}: CustomDropdownProps) {
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;

  const arrowIcon =
    arrowType === "primary" ? "/arrow_down.svg" : "/arrow_down_gray.svg";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`flex gap-2.5 justify-between items-center h-[38px] px-3 bg-white rounded-md border-gray-200 ${width} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className={`${textSize} font-bold text-primary`}>
            {displayText}
          </span>
          <Image
            src={arrowIcon}
            alt="dropdown arrow"
            width={10}
            height={7}
            className="flex-shrink-0"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        align="start"
        sideOffset={4}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={value === option.value ? "text-primary font-bold" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
