export interface UserData {
  id: string;
  userId: string;
  phone: string;
  code: string;
  emission: string;
  points: string;
  grade: string;
  joinDate: string;
  lastAccess: string;
  status: "사용" | "미사용";
  withdrawDate?: string; // 탈퇴 사용자용 추가 필드
  withdrawReason?: string; // 탈퇴 사유
}

export interface FilterState {
  activeTab: number;
  activeDateFilter: number;
  searchCondition: string;
  sortOrder: string;
  sortBy: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedRowIndex: number | null;
}

export interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export interface SearchFiltersProps {
  activeDateFilter: number;
  setActiveDateFilter: (index: number) => void;
  searchCondition: string;
  setSearchCondition: (condition: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export interface SortControlsProps {
  sortOrder: string;
  setSortOrder: (order: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export interface UserTableProps {
  userData: UserData[];
  selectedRowIndex: number | null;
  setSelectedRowIndex: (index: number | null) => void;
  onEditUser: (user: UserData) => void;
  isWithdrawn?: boolean;
}
