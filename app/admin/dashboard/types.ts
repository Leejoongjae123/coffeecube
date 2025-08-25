export interface StatusMarker {
  id: number;
  position: {
    left: number;
    top: number;
  };
  status: string;
  bgColor: string;
  dotColor: string;
}

export interface TabButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface RegionalData {
  name: string;
  value: number;
  color: string;
}

export interface TopRegionData {
  name: string;
  value: number;
}

export interface FilterControlsProps {
  selectedPeriod: string;
  selectedMethods: string[];
  onPeriodChange: (period: string) => void;
  onMethodToggle: (method: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

export interface SortControlsProps {
  sortOrder: string;
  statusFilter: string;
  onSortOrderChange: (order: string) => void;
  onStatusFilterChange: (filter: string) => void;
}
