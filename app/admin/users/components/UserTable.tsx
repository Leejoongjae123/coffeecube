"use client";

import React from "react";
import Image from "next/image";
import { UserTableProps } from "../types";

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

export default function UserTable({
  userData,
  selectedRowIndex,
  setSelectedRowIndex,
  onEditUser,
  isWithdrawn = false,
}: UserTableProps) {
  return (
    <div className="mt-4 w-full font-medium text-center text-stone-500 max-md:max-w-full">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="text-[12px] font-bold flex flex-nowrap gap-2 justify-between items-center px-4 w-full font-bold rounded bg-zinc-100 text-neutral-600 min-w-fit">
          <TableHeader width="w-[60px]">번호</TableHeader>
          <TableHeader width="w-[140px]">아이디</TableHeader>
          <TableHeader width="w-[120px]">휴대폰번호</TableHeader>
          <TableHeader width="w-16">배출량</TableHeader>
          <TableHeader width="w-16">포인트</TableHeader>
          <TableHeader width="w-12">등급</TableHeader>
          <TableHeader width="w-16">역할</TableHeader>
          <TableHeader width="w-[140px]">가입일시</TableHeader>
          {isWithdrawn ? (
            <TableHeader width="w-[140px]">탈퇴일시</TableHeader>
          ) : (
            <TableHeader width="w-[140px]">마지막 접속일자</TableHeader>
          )}
          {isWithdrawn && <TableHeader width="w-[120px]">탈퇴사유</TableHeader>}
          <TableHeader width="w-16">관리</TableHeader>
        </div>

        {/* Table Rows */}
        {userData.map((user, index) => (
          <TableRow
            key={user.id}
            highlighted={selectedRowIndex === index}
            onClick={() => setSelectedRowIndex(index)}
          >
            <TableCell width="w-[60px]">{user.id}</TableCell>
            <TableCell width="w-[140px]">{user.userId}</TableCell>
            <TableCell width="w-[120px]">{user.phone}</TableCell>
            <TableCell width="w-16">{user.emission}</TableCell>
            <TableCell width="w-16">{user.points}</TableCell>
            <TableCell width="w-12">{user.grade}</TableCell>
            <TableCell width="w-16">
              {user.role === "admin" ? "관리자" : "고객"}
            </TableCell>
            <TableCell width="w-[140px]">{user.joinDate}</TableCell>
            {isWithdrawn ? (
              <TableCell width="w-[140px]">{user.withdrawDate}</TableCell>
            ) : (
              <TableCell width="w-[140px]">{user.lastAccess}</TableCell>
            )}
            {isWithdrawn && (
              <TableCell width="w-[120px]">{user.withdrawReason}</TableCell>
            )}
            <TableCell width="w-16" className="py-3.5">
              <div
                className="flex gap-1 justify-center items-center cursor-pointer hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditUser(user);
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
