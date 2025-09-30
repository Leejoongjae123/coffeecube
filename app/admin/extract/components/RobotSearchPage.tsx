"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RotateCcw } from "lucide-react";
import type { RobotData, RobotSearchFilters, EquipmentListRow } from "../types";
import RobotEditModal from "./RobotEditModal";

interface RobotSearchPageProps {
  onSearch?: (filters: RobotSearchFilters) => void;
  onReset?: () => void;
}

export default function RobotSearchPage({
  onSearch,
  onReset,
}: RobotSearchPageProps) {
  const [searchCondition, setSearchCondition] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("전체");
  const [sortOrder, setSortOrder] = useState("오름차순");
  const [sortBy, setSortBy] = useState("상태");
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [robotData, setRobotData] = useState<RobotData[]>([]);
  const [filteredData, setFilteredData] = useState<RobotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<RobotData | undefined>(
    undefined
  );

  // 장비 데이터를 가져오는 함수
  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/equipment");
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "데이터를 불러오는데 실패했습니다.");
        return;
      }

      const result = await response.json();
      const equipmentList = result.data || [];

      console.log("API Response:", result);
      console.log("Equipment List:", equipmentList);

      // equipment_list 데이터를 RobotData 형식으로 변환
      const transformedData: RobotData[] = equipmentList.map(
        (equipment: EquipmentListRow, index: number) => {
          const latestStatus = equipment.latest_status;

          return {
            id: (index + 1).toString().padStart(3, "0"),
            code: (equipment.robot_code as string) || "N/A",
            isActive: (equipment.usable ? "Y" : "N") as "Y" | "N",
            location: (equipment.install_location as string) || "N/A",
            currentCollection: latestStatus?.total_weight
              ? `${latestStatus.total_weight}kg`
              : "N/A",
            status: ((latestStatus?.device_status as string) || "정상") as
              | "정상"
              | "장애발생"
              | "수거필요",
            lastCollectionDate: equipment.last_used_at
              ? new Date(equipment.last_used_at as string).toLocaleString(
                  "ko-KR"
                )
              : "",
            installationDate: equipment.created_at
              ? new Date(equipment.created_at as string).toLocaleString("ko-KR")
              : "N/A",
            totalCollection: equipment.total_input_amount
              ? `${Number(equipment.total_input_amount).toFixed(1)}kg`
              : "0.0kg",
            todayInputAmount: Number(equipment.today_input_amount) || 0,
            totalInputAmount: Number(equipment.total_input_amount) || 0,
            region: (equipment.region as string) || "시흥시",
            // 좌표는 API가 숫자로 내려오지만 혹시 문자열일 경우를 대비해 Number로 보정
            coordinates_x:
              typeof equipment.coordinates_x === "number"
                ? equipment.coordinates_x
                : equipment.coordinates_x !== undefined &&
                  equipment.coordinates_x !== null
                ? Number(equipment.coordinates_x)
                : undefined,
            coordinates_y:
              typeof equipment.coordinates_y === "number"
                ? equipment.coordinates_y
                : equipment.coordinates_y !== undefined &&
                  equipment.coordinates_y !== null
                ? Number(equipment.coordinates_y)
                : undefined,
          };
        }
      );

      console.log("Transformed Data:", transformedData);
      setRobotData(transformedData);
      setFilteredData(transformedData);
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 정렬 함수
  const applySorting = useCallback(
    (data: RobotData[]) => {
      const sorted = [...data];
      sorted.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        switch (sortBy) {
          case "비니봇 코드":
            aValue = a.code;
            bValue = b.code;
            break;
          case "사용 여부":
            aValue = a.isActive;
            bValue = b.isActive;
            break;
          case "금일 투입량":
            aValue = a.todayInputAmount;
            bValue = b.todayInputAmount;
            break;
          case "누적 투입량":
            aValue = a.totalInputAmount;
            bValue = b.totalInputAmount;
            break;
          case "상태":
          default:
            aValue = a.status;
            bValue = b.status;
            break;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "오름차순"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortOrder === "오름차순"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      });
      return sorted;
    },
    [sortOrder, sortBy]
  );

  // 데이터 필터링 및 정렬 함수
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...robotData];

    // 검색 조건 적용
    if (searchQuery.trim()) {
      filtered = filtered.filter((robot) => {
        switch (searchCondition) {
          case "비니봇 코드":
            return robot.code.toLowerCase().includes(searchQuery.toLowerCase());
          case "비니봇 위치":
            return robot.location
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          case "전체":
          default:
            return (
              robot.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              robot.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
      });
    }

    // 상태 필터 적용
    if (status !== "전체") {
      filtered = filtered.filter((robot) => robot.status === status);
    }

    // 정렬 적용
    const sorted = applySorting(filtered);
    setFilteredData(sorted);
  }, [robotData, searchCondition, searchQuery, status, applySorting]);

  // 정렬기준 변경 시 자동 적용 제거: 검색 버튼 클릭 시 필터+정렬 적용

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const searchConditions = ["전체", "비니봇 코드", "비니봇 위치"];
  const statusOptions = ["전체", "정상", "장애발생", "수거필요"];
  const sortOrders = ["오름차순", "내림차순"];
  const sortByOptions = [
    "상태",
    "비니봇 코드",
    "사용 여부",
    "금일 투입량",
    "누적 투입량",
  ];

  const handleSearch = () => {
    // 버튼 클릭 시에만 필터 적용
    applyFiltersAndSort();
    onSearch?.({
      searchCondition,
      searchQuery,
      status,
    });
  };

  const handleReset = () => {
    setSearchCondition("전체");
    setSearchQuery("");
    setStatus("전체");
    setSortOrder("오름차순");
    setSortBy("상태");
    setSelectedRobotId(null);
    setFilteredData(robotData);
    onReset?.();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "정상":
        return "text-green-700 bg-green-200";
      case "장애발생":
        return "text-rose-600 bg-red-100";
      case "수거필요":
        return "text-sky-600 bg-sky-200";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  const getRowStyle = (robot: RobotData) => {
    return selectedRobotId === robot.id ? "text-sky-500 bg-blue-100" : "";
  };

  const handleRowClick = (robotId: string) => {
    setSelectedRobotId(selectedRobotId === robotId ? null : robotId);
  };

  const handleEditRobot = (robot: RobotData) => {
    setSelectedRobot(robot);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRobot(undefined);
  };

  const handleSaveRobot = () => {
    // 데이터 새로고침
    fetchEquipmentData();
  };

  return (
    <div className="w-full max-w-[1668px]">
      {/* Search Filter Section */}
      <div className="flex flex-wrap gap-10 justify-between items-end p-8 w-full rounded-2xl bg-stone-50 mb-4">
        <div className="flex flex-wrap gap-10 items-start min-w-60">
          {/* Search Condition */}
          <div className="flex gap-5 items-center min-w-60">
            <div className="text-xl font-semibold text-neutral-700">
              검색조건
            </div>
            <div className="flex gap-3 items-center px-3 py-2 h-[38px] w-80 text-xs bg-white rounded-md border border-gray-200">
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

          {/* Status */}
          <div className="flex gap-5 items-center whitespace-nowrap">
            <div className="text-xl font-semibold text-neutral-700">상태</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-6 justify-between items-center px-3 py-2 h-[38px] w-20 text-xs font-bold text-sky-500 bg-white rounded-md border border-gray-200 cursor-pointer">
                  <div className="text-sky-500">{status}</div>
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
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setStatus(option)}
                    className={
                      status === option ? "text-sky-500 font-semibold" : ""
                    }
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 items-center text-base font-semibold whitespace-nowrap min-w-60">
          <Button
            onClick={handleSearch}
            className="flex gap-2.5 justify-center items-center py-3 text-white bg-sky-500 hover:bg-sky-600 rounded-lg w-[120px] h-[43px]"
          >
            <Search className="w-4 h-4" />
            <span className="text-[16px] font-semibold text-white">검색</span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex gap-2.5 justify-center items-center py-3 text-sky-500 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] hover:bg-sky-50 w-[120px] h-[43px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[16px] font-semibold text-sky-500">
              초기화
            </span>
          </Button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-5 items-center self-end whitespace-nowrap text-neutral-500 text-xs mb-4">
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

      {/* Data Table */}
      <div className="w-full font-medium text-center text-stone-500 text-xs">
        {/* Table Header */}
        <div className="flex gap-10 justify-between items-center px-4 w-full font-bold rounded bg-zinc-100 text-neutral-600">
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[60px]">
            <div>번호</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[140px]">
            <div>비니봇 코드</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>사용 여부</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
            <div>비니봇 위치</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>금일 투입량</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20 whitespace-nowrap">
            <div>상태</div>
          </div>
          <div className="flex justify-center items-center px-2.5 py-4 w-[200px]">
            <div>마지막 투입일시</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
            <div>설치 일시</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[100px]">
            <div>누적 투입량</div>
          </div>
          <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20">
            <div>관리</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8 w-full">
            <div className="text-neutral-500 text-base">
              데이터를 불러오는 중...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-500 text-center">
              <div className="text-lg font-semibold mb-2">
                오류가 발생했습니다
              </div>
              <div className="text-sm">{error}</div>
              <Button
                onClick={fetchEquipmentData}
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white"
              >
                다시 시도
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && robotData.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-neutral-500 text-center">
              <div className="text-lg font-semibold mb-2">
                등록된 장비가 없습니다
              </div>
              <div className="text-sm">장비를 등록해주세요.</div>
            </div>
          </div>
        )}

        {/* No Search Results */}
        {!loading &&
          !error &&
          robotData.length > 0 &&
          filteredData.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <div className="text-neutral-500 text-center">
                <div className="text-lg font-semibold mb-2">
                  검색 결과가 없습니다
                </div>
                <div className="text-sm">다른 검색 조건을 시도해보세요.</div>
              </div>
            </div>
          )}

        {/* Table Rows */}
        {!loading &&
          !error &&
          filteredData.map((robot) => (
            <div
              key={robot.id}
              onClick={() => handleRowClick(robot.id)}
              className={`flex gap-10 justify-between items-center px-4 w-full rounded cursor-pointer hover:bg-gray-50 ${getRowStyle(
                robot
              )}`}
            >
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[60px]">
                <div>{robot.id}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[140px]">
                <div>{robot.code}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
                <div>{robot.isActive}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-[200px]">
                <div className="truncate" title={robot.location}>
                  {robot.location}
                </div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
                <div>{robot.todayInputAmount.toFixed(1)}kg</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2 py-1.5 w-20 whitespace-nowrap">
                <div
                  className={`px-2 py-1.5 font-semibold rounded-[100px] ${getStatusStyle(
                    robot.status
                  )}`}
                >
                  {robot.status}
                </div>
              </div>
              <div className="flex justify-center items-center px-2.5 py-4 whitespace-nowrap w-[200px]">
                <div>{robot.lastCollectionDate}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[200px]">
                <div>{robot.installationDate}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 whitespace-nowrap w-[100px]">
                <div>{robot.totalInputAmount.toFixed(1)}kg</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center px-2.5 py-4 w-20">
                <div
                  className="flex gap-1 justify-center items-center cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRobot(robot);
                  }}
                >
                  <Image
                    src="/setting.svg"
                    alt="setting"
                    width={18}
                    height={18}
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center">수정</div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Robot Edit Modal */}
      <RobotEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        robotData={selectedRobot}
        onSave={handleSaveRobot}
      />
    </div>
  );
}
