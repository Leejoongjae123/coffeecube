"use client";

import React, { useState } from "react";
import UserEditModal from "@/components/user-edit-modal";
import AdminSettingsPanel from "@/components/admin-settings-panel";
import TabNavigation from "./TabNavigation";
import SearchFilters from "./SearchFilters";
import SortControls from "./SortControls";
import UserTable from "./UserTable";
import { UserData } from "../types";
import { activeUserData, withdrawnUserData } from "./userData";

export default function UsersPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeDateFilter, setActiveDateFilter] = useState(0);
  const [searchCondition, setSearchCondition] = useState("전체");
  const [sortOrder, setSortOrder] = useState("오름차순");
  const [sortBy, setSortBy] = useState("최종접속일");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2025-08-08"));
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // 현재 탭에 따른 데이터 선택
  const getCurrentUserData = () => {
    switch (activeTab) {
      case 0: // 사용자 검색
        return activeUserData;
      case 1: // 탈퇴 사용자 검색
        return withdrawnUserData;
      default:
        return [];
    }
  };

  const currentUserData = getCurrentUserData();
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

        {/* Admin Settings Panel */}
        {activeTab === 2 ? (
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
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {/* Sort Controls */}
            <SortControls
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Data Table */}
            <UserTable
              userData={currentUserData}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              onEditUser={handleEditUser}
              isWithdrawn={isWithdrawnTab}
            />
          </>
        )}
      </div>

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        userData={selectedUser || undefined}
      />
    </div>
  );
}
