"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import TabNavigation from "./TabNavigation";
import SearchFilters from "./SearchFilters";
import SortControls from "./SortControls";
import DataTable from "./DataTable";
import StatisticsDetail from "./StatisticsDetail";
import useStatisticsStore from "../store/statisticsStore";
import { StatisticsApiResponse, TabType } from "../types";
import { exportStatisticsToExcel } from "@/components/lib/excelUtils";

interface StatisticsPageClientProps {
  initialData?: never; // initialData는 더 이상 사용하지 않음
}

export default function StatisticsPageClient({}: StatisticsPageClientProps) {
  const {
    data,
    isLoading,
    hasMore,
    filters,
    setData,
    appendData,
    setLoading,
    setHasMore,
    setCurrentPage,
    setFilters,
    resetData,
  } = useStatisticsStore();

  // 현재 날짜를 기준으로 초기값 설정
  const getCurrentDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    return { currentYear, currentMonth };
  };

  // 기간에 따른 날짜 계산 함수
  const calculateDateRange = (periodType: string) => {
    let calculatedStartDate: string;
    let calculatedEndDate: string;

    // 월별, 일별만 처리
    const yearNum = parseInt(year);
    if (periodType === "monthly") {
      calculatedStartDate = new Date(yearNum, 0, 1).toISOString().split("T")[0];
      calculatedEndDate = new Date(yearNum, 12, 0).toISOString().split("T")[0];
    } else if (periodType === "daily") {
      if (month === "전체") {
        calculatedStartDate = new Date(yearNum, 0, 1)
          .toISOString()
          .split("T")[0];
        calculatedEndDate = new Date(yearNum, 12, 0)
          .toISOString()
          .split("T")[0];
      } else {
        const monthNum = parseInt(month);
        calculatedStartDate = new Date(yearNum, monthNum - 1, 1)
          .toISOString()
          .split("T")[0];
        calculatedEndDate = new Date(yearNum, monthNum, 0)
          .toISOString()
          .split("T")[0];
      }
    } else {
      calculatedStartDate = "";
      calculatedEndDate = "";
    }

    return { calculatedStartDate, calculatedEndDate };
  };

  const [activeTab, setActiveTab] = useState<TabType>("collection");
  const [period, setPeriod] = useState(filters.period);
  const [year, setYear] = useState(filters.year);
  const [month, setMonth] = useState(filters.month);
  const [regionLevel1, setRegionLevel1] = useState(filters.regionLevel1);
  const [regionLevel2, setRegionLevel2] = useState(filters.regionLevel2);
  const [robotChecked, setRobotChecked] = useState(filters.robotChecked);
  const [visitChecked, setVisitChecked] = useState(filters.visitChecked);
  const [sortOrder, setSortOrder] = useState("내림차순");
  const [sortBy, setSortBy] = useState("날짜");

  // API 호출 함수
  const fetchStatistics = useCallback(
    async (page = 1, append = false) => {
      const currentStore = useStatisticsStore.getState();

      if (currentStore.isLoading) {
        return;
      }

      setLoading(true);

      try {
        // 기간별 날짜 계산
        const { calculatedStartDate, calculatedEndDate } =
          calculateDateRange(period);
        const apiStartDate = calculatedStartDate;
        const apiEndDate = calculatedEndDate;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          robotChecked: robotChecked.toString(),
          visitChecked: visitChecked.toString(),
          regionLevel1,
          regionLevel2,
          sortBy,
          sortOrder,
          period,
          ...(apiStartDate ? { startDate: apiStartDate } : {}),
          ...(apiEndDate ? { endDate: apiEndDate } : {}),
        });

        const response = await fetch(`/api/admin/statistics?${params}`);

        if (!response.ok) {
          return;
        }

        const result: StatisticsApiResponse = await response.json();

        if (append) {
          appendData(result.data);
        } else {
          setData(result.data);
        }

        // 더 정확한 hasMore 판단: API에서 온 값과 실제 데이터 개수를 모두 확인
        const limit = 20;
        const receivedDataCount = result.data?.length || 0;
        const actualHasMore =
          result.pagination.hasMore &&
          receivedDataCount >= limit &&
          receivedDataCount > 0;

        setHasMore(actualHasMore);
        setCurrentPage(page);
      } catch {
        // 에러 처리
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      period,
      year,
      month,
      robotChecked,
      visitChecked,
      regionLevel1,
      regionLevel2,
      sortBy,
      sortOrder,
    ]
  );

  // 더 많은 데이터 로드 (무한 스크롤)
  const handleLoadMore = useCallback(() => {
    const currentStore = useStatisticsStore.getState();

    // 중복 요청 방지를 위한 추가 체크 - 최신 상태 사용
    if (
      !currentStore.isLoading &&
      currentStore.hasMore &&
      currentStore.data.length > 0
    ) {
      fetchStatistics(currentStore.currentPage + 1, true);
    } else {
    }
  }, [fetchStatistics]);

  // 검색 실행
  const handleSearch = useCallback(() => {
    resetData();

    // 필터 상태 업데이트
    const newFilters = {
      period,
      year,
      month,
      startDate: undefined,
      endDate: undefined,
      regionLevel1,
      regionLevel2,
      robotChecked,
      visitChecked,
    };

    setFilters(newFilters);
    fetchStatistics(1, false);
  }, [
    period,
    year,
    month,
    regionLevel1,
    regionLevel2,
    robotChecked,
    visitChecked,
    resetData,
    setFilters,
    fetchStatistics,
  ]);

  // 리셋 함수
  const handleReset = useCallback(() => {
    const { currentYear } = getCurrentDate();
    setPeriod("daily");
    setYear(currentYear);
    setMonth("전체");
    setRegionLevel1("전체");
    setRegionLevel2("전체");
    setRobotChecked(true);
    setVisitChecked(true);
    setSortOrder("내림차순");
    setSortBy("날짜");

    // 스토어 리셋 및 기본값으로 검색
    resetData();
    const defaultFilters = {
      period: "daily",
      year: currentYear,
      month: "전체",
      startDate: undefined,
      endDate: undefined,
      regionLevel1: "전체",
      regionLevel2: "전체",
      robotChecked: true,
      visitChecked: true,
    };
    setFilters(defaultFilters);

    // 기본값으로 데이터 다시 로드
    setTimeout(() => {
      fetchStatistics(1, false);
    }, 100);
  }, [resetData, setFilters, fetchStatistics]);

  const handleExport = useCallback(() => {
    // 현재 표시되고 있는 데이터를 엑셀로 내보내기
    exportStatisticsToExcel(data, {
      robotChecked,
      visitChecked,
      filename: "수거량_통계_데이터",
    });
  }, [data, robotChecked, visitChecked]);

  // 컴포넌트 마운트 시 초기 데이터 로드 (필터 변경 시 자동 재조회 방지)
  const didInitFetchRef = useRef(false);
  useEffect(() => {
    if (didInitFetchRef.current) {
      return;
    }
    didInitFetchRef.current = true;
    fetchStatistics(1, false);
  }, [fetchStatistics]);

  // 기간 전환에 따른 날짜 자동 설정/초기화
  useEffect(() => {
    if (period === "daily") {
      const { currentYear } = getCurrentDate();
      if (year !== currentYear) {
        setYear(currentYear);
      }
      if (month !== "전체") {
        setMonth("전체");
      }
    } else if (period === "monthly") {
      const { currentYear } = getCurrentDate();
      if (year !== currentYear) {
        setYear(currentYear);
      }
    }
  }, [period, year, month]);

  // 정렬 변경 시 자동 재조회 제거: 사용자가 검색 버튼을 눌렀을 때만 적용
  // 필요 시 정렬만 변경하고 기존 데이터 유지

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "collection" ? (
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

          <DataTable
            data={data}
            robotChecked={robotChecked}
            visitChecked={visitChecked}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </>
      ) : (
        <StatisticsDetail />
      )}
    </>
  );
}
