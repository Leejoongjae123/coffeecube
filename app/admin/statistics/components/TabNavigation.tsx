"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-col gap-2.5 items-start border-b border-zinc-100 mb-8 w-full">
      <div className="flex relative items-center">
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 ${
            activeTab === 'collection' 
              ? 'border-b-[#0E8FEB] text-[#0E8FEB]' 
              : 'border-b-transparent text-gray-600'
          }`}
          onClick={() => onTabChange('collection')}
        >
          <span className="text-lg font-semibold">수거량 통계</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 ${
            activeTab === 'details' 
              ? 'border-b-[#0E8FEB] text-[#0E8FEB]' 
              : 'border-b-transparent text-gray-600'
          }`}
          onClick={() => onTabChange('details')}
        >
          <span className="text-lg font-semibold">통계 상세</span>
        </Button>
      </div>
    </div>
  );
}
