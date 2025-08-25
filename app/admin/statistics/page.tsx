import React from 'react';
import StatisticsPageClient from './components/StatisticsPageClient';
import { StatisticsData } from './types';

export default function StatisticsPage() {
  // 서버에서 초기 데이터를 가져오는 로직 (추후 API 연동 시 사용)
  const mockData: StatisticsData[] = [
    { date: '07월 01일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 02일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 03일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 04일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 05일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 06일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 07일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 08일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
    { date: '07월 09일', robotCollection: 'nn', visitCollection: 'nn', total: 'nn' },
  ];

  return (
    <div className="relative bg-white mt-10 max-w-[1668px] w-full">
      {/* Title */}
      <div className="">
        <h1 className="text-3xl font-bold text-neutral-700 max-sm:text-2xl">통계</h1>
      </div>

      <StatisticsPageClient initialData={mockData} />
    </div>
  );
}
