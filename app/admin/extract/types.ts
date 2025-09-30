export interface StatisticsData {
  date: string;
  robotCollection: string;
  visitCollection: string;
  total: string;
}

export interface FilterState {
  period: string;
  year: string;
  month: string;
  regionLevel1: string;
  regionLevel2: string;
  regionLevel3: string;
  robotChecked: boolean;
  visitChecked: boolean;
}

export interface SortState {
  sortOrder: string;
  sortBy: string;
}

export interface RobotData {
  id: string;
  code: string;
  isActive: "Y" | "N";
  location: string;
  currentCollection: string;
  status: "정상" | "장애발생" | "수거필요";
  lastCollectionDate: string;
  installationDate: string;
  totalCollection: string;
  todayInputAmount: number; // 금일 투입량
  totalInputAmount: number; // 누적 투입량
  region?: string; // 지역
  coordinates?: MapCoordinates; // 지도 좌표
  coordinates_x?: number; // X 좌표
  coordinates_y?: number; // Y 좌표
  image_x?: number; // 전체 이미지 X 좌표
  image_y?: number; // 전체 이미지 Y 좌표
}

export interface RobotSearchFilters {
  searchCondition: string;
  searchQuery: string;
  status: string;
}

export type TabType =
  | "robot-register"
  | "robot-search"
  | "visit-register"
  | "visit-schedule"
  | "siheung-map";

// 지도 관련 타입
export interface PinPoint {
  id: string;
  x: number;
  y: number;
  timestamp: Date;
}

export interface MapCoordinates {
  x: number;
  y: number;
}

export interface SiheungMapViewProps {
  onCoordinateSelect?: (x: number, y: number) => void;
  selectedCoordinates?: MapCoordinates | null;
  initialPins?: PinPoint[];
}

// API 응답 equipment_list + 부가 데이터(enriched) 타입
export interface EquipmentListRow {
  robot_code: string;
  usable: boolean;
  install_location: string;
  region?: string | null;
  coordinates_x?: number | string | null;
  coordinates_y?: number | string | null;
  image_x?: number | string | null;
  image_y?: number | string | null;
  last_used_at?: string | null;
  created_at?: string | null;
  total_input_amount?: number | string | null;
  today_input_amount?: number | string | null;
  latest_status?: {
    total_weight?: number | string | null;
    device_status?: string | null;
  } | null;
}

// 방문 등록 관련 타입
export interface VisitFormData {
  customerName: string;
  address: string;
  scheduledDate?: Date;
  visitDate?: Date;
  collectionAmount: string;
}

export interface ExtractHistoryRow {
  id: string;
  user_id: string;
  customer_name: string;
  address: string;
  robot_code: string;
  visit_date: string;
  collection_amount: number;
  created_at: string;
  updated_at: string;
}

export interface ExtractHistoryApiResponse {
  success: boolean;
  message: string;
  data?: ExtractHistoryRow;
}

// 방문 일정 표시용 타입 (방문 예정일 제거)
export interface VisitScheduleData {
  id: string;
  customerName: string;
  address: string;
  visitDate: string;
  robotCode?: string;
  collectionAmount: string;
  status: "normal" | "selected";
}

// 방문 일정 API 응답 타입
export interface VisitScheduleApiResponse {
  data: ExtractHistoryRow[];
}

// 방문 일정 수정 API 응답 타입
export interface VisitEditApiResponse {
  success: boolean;
  message: string;
  data?: ExtractHistoryRow;
}

// 방문 일정 수정 요청 타입
export interface VisitEditRequest {
  id: string;
  customerName: string;
  address: string;
  visitDate: string;
  collectionAmount: number;
}
