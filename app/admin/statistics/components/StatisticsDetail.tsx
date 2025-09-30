"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlwaysVisibleCheckbox } from "@/components/ui/always-visible-checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, RotateCcw } from "lucide-react";
import SortControls from "./SortControls";
import CustomDropdown from "@/components/ui/custom-dropdown";
import { StatisticsDetailApiResponse, StatisticsDetailRecord } from "../types";
import { exportStatisticsDetailToExcel } from "@/components/lib/excelUtils";

export default function StatisticsDetail() {
  const [timeFilter, setTimeFilter] = useState("전체");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isDirectInputActive, setIsDirectInputActive] = useState(false);
  const [regionLevel1, setRegionLevel1] = useState("전체");
  const [regionLevel2, setRegionLevel2] = useState("전체");
  const [robotChecked, setRobotChecked] = useState(true);
  const [visitChecked, setVisitChecked] = useState(true);
  const [sortOrder, setSortOrder] = useState("내림차순");
  const [sortBy, setSortBy] = useState("날짜");
  const [data, setData] = useState<StatisticsDetailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const sortOrderRef = useRef(sortOrder);
  const sortByRef = useRef(sortBy);

  const formattedStartDate = useMemo(
    () =>
      startDate ? new Date(startDate).toISOString().split("T")[0] : undefined,
    [startDate]
  );
  const formattedEndDate = useMemo(
    () => (endDate ? new Date(endDate).toISOString().split("T")[0] : undefined),
    [endDate]
  );

  // 기간에 따른 날짜 계산 함수
  const calculateDateRange = (timeFilterType: string) => {
    const now = new Date();
    let calculatedStartDate: string;
    let calculatedEndDate: string;

    switch (timeFilterType) {
      case "7일":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6); // 오늘 포함 7일
        calculatedStartDate = sevenDaysAgo.toISOString().split("T")[0];
        calculatedEndDate = now.toISOString().split("T")[0];
        break;
      case "30일":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 29); // 오늘 포함 30일
        calculatedStartDate = thirtyDaysAgo.toISOString().split("T")[0];
        calculatedEndDate = now.toISOString().split("T")[0];
        break;
      case "전체":
        // 전체인 경우 날짜 파라미터를 보내지 않음
        calculatedStartDate = "";
        calculatedEndDate = "";
        break;
      default:
        // 직접 입력인 경우 기존 날짜 사용
        calculatedStartDate = formattedStartDate || "";
        calculatedEndDate = formattedEndDate || "";
        break;
    }

    return { calculatedStartDate, calculatedEndDate };
  };

  const buildParams = (p: number) => {
    const { calculatedStartDate, calculatedEndDate } =
      calculateDateRange(timeFilter);

    const params = new URLSearchParams({
      page: String(p),
      limit: "20",
      robotChecked: String(robotChecked),
      visitChecked: String(visitChecked),
      regionLevel1,
      regionLevel2,
      sortBy,
      sortOrder,
    });

    if (calculatedStartDate && calculatedStartDate !== "") {
      params.set("startDate", calculatedStartDate);
    }
    if (calculatedEndDate && calculatedEndDate !== "") {
      params.set("endDate", calculatedEndDate);
    }
    return params;
  };

  const fetchData = async (p = 1, append = false) => {
    // 중복 요청 방지
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const params = buildParams(p);
      const res = await fetch(`/api/admin/statistics/records?${params}`);

      if (!res.ok) {
        return;
      }

      const json: StatisticsDetailApiResponse = await res.json();

      if (append) {
        setData((prev) => [...prev, ...json.data]);
      } else {
        setData(json.data);
        setCurrentPage(1);
      }

      // 더 정확한 hasMore 판단
      const receivedDataCount = json.data?.length || 0;
      const newHasMore = json.pagination.hasMore && receivedDataCount > 0;

      setHasMore(newHasMore);
      setTotalCount(json.pagination.totalCount || 0);
      setCurrentPage(p);
    } catch {
      // 에러 처리
    } finally {
      setIsLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  const handleExport = () => {
    exportStatisticsDetailToExcel(data, {
      robotChecked,
      visitChecked,
      filename: "통계_상세_데이터",
    });
  };
  const handleSearch = () => {
    setData([]);
    setHasMore(true);
    setCurrentPage(1);
    setTotalCount(0);
    fetchData(1, false);
  };

  const handleReset = () => {
    setTimeFilter("전체");
    setStartDate(undefined);
    setEndDate(undefined);
    setIsDirectInputActive(false);
    setRegionLevel1("전체");
    setRegionLevel2("전체");
    setRobotChecked(true);
    setVisitChecked(true);
    setSortOrder("내림차순");
    setSortBy("날짜");
    setData([]);
    setHasMore(true);
    setCurrentPage(1);
    setTotalCount(0);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchData(currentPage + 1, true);
    }
  };

  // ref 업데이트
  useEffect(() => {
    sortOrderRef.current = sortOrder;
    sortByRef.current = sortBy;
  }, [sortOrder, sortBy]);

  // 검색 조건이나 정렬이 변경될 때만 API 호출
  useEffect(() => {
    if (!isInitialLoad) {
      setData([]);
      setHasMore(true);
      setCurrentPage(1);
      setTotalCount(0);
      fetchData(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  // 초기 로드
  useEffect(() => {
    if (isInitialLoad) {
      fetchData(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full max-w-[1668px]">
      {/* Search Filter Section */}
      <div className="flex flex-col w-full">
        <div className="flex gap-4 p-8 w-full font-semibold rounded-2xl bg-stone-50 max-md:px-5 max-md:max-w-full h-[107px] mb-4">
          <div className="flex flex-1 gap-5 items-center">
            <div className="flex gap-3.5 items-center">
              <div className="flex gap-5 items-center">
                <div className="text-xl text-neutral-700">검색조건</div>
                <div className="flex gap-3 items-center text-sm text-center whitespace-nowrap text-neutral-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 h-[37px] ${
                      timeFilter === "전체" && !isDirectInputActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : isDirectInputActive
                        ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setTimeFilter("전체");
                      setIsDirectInputActive(false);
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                  >
                    <span className="text-sm font-bold">전체</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 h-[37px] ${
                      timeFilter === "30일" && !isDirectInputActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : isDirectInputActive
                        ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setTimeFilter("30일");
                      setIsDirectInputActive(false);
                      // 30일 전부터 오늘까지의 날짜 계산
                      const now = new Date();
                      const thirtyDaysAgo = new Date(now);
                      thirtyDaysAgo.setDate(now.getDate() - 29); // 오늘 포함 30일
                      setStartDate(thirtyDaysAgo);
                      setEndDate(now);
                    }}
                  >
                    <span className="text-sm font-bold">30일</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 h-[37px] ${
                      timeFilter === "7일" && !isDirectInputActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : isDirectInputActive
                        ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        : "bg-gray-200 text-neutral-500 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setTimeFilter("7일");
                      setIsDirectInputActive(false);
                      // 7일 전부터 오늘까지의 날짜 계산
                      const now = new Date();
                      const sevenDaysAgo = new Date(now);
                      sevenDaysAgo.setDate(now.getDate() - 6); // 오늘 포함 7일
                      setStartDate(sevenDaysAgo);
                      setEndDate(now);
                    }}
                  >
                    <span className="text-sm font-bold">7일</span>
                  </Button>
                </div>
              </div>
              <div className="flex gap-3.5 items-center">
                <button
                  onClick={() => {
                    setIsDirectInputActive(true);
                    setTimeFilter("");
                  }}
                  className={`text-base transition-colors cursor-pointer ${
                    isDirectInputActive
                      ? "font-bold text-primary"
                      : "font-normal text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  직접 입력
                </button>
                <div className="flex gap-2.5 items-center text-xs rounded-md text-neutral-500">
                  <div
                    className={`${
                      !isDirectInputActive ? "pointer-events-none" : ""
                    }`}
                  >
                    <DatePicker
                      selected={startDate}
                      onSelect={setStartDate}
                      placeholder="시작 날짜"
                      className={`w-[140px] text-xs rounded-md border ${
                        isDirectInputActive
                          ? "bg-white border-gray-200 cursor-pointer"
                          : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                      }`}
                      icon="/calendar.svg"
                    />
                  </div>
                  <div className="text-center text-xs font-bold text-neutral-500">
                    -
                  </div>
                  <div
                    className={`${
                      !isDirectInputActive ? "pointer-events-none" : ""
                    }`}
                  >
                    <DatePicker
                      selected={endDate}
                      onSelect={setEndDate}
                      placeholder="종료 날짜"
                      className={`w-[140px] text-xs rounded-md border ${
                        isDirectInputActive
                          ? "bg-white border-gray-200 cursor-pointer"
                          : "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                      }`}
                      icon="/calendar.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-5 items-center text-xs font-bold text-primary whitespace-nowrap">
              <div className="text-xl font-semibold text-neutral-700">지역</div>
              <div className="flex gap-3 items-center flex-wrap">
                <CustomDropdown
                  value={regionLevel1}
                  options={[
                    { label: "전체", value: "전체" },
                    { label: "시흥시", value: "시흥시" },
                  ]}
                  onValueChange={(value) => {
                    setRegionLevel1(value);
                    // 시흥시가 아닌 전체를 선택하면 하위 지역을 초기화
                    if (value === "전체") {
                      setRegionLevel2("전체");
                    } else {
                      // 시흥시 선택 시 하위 지역 초기화
                      setRegionLevel2("전체");
                    }
                  }}
                  width="w-20"
                  arrowType="primary"
                />

                {regionLevel1 === "시흥시" && (
                  <CustomDropdown
                    value={regionLevel2}
                    options={[
                      { label: "전체", value: "전체" },
                      { label: "대야동", value: "대야동" },
                      { label: "계수동", value: "계수동" },
                      { label: "과림동", value: "과림동" },
                      { label: "신천동", value: "신천동" },
                      { label: "은행동", value: "은행동" },
                      { label: "안현동", value: "안현동" },
                      { label: "매화동", value: "매화동" },
                      { label: "무지내동", value: "무지내동" },
                      { label: "미산동", value: "미산동" },
                      { label: "방산동", value: "방산동" },
                      { label: "포동", value: "포동" },
                      { label: "도창동", value: "도창동" },
                      { label: "하중동", value: "하중동" },
                      { label: "하상동", value: "하상동" },
                      { label: "금이동", value: "금이동" },
                      { label: "논곡동", value: "논곡동" },
                      { label: "목감동", value: "목감동" },
                      { label: "조남동", value: "조남동" },
                      { label: "산현동", value: "산현동" },
                      { label: "물왕동", value: "물왕동" },
                      { label: "광석동", value: "광석동" },
                      { label: "장현동", value: "장현동" },
                      { label: "장곡동", value: "장곡동" },
                      { label: "능곡동", value: "능곡동" },
                      { label: "군자동", value: "군자동" },
                      { label: "화정동", value: "화정동" },
                      { label: "월곶동", value: "월곶동" },
                      { label: "거모동", value: "거모동" },
                      { label: "죽율동", value: "죽율동" },
                      { label: "정왕동", value: "정왕동" },
                    ]}
                    onValueChange={setRegionLevel2}
                    width="w-24"
                    arrowType="primary"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-5 items-center text-sm">
              <div className="text-xl text-neutral-700">수거 방식</div>
              <div className="flex gap-2 items-center font-bold leading-snug whitespace-nowrap">
                <AlwaysVisibleCheckbox
                  checked={robotChecked}
                  onCheckedChange={(checked) =>
                    setRobotChecked(checked as boolean)
                  }
                />
                <div className="flex gap-1 items-center">
                  <div className="flex items-center">
                    <div
                      className={
                        robotChecked ? "text-primary" : "text-[#909092]"
                      }
                    >
                      비니봇
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center leading-snug whitespace-nowrap">
                <AlwaysVisibleCheckbox
                  checked={visitChecked}
                  onCheckedChange={(checked) =>
                    setVisitChecked(checked as boolean)
                  }
                />
                <div className="flex gap-1 items-center">
                  <div className="flex items-center">
                    <div
                      className={
                        visitChecked ? "text-primary" : "text-[#909092]"
                      }
                    >
                      방문수거
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center text-base whitespace-nowrap">
            <Button
              className="flex gap-2.5 justify-center items-center py-3 bg-primary hover:bg-primary/90 text-white rounded-lg w-[120px] h-[43px]"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
              <div className="text-[16px] font-semibold">검색</div>
            </Button>
            <Button
              variant="outline"
              className="flex gap-2.5 justify-center items-center py-3 text-primary bg-white rounded-lg border-primary border-solid border-[1.3px] hover:bg-primary/5 w-[120px] h-[43px]"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
              <div className="text-primary text-[16px] font-semibold ">
                초기화
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Sort Controls and Export Button */}
      <SortControls
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onExport={handleExport}
      />

      {/* Data Table */}
      <div className="w-full text-xs font-medium text-center max-w-[1668px] text-stone-500 max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          {/* Table Header */}
          <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-center w-full rounded bg-[#EEEEEE] max-md:max-w-full">
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto font-bold whitespace-nowrap text-neutral-600 w-[140px]">
              <div className="self-stretch my-auto">날짜</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">아이디</div>
            </div>

            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">주소</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">비니봇 코드</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">수거량</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">수거 방식</div>
            </div>
          </div>

          {/* Table Rows */}
          {data.map((row, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-10 justify-between items-center w-full rounded max-md:max-w-full h-[46px]"
            >
              <div className="flex justify-center items-center font-semibold whitespace-nowrap bg-[#EEEEEE] w-[140px] h-[46px]">
                <div>{row.date}</div>
              </div>
              <div className="flex justify-center items-center whitespace-nowrap w-[140px] h-[46px]">
                <div>{row.userId}</div>
              </div>

              <div className="flex justify-center items-center w-[140px] h-[46px]">
                <div>{row.address}</div>
              </div>
              <div className="flex justify-center items-center whitespace-nowrap w-[140px] h-[46px]">
                <div>{row.robotCode}</div>
              </div>
              <div className="flex justify-center items-center whitespace-nowrap w-[140px] h-[46px]">
                <div>{row.collectionAmount}</div>
              </div>
              <div className="flex justify-center items-center whitespace-nowrap w-[140px] h-[46px]">
                <div>{row.collectionMethod}</div>
              </div>
            </div>
          ))}

          {/* Footer: Loading / Load More / No more data */}
          <div className="flex flex-col justify-center items-center py-4 text-neutral-500 gap-3">
            {isLoading && currentPage === 1 ? (
              <span>불러오는 중...</span>
            ) : data.length === 0 ? (
              <span>표시할 데이터가 없습니다</span>
            ) : (
              <>
                {isLoading && currentPage > 1 && <span>불러오는 중...</span>}
                {!isLoading && hasMore && (
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/5"
                  >
                    더보기 ({totalCount - data.length}개 남음)
                  </Button>
                )}
                {!hasMore && data.length > 0 && (
                  <span className="text-sm">
                    더 이상 불러올 데이터가 없습니다
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
