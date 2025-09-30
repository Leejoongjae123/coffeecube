"use client";

import React from "react";
import Image from "next/image";
import { GradeTableProps } from "../types";

const TableHeader = ({
  children,
  width,
}: {
  children: React.ReactNode;
  width: string;
}) => (
  <div
    className={`flex gap-2.5 justify-center items-center px-2.5 py-4 font-bold ${width}`}
  >
    {children}
  </div>
);

const TableCell = ({
  children,
  width,
  className = "",
}: {
  children: React.ReactNode;
  width: string;
  className?: string;
}) => (
  <div
    className={`flex gap-2.5 justify-center items-center px-2.5 py-4 font-medium text-xs ${width} ${className}`}
  >
    {children}
  </div>
);

const TableRow = ({
  children,
  highlighted = false,
  onClick,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`flex flex-nowrap gap-2 justify-between items-center px-4 w-full whitespace-nowrap rounded cursor-pointer hover:bg-gray-50 transition-colors min-w-fit ${
      highlighted ? "bg-blue-100 text-primary" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default function GradeTable({
  gradeData,
  selectedRowIndex,
  setSelectedRowIndex,
  onEditGrade,
}: GradeTableProps) {
  return (
    <div className="mt-4 w-full font-medium text-center text-stone-500 max-md:max-w-full">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="text-[12px] font-bold flex flex-nowrap gap-2 justify-between items-center px-4 w-full font-bold rounded bg-zinc-100 text-neutral-600 min-w-fit">
          <TableHeader width="w-[80px]">등급 ID</TableHeader>
          <TableHeader width="w-[180px]">등급명</TableHeader>
          <TableHeader width="w-[150px]">최소 포인트</TableHeader>
          <TableHeader width="w-[150px]">최대 포인트</TableHeader>
          <TableHeader width="w-[180px]">포인트 범위</TableHeader>
          <TableHeader width="w-[140px]">생성일시</TableHeader>
          <TableHeader width="w-[80px]">관리</TableHeader>
        </div>

        {/* Table Rows */}
        {gradeData.map((grade, index) => (
          <TableRow
            key={grade.id}
            highlighted={selectedRowIndex === index}
            onClick={() => setSelectedRowIndex(index)}
          >
            <TableCell width="w-[80px]">{grade.id}</TableCell>
            <TableCell width="w-[180px]">
              <span className="font-semibold text-primary">
                {grade.grade_name}
              </span>
            </TableCell>
            <TableCell width="w-[150px]">
              {grade.min.toLocaleString()}
            </TableCell>
            <TableCell width="w-[150px]">
              {grade.max === 99999999 ? "무제한" : grade.max.toLocaleString()}
            </TableCell>
            <TableCell width="w-[180px]">
              <span className="text-gray-600">
                {grade.min.toLocaleString()} ~{" "}
                {grade.max === 99999999 ? "∞" : grade.max.toLocaleString()}
              </span>
            </TableCell>
            <TableCell width="w-[140px]">
              {new Date(grade.created_at).toLocaleDateString("ko-KR")}
            </TableCell>
            <TableCell width="w-[80px]" className="py-3.5">
              <div
                className="flex gap-1 justify-center items-center cursor-pointer hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGrade(grade);
                }}
              >
                <Image
                  src="/setting.svg"
                  alt="setting"
                  width={18}
                  height={18}
                />
                <div className="self-stretch my-auto">수정</div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </div>
    </div>
  );
}
