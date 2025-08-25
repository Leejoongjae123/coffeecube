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
            activeTab === 'robot-register' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('robot-register')}
        >
          <span className="text-lg font-semibold">비니봇 등록</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 transition-colors ${
            activeTab === 'robot-search' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('robot-search')}
        >
          <span className="text-lg font-semibold">비니봇 검색</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 transition-colors ${
            activeTab === 'visit-register' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('visit-register')}
        >
          <span className="text-lg font-semibold">방문수거 등록·수정</span>
        </Button>
        <Button
          variant="ghost"
          className={`px-5 h-[54px] rounded-none border-b-2 transition-colors ${
            activeTab === 'visit-schedule' 
              ? 'border-b-primary text-primary' 
              : 'border-b-transparent text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onTabChange('visit-schedule')}
        >
          <span className="text-lg font-semibold">방문수거 일정조회·수거량 입력</span>
        </Button>

        {/* 나머지 공간을 채우는 빈 영역 */}
        <div className="flex-1 border-b border-zinc-100"></div>
      </div>
    </div>
  );
}
