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
  isActive: 'Y' | 'N';
  location: string;
  currentCollection: string;
  status: '정상' | '장애 발생' | '수거 대상';
  lastCollectionDate: string;
  installationDate: string;
  totalCollection: string;
}

export interface RobotSearchFilters {
  searchCondition: string;
  searchQuery: string;
  status: string;
}

export type TabType = 'robot-register' | 'robot-search' | 'visit-register' | 'visit-schedule' | 'siheung-map';

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
