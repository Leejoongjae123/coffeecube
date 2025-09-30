export interface StatisticsData {
  date: string;
  robotCollection: string;
  visitCollection: string;
  total: string;
}

export interface StatisticsApiResponse {
  data: StatisticsData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export interface StatisticsDetailRecord {
  date: string;
  userId: string;
  memberCode: string;
  address: string;
  robotCode: string;
  collectionAmount: string;
  collectionMethod: string; // "비니봇" | "방문수거"
}

export interface StatisticsDetailApiResponse {
  data: StatisticsDetailRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export interface FilterState {
  period: string;
  year: string;
  month: string;
  startDate?: string;
  endDate?: string;
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

export interface StatisticsStore {
  data: StatisticsData[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  filters: FilterState;
  setData: (data: StatisticsData[]) => void;
  appendData: (data: StatisticsData[]) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetData: () => void;
}

export type TabType = "collection" | "details";
