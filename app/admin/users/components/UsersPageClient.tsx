"use client";

import React, { useState, useEffect, useCallback } from "react";
import UserEditModal from "./UserEditModal";
import AdminSettingsPanel from "./AdminSettingsPanel";
import TabNavigation from "./TabNavigation";
import SearchFilters from "./SearchFilters";
import SortControls from "./SortControls";
import UserTable from "./UserTable";
import GradeTable from "./GradeTable";
import GradeEditModal from "./GradeEditModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserData, GradeData } from "../types";

export default function UsersPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeDateFilter, setActiveDateFilter] = useState(0);
  const [searchCondition, setSearchCondition] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("내림차순");
  const [sortBy, setSortBy] = useState("가입일시");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isDirectInputActive, setIsDirectInputActive] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  // 등급관리 관련 상태
  const [gradeData, setGradeData] = useState<GradeData[]>([]);
  const [isGradeEditModalOpen, setIsGradeEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeData | null>(null);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradeModalMode, setGradeModalMode] = useState<"add" | "edit">("edit");

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    // 사용자 정보가 업데이트된 후 목록 새로고침
    loadInitialData();
  };

  // 등급관리 관련 핸들러
  const handleEditGrade = (grade: GradeData) => {
    setSelectedGrade(grade);
    setGradeModalMode("edit");
    setIsGradeEditModalOpen(true);
  };

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setGradeModalMode("add");
    setIsGradeEditModalOpen(true);
  };

  const handleCloseGradeModal = () => {
    setIsGradeEditModalOpen(false);
    setSelectedGrade(null);
    setGradeModalMode("edit");
  };

  // 검색 전용 함수
  const searchUserData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // 탭에 따른 상태 설정
      params.append("status", activeTab === 1 ? "withdrawn" : "active");

      // 정렬 설정
      const sortByMap: { [key: string]: string } = {
        최종접속일: "last_access_date",
        가입일시: "register_date",
        이름: "full_name",
        포인트: "points",
      };
      params.append("sortBy", sortByMap[sortBy] || "register_date");
      params.append("sortOrder", sortOrder === "오름차순" ? "asc" : "desc");

      // 검색 조건과 검색어
      if (searchCondition) {
        params.append("searchCondition", searchCondition);
      }
      if (searchQuery.trim()) {
        params.append("searchQuery", searchQuery.trim());
      }

      // 날짜 필터
      if (isDirectInputActive) {
        // 직접 입력 모드일 때
        if (startDate) {
          params.append("startDate", startDate.toISOString().split("T")[0]);
        }
        if (endDate) {
          params.append("endDate", endDate.toISOString().split("T")[0]);
        }
      } else if (activeDateFilter >= 0) {
        // 날짜 필터 버튼이 선택된 경우
        const now = new Date();
        let calculatedStartDate: Date | null = null;

        switch (activeDateFilter) {
          case 0: // 전체
            // 전체일 때는 날짜 필터를 적용하지 않음
            break;
          case 1: // 7일
            calculatedStartDate = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000
            );
            break;
          case 2: // 30일
            calculatedStartDate = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            break;
          case 3: // 90일
            calculatedStartDate = new Date(
              now.getTime() - 90 * 24 * 60 * 60 * 1000
            );
            break;
        }

        if (calculatedStartDate) {
          params.append(
            "startDate",
            calculatedStartDate.toISOString().split("T")[0]
          );
          params.append("endDate", now.toISOString().split("T")[0]);
        }
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
      } else {
        console.log("사용자 데이터를 가져오는데 실패했습니다:", result.error);
      }
    } catch (error) {
      console.log("API 호출 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    searchUserData();
  };

  // 초기화 핸들러
  const handleReset = () => {
    setActiveDateFilter(0); // 전체로 설정
    setSearchCondition("전체");
    setSearchQuery("");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsDirectInputActive(false);
    setSortOrder("내림차순");
    setSortBy("가입일시");

    // 초기화 후 초기 데이터 다시 로드
    setTimeout(() => {
      loadInitialData();
    }, 100); // state 업데이트가 완료된 후 실행
  };

  const handleSaveGrade = async (updatedGrade: GradeData): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/grades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedGrade.id,
          grade_name: updatedGrade.grade_name,
          min: updatedGrade.min,
          max: updatedGrade.max,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 등급 데이터 새로고침
        await fetchGradeData();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const handleAddGradeSubmit = async (
    newGrade: Omit<GradeData, "id" | "created_at">
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade_name: newGrade.grade_name,
          min: newGrade.min,
          max: newGrade.max,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 등급 데이터 새로고침
        await fetchGradeData();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const handleDeleteGrade = async (gradeId: number): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/grades", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: gradeId }),
      });

      const result = await response.json();

      if (result.success) {
        // 등급 데이터 새로고침
        await fetchGradeData();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  // API에서 등급 데이터 가져오기
  const fetchGradeData = async () => {
    setGradeLoading(true);
    try {
      const response = await fetch("/api/admin/grades");
      const result = await response.json();

      if (result.success) {
        setGradeData(result.data);
      } else {
        console.log("등급 데이터를 가져오는데 실패했습니다:", result.error);
      }
    } catch (error) {
      console.log("등급 API 호출 중 오류가 발생했습니다:", error);
    } finally {
      setGradeLoading(false);
    }
  };

  // 초기 데이터 로딩 함수
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // 탭에 따른 상태 설정
      params.append("status", activeTab === 1 ? "withdrawn" : "active");

      // 기본 정렬 설정
      const sortByMap: { [key: string]: string } = {
        최종접속일: "last_access_date",
        가입일시: "register_date",
        이름: "full_name",
        포인트: "points",
      };
      params.append("sortBy", sortByMap[sortBy] || "register_date");
      params.append("sortOrder", sortOrder === "오름차순" ? "asc" : "desc");

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setUserData(result.data);
      } else {
        console.log("사용자 데이터를 가져오는데 실패했습니다:", result.error);
      }
    } catch (error) {
      console.log("API 호출 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortBy, sortOrder]);

  // 컴포넌트 마운트 시 및 탭 변경 시 데이터 가져오기
  useEffect(() => {
    if (activeTab === 2) {
      // 등급관리 탭
      fetchGradeData();
    } else if (activeTab < 2) {
      // 사용자 관련 탭들 - 초기 데이터만 로딩
      loadInitialData();
    }
  }, [activeTab, loadInitialData]);

  // 정렬 변경 시 자동 재조회 제거: 검색 버튼을 눌렀을 때만 조회하도록 유지

  const isWithdrawnTab = activeTab === 1;

  return (
    <div className="flex overflow-hidden flex-col justify-center items-center bg-white max-w-[1668px] w-full my-10">
      <div className="flex flex-col w-full">
        {/* Page Header */}
        <div className="self-start text-3xl font-bold text-neutral-700">
          사용자 관리
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Grade Management Tab */}
        {activeTab === 2 ? (
          <div className="mt-4 w-full">
            {/* 등급 추가 버튼 */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleAddGrade}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                등급 추가
              </Button>
            </div>

            {gradeLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">
                  등급 데이터를 불러오는 중...
                </div>
              </div>
            ) : (
              <GradeTable
                gradeData={gradeData}
                selectedRowIndex={selectedRowIndex}
                setSelectedRowIndex={setSelectedRowIndex}
                onEditGrade={handleEditGrade}
              />
            )}
          </div>
        ) : activeTab === 3 ? (
          /* Admin Settings Panel */
          <div className="mt-8 w-full flex justify-center">
            <AdminSettingsPanel />
          </div>
        ) : (
          <>
            {/* Search Filters */}
            <SearchFilters
              activeDateFilter={activeDateFilter}
              setActiveDateFilter={setActiveDateFilter}
              searchCondition={searchCondition}
              setSearchCondition={setSearchCondition}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              isDirectInputActive={isDirectInputActive}
              setIsDirectInputActive={setIsDirectInputActive}
              onSearch={handleSearch}
              onReset={handleReset}
            />

            {/* Sort Controls */}
            <SortControls
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Data Table */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">데이터를 불러오는 중...</div>
              </div>
            ) : (
              <UserTable
                userData={userData}
                selectedRowIndex={selectedRowIndex}
                setSelectedRowIndex={setSelectedRowIndex}
                onEditUser={handleEditUser}
                isWithdrawn={isWithdrawnTab}
              />
            )}
          </>
        )}
      </div>

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onUserUpdated={handleUserUpdated}
        userData={
          selectedUser
            ? ({
                ...selectedUser,
                code: selectedUser.code || selectedUser.userId,
                status: selectedUser.status === "active" ? "사용" : "미사용",
                originalId: selectedUser.originalId,
              } as Parameters<typeof UserEditModal>[0]["userData"])
            : undefined
        }
      />

      {/* Grade Edit Modal */}
      <GradeEditModal
        isOpen={isGradeEditModalOpen}
        onClose={handleCloseGradeModal}
        gradeData={
          gradeModalMode === "edit" ? selectedGrade || undefined : undefined
        }
        onSave={handleSaveGrade}
        onAdd={handleAddGradeSubmit}
        onDelete={handleDeleteGrade}
        mode={gradeModalMode}
      />
    </div>
  );
}
