"use client";

import React, { useState } from "react";
import { CollectionStatistics } from "@/components/collection-statistics";
import { TabNavigation } from "./components/TabNavigation";
import { MapView } from "./components/MapView";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  // 정렬/필터 UI 비활성화 상태

  // 장비 마커는 내부에서 API로 불러오므로 목업 데이터 제거

  return (
    <div className="relative bg-white  w-full h-full my-10">
      <div className="flex flex-col gap-8 items-center ">
        {/* Header Section */}
        <div className="w-full ">
          <div className="text-3xl font-bold text-neutral-700 mb-7 max-md:text-3xl max-sm:text-2xl">
            대시보드
          </div>

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 0 ? (
          <>
            {/* Sort Controls - Only for Robot Statistics */}
            {/* <SortControls
              sortOrder={sortOrder}
              statusFilter={statusFilter}
              onSortOrderChange={setSortOrder}
              onStatusFilterChange={setStatusFilter}
            /> */}

            {/* Map Container - Only for Robot Statistics */}
            <MapView />
          </>
        ) : (
          /* Collection Statistics Tab */
          <CollectionStatistics />
        )}
      </div>
    </div>
  );
}
