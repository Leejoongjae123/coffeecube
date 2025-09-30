"use client";

import React from "react";
import { TabNavigationProps } from "../types";

const TabButton = ({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex gap-2 items-center px-5 h-[54px] text-lg font-semibold transition-colors ${
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
  setActiveTab,
}: TabNavigationProps) {
  const tabs = ["사용자 검색", "탈퇴 사용자 검색", "등급관리", "관리자 설정"];

  return (
    <div className="mt-7 w-full text-lg font-semibold border-b border-zinc-100 text-neutral-600 max-md:max-w-full">
      <div className="flex flex-wrap items-center w-full max-md:max-w-full">
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </TabButton>
        ))}
      </div>
    </div>
  );
}
