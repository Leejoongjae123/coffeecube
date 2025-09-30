import { create } from "zustand";
import { StatisticsData, FilterState, StatisticsStore } from "../types";

const useStatisticsStore = create<StatisticsStore>((set) => ({
  data: [],
  isLoading: false,
  hasMore: true,
  currentPage: 1,
  totalCount: 0,
  filters: {
    period: "daily",
    year: new Date().getFullYear().toString(),
    month: "전체",
    startDate: undefined,
    endDate: undefined,
    regionLevel1: "전체",
    regionLevel2: "전체",
    regionLevel3: "전체",
    robotChecked: true,
    visitChecked: true,
  },

  setData: (data: StatisticsData[]) => {
    set({ data });
  },

  appendData: (newData: StatisticsData[]) => {
    set((state) => ({
      data: [...state.data, ...newData],
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },

  setCurrentPage: (currentPage: number) => {
    set({ currentPage });
  },

  setFilters: (newFilters: Partial<FilterState>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetData: () => {
    set({
      data: [],
      currentPage: 1,
      hasMore: true,
      totalCount: 0,
    });
  },
}));

export default useStatisticsStore;
