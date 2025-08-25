"use client";

import React, { useState } from 'react';
import { CollectionStatistics } from "@/components/collection-statistics";
import { TabNavigation } from './components/TabNavigation';
import { SortControls } from './components/SortControls';
import { MapView } from './components/MapView';
import type { StatusMarker } from './types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [sortOrder, setSortOrder] = useState("오름차순");
  const [statusFilter, setStatusFilter] = useState("상태");

  // Status Markers 데이터
  const statusMarkers: StatusMarker[] = [
    {
      id: 1,
      position: { left: 500, top: 200 },
      status: "정상",
      bgColor: "bg-green-500/30",
      dotColor: "bg-green-600"
    },
    {
      id: 2,
      position: { left: 400, top: 400 },
      status: "정상",
      bgColor: "bg-green-500/30",
      dotColor: "bg-green-600"
    },
    {
      id: 3,
      position: { left: 200, top: 500 },
      status: "정상",
      bgColor: "bg-green-500/30",
      dotColor: "bg-green-600"
    },
    {
      id: 4,
      position: { left: 400, top: 250 },
      status: "정상",
      bgColor: "bg-green-500/30",
      dotColor: "bg-green-600"
    },
    {
      id: 5,
      position: { left: 600, top: 300 },
      status: "장애 발생",
      bgColor: "bg-red-500/30",
      dotColor: "bg-red-600"
    },
    {
      id: 6,
      position: { left: 500, top: 100 },
      status: "수거 대상",
      bgColor: "bg-blue-500/30",
      dotColor: "bg-blue-600"
    }
  ];

  return (
    <div className="relative bg-white  w-full h-full my-10">
      <div className="flex flex-col gap-8 items-center ">
        
        {/* Header Section */}
        <div className="w-full ">
          <div className="text-3xl font-bold text-neutral-700 mb-4 max-md:text-3xl max-sm:text-2xl">
            대시보드
          </div>
          
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 0 ? (
          <>
            {/* Sort Controls - Only for Robot Statistics */}
            <SortControls
              sortOrder={sortOrder}
              statusFilter={statusFilter}
              onSortOrderChange={setSortOrder}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Map Container - Only for Robot Statistics */}
            <MapView statusMarkers={statusMarkers} />
          </>
        ) : (
          /* Collection Statistics Tab */
          <CollectionStatistics />
        )}
      </div>
    </div>
  );
}
