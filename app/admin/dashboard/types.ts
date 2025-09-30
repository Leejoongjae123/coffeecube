// 기존 타입들
export interface StatusMarker {
  id: number;
  position: { left: number; top: number };
  status: string;
  bgColor: string;
  dotColor: string;
}

// 주차별 데이터 타입 추가
export interface WeeklyData {
  // 월별 모드: columnIndex는 과거 12개월 중 0~11 (오래된 -> 최신)
  // 주/일별 모드: dayIndex는 0~30 (1~31일), columnIndex는 사용하지 않을 수 있음
  monthIndex?: number; // 과거 호환용(기존 데이터)
  columnIndex?: number; // 히트맵 가로축 인덱스(월별: 0~11, 주/일별: 0~30)
  dayIndex?: number; // 주/일별: 0~30
  weekIndex: number; // 0~4 (1~5주차)
  amount: number;
  hasData: boolean;
}

export interface WeeklyHeatmapProps {
  data?: WeeklyData[];
  year?: number;
  period: PeriodOption;
}

// 장비 지도 표기를 위한 최소 데이터 타입
export interface EquipmentMapRow {
  robot_code: string;
  install_location?: string | null;
  region?: string | null;
  coordinates_x?: number | string | null;
  coordinates_y?: number | string | null;
  image_x?: number | string | null; // 원본 이미지 가로(px)
  image_y?: number | string | null; // 원본 이미지 세로(px)
  today_input_amount?: number | string | null;
  latest_status?: {
    device_status?: string | null;
    total_weight?: number | string | null;
  } | null;
}

export type MarkerStatus = "정상" | "수거 대상" | "장애발생";

export interface MapMarker {
  id: string; // robot_code
  left: number;
  top: number;
  status: MarkerStatus;
  bgColor: string;
  dotColor: string;
  robotCode: string;
  locationText: string;
  todayAmountKg: number;
}

export interface FilterControlsProps {
  selectedPeriod: PeriodOption;
  selectedMethod: CollectionMethod;
  onPeriodChange: (period: PeriodOption) => void;
  onMethodChange: (method: CollectionMethod) => void;
  onSearch: () => void;
  onReset: () => void;
}

// 차트/필터 공용 타입 확장
export type PeriodOption = "월별" | "주별" | "일별";
export type CollectionMethod = "비니봇" | "방문수거";

export interface StatisticsItem {
  date: string; // 라벨(YYYY년 M월 | MM월 DD일 | YYYY년 W주)
  robotCollection: string; // 소수점 문자열
  visitCollection: string; // 소수점 문자열
  total: string; // 소수점 문자열
}

export interface MonthlyChartProps {
  period: PeriodOption;
  method: CollectionMethod;
}

// 지역별 통계/Top3에 사용되는 타입
export interface RegionalData {
  name: string;
  value: number;
  color: string;
}

export interface TopRegionData {
  name: string;
  value: number;
}

export interface RegionalPieChartProps {
  period: PeriodOption;
  method: CollectionMethod;
}

export interface Top3ChartProps {
  period: PeriodOption;
  method: CollectionMethod;
}

export interface SortControlsProps {
  sortOrder: string;
  statusFilter: string;
  onSortOrderChange: (order: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export interface TabButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}
