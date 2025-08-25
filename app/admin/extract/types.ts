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

export type TabType = 'collection' | 'details';
