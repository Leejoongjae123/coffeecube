"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RotateCcw } from "lucide-react";
import { ButtonData } from "../types";
import ButtonAddModal from "./ButtonAddModal";

export default function ButtonManagementPage() {
  const [searchCondition, setSearchCondition] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ButtonData[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<ButtonData | undefined>(
    undefined
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const searchConditions = ["전체", "번호", "버튼 이름"];

  // 데이터 페칭 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchCondition) {
        params.append("searchCondition", searchCondition);
      }
      if (searchQuery) {
        params.append("searchQuery", searchQuery);
      }

      // TODO: 실제 API 엔드포인트로 변경
      const response = await fetch(`/api/admin/buttons?${params.toString()}`);
      const result = await response.json();

      if (response.ok && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("데이터 조회 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    setSearchCondition("전체");
    setSearchQuery("");
    fetchData();
  };

  const handleRowClick = (itemId: string) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const getRowStyle = (item: ButtonData) => {
    return selectedItemId === item.id ? "bg-blue-100" : "";
  };

  const getTextStyle = (item: ButtonData) => {
    return selectedItemId === item.id ? "text-sky-500" : "text-stone-500";
  };

  const handleEditButton = (button: ButtonData) => {
    setSelectedButton(button);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedButton(undefined);
  };

  const handleSaveButton = () => {
    // 데이터 새로고침
    fetchData();
  };

  const handleAddNew = () => {
    setSelectedButton(undefined);
    setIsEditModalOpen(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newData = [...data];
    const draggedItem = newData[draggedIndex];
    newData.splice(draggedIndex, 1);
    newData.splice(index, 0, draggedItem);

    setData(newData);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setDraggedIndex(null);
    setReordering(true);

    try {
      // 순서가 변경된 버튼들의 button_no 업데이트
      const reorderedButtons = data.map((item, index) => ({
        id: item.id,
        button_no: index + 1,
      }));

      const response = await fetch("/api/admin/buttons/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ buttons: reorderedButtons }),
      });

      if (!response.ok) {
        // 실패 시 데이터 다시 불러오기
        fetchData();
      }
    } catch {
      // 오류 시 데이터 다시 불러오기
      fetchData();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="flex justify-between items-end p-8 rounded-2xl bg-stone-50 mb-4 max-md:flex-col max-md:gap-5 items-center max-md:p-5 max-sm:p-4">
        <div className="flex gap-5 items-center max-md:mt-5">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3 max-md:items-start">
            <div className="text-xl font-bold text-neutral-700 max-sm:text-base">
              검색 조건
            </div>
            <div className="flex gap-3 items-center px-3 py-2 h-[38px] w-80 text-xs bg-white rounded-md border border-gray-200 max-md:w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-2 items-center font-bold text-sky-500 cursor-pointer">
                    <div className="text-sky-500">{searchCondition}</div>
                    <Image
                      src="/arrow_down.svg"
                      alt="dropdown arrow"
                      width={10}
                      height={7}
                      className="flex-shrink-0"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {searchConditions.map((condition) => (
                    <DropdownMenuItem
                      key={condition}
                      onClick={() => setSearchCondition(condition)}
                      className={
                        searchCondition === condition
                          ? "text-sky-500 font-semibold"
                          : ""
                      }
                    >
                      {condition}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                type="text"
                placeholder="검색조건을 입력해주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 font-medium text-neutral-500 bg-transparent border-none outline-none placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center gap-3 justify-center items-center h-full">
          <Button
            onClick={handleSearch}
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-sky-500 rounded-lg w-[120px] max-sm:w-full hover:bg-sky-600 h-[43px]"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="text-[16px] font-semibold text-white">검색</span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] max-sm:w-full hover:bg-gray-50 h-[43px]"
          >
            <RotateCcw className="w-4 h-4 text-sky-500" />
            <span className="text-[16px] font-semibold text-sky-500">
              초기화
            </span>
          </Button>
          <Button
            onClick={handleAddNew}
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-primary rounded-lg w-[120px] max-sm:w-full hover:bg-primary/90 h-[43px]"
          >
            <span className="text-[16px] font-semibold text-white">
              버튼 추가
            </span>
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex flex-col items-start self-stretch max-md:overflow-x-auto">
        {/* Table Header */}
        <div className="flex justify-between items-center self-stretch px-4 py-0 rounded bg-zinc-100 max-md:min-w-[800px] max-sm:text-xs max-sm:min-w-[600px]">
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              번호
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              버튼 이름
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              명령어 수
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              생성일
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
            <div className="text-xs font-bold text-center text-neutral-600 max-sm:text-xs">
              관리
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {loading || reordering ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="text-neutral-500 text-base">
              {reordering ? "순서를 변경하는 중..." : "데이터를 불러오는 중..."}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="text-neutral-500">데이터가 없습니다.</div>
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => handleRowClick(item.id)}
              className={`flex justify-between items-center self-stretch px-4 py-0 rounded cursor-move hover:bg-gray-50 max-md:min-w-[800px] max-sm:text-xs max-sm:min-w-[600px] transition-all ${
                draggedIndex === index ? "opacity-50 bg-blue-50" : ""
              } ${getRowStyle(item)}`}
            >
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.id}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.name}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {item.commands?.length || 0}개
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
                <div
                  className={`text-xs text-center max-sm:text-xs ${getTextStyle(
                    item
                  )}`}
                >
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 flex-1">
                <div
                  className="flex gap-1 justify-center items-center cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditButton(item);
                  }}
                >
                  <Image
                    src="/setting.svg"
                    alt="setting"
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center text-xs">수정</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Button Add/Edit Modal */}
      <ButtonAddModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        buttonData={selectedButton}
        onSave={handleSaveButton}
      />
    </div>
  );
}
