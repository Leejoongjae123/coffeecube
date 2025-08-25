"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import type { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex border-b border-zinc-100 mt-7">
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 transition-colors ${
            activeTab === 'collection' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('collection')}
        >
          <span className="text-lg font-semibold">수거량 통계</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 transition-colors ${
            activeTab === 'details' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('details')}
        >
          <span className="text-lg font-semibold">통계 상세</span>
        </Button>
        {/* 나머지 공간을 채우는 빈 영역 */}
        <div className="flex-1 border-b border-zinc-100"></div>
      </div>
    </div>
  );
}
