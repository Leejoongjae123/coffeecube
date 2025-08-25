"use client";

import React from 'react';
import type { TabButtonProps } from '../types';

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const TabButton = ({ 
  children, 
  active = false, 
  onClick 
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex gap-2 items-center px-5 py-4 text-lg font-semibold transition-colors max-sm:px-4 max-sm:py-3 max-sm:text-sm ${
      active 
        ? "text-neutral-600 border-b-2 border-sky-500" 
        : "text-neutral-600 hover:text-sky-400"
    }`}
  >
    {children}
  </button>
);

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-col gap-2.5 items-start border-b border-zinc-100 max-sm:gap-2">
      <div className="flex items-center w-full max-sm:flex-col max-sm:items-start">
        <TabButton 
          active={activeTab === 0}
          onClick={() => onTabChange(0)}
        >
          비니봇 통계
        </TabButton>
        <TabButton 
          active={activeTab === 1}
          onClick={() => onTabChange(1)}
        >
          수거량 통계
        </TabButton>
      </div>
    </div>
  );
}
