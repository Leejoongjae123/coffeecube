export interface UserData {
  id: string;
  userId: string;
  phone: string;
  code?: string; // 회원코드
  emission: string;
  points: string;
  grade: string;
  joinDate: string;
  lastAccess: string;
  status: "사용" | "미사용" | "active" | "withdrawn";
  withdrawDate?: string; // 탈퇴 사용자용 추가 필드
  withdrawReason?: string; // 탈퇴 사유
  fullName?: string;
  email?: string;
  role?: string;
  originalId?: string; // Supabase의 실제 ID
  decryptedPassword?: string; // 바코드 생성용 복원된 비밀번호
  hashed_password?: string; // 해싱된 비밀번호
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  isDirectInputActive: boolean;
  setIsDirectInputActive: (active: boolean) => void;
  onSearch?: () => void;
  onReset?: () => void;
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

export interface GradeData {
  id: number;
  grade_name: string;
  min: number;
  max: number;
  created_at: string;
}

export interface GradeTableProps {
  gradeData: GradeData[];
  selectedRowIndex: number | null;
  setSelectedRowIndex: (index: number | null) => void;
  onEditGrade: (grade: GradeData) => void;
}
