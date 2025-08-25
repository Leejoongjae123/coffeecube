"use client";

import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import SearchFilters from './SearchFilters';
import SortControls from './SortControls';
import DataTable from './DataTable';
import StatisticsDetail from './StatisticsDetail';
import type { StatisticsData, TabType } from '../types';

interface ExtractPageClientProps {
  initialData: StatisticsData[];
}

export default function ExtractPageClient({ initialData }: ExtractPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('07');
  const [regionLevel1, setRegionLevel1] = useState('전체');
  const [regionLevel2, setRegionLevel2] = useState('군');
  const [regionLevel3, setRegionLevel3] = useState('구');
  const [robotChecked, setRobotChecked] = useState(true);
  const [visitChecked, setVisitChecked] = useState(false);
  const [sortOrder, setSortOrder] = useState('오름차순');
  const [sortBy, setSortBy] = useState('상태');

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('검색 실행');
  };

  const handleReset = () => {
    setPeriod('monthly');
    setYear('2025');
    setMonth('07');
    setRegionLevel1('전체');
    setRegionLevel2('군');
    setRegionLevel3('구');
    setRobotChecked(true);
    setVisitChecked(false);
    setSortOrder('오름차순');
    setSortBy('상태');
  };

  const handleExport = () => {
    // 엑셀 내보내기 로직 구현
    console.log('엑셀 내보내기 실행');
  };

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'collection' ? (
        <>
          <SearchFilters
            period={period}
            setPeriod={setPeriod}
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            regionLevel1={regionLevel1}
            setRegionLevel1={setRegionLevel1}
            regionLevel2={regionLevel2}
            setRegionLevel2={setRegionLevel2}
            regionLevel3={regionLevel3}
            setRegionLevel3={setRegionLevel3}
            robotChecked={robotChecked}
            setRobotChecked={setRobotChecked}
            visitChecked={visitChecked}
            setVisitChecked={setVisitChecked}
            onSearch={handleSearch}
            onReset={handleReset}
          />

          <SortControls
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onExport={handleExport}
          />

          <DataTable data={initialData} />
        </>
      ) : (
        <StatisticsDetail />
      )}
    </>
  );
}
