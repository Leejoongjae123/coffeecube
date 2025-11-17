"use client";

import React from "react";
import type { TabType } from "../types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const TabButton = ({ children, active = false, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex gap-2 items-center px-5 h-[54px] text-lg font-semibold transition-colors max-sm:px-4 max-sm:h-[54px] max-sm:text-sm ${
      active
        ? "text-primary border-b-2 border-primary"
        : "text-neutral-600 hover:text-primary/70"
    }`}
  >
    {children}
  </button>
);

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const handleTabClick = (tab: TabType) => {
    onTabChange(tab);
  };

  return (
    <div className="flex flex-col gap-2.5 items-start border-b border-zinc-100 max-sm:gap-2 mb-8 mt-7">
      <div className="flex items-center w-full max-sm:flex-col max-sm:items-start">
        <TabButton
          active={activeTab === "robot-register"}
          onClick={() => handleTabClick("robot-register")}
        >
          비니봇 등록
        </TabButton>
        <TabButton
          active={activeTab === "robot-search"}
          onClick={() => handleTabClick("robot-search")}
        >
          비니봇 검색
        </TabButton>
        <TabButton
          active={activeTab === "visit-register"}
          onClick={() => handleTabClick("visit-register")}
        >
          방문수거 등록
        </TabButton>
        <TabButton
          active={activeTab === "visit-schedule"}
          onClick={() => handleTabClick("visit-schedule")}
        >
          방문수거 검색
        </TabButton>
        <TabButton
          active={activeTab === "button-management"}
          onClick={() => handleTabClick("button-management")}
        >
          버튼 관리
        </TabButton>
      </div>
    </div>
  );
}
